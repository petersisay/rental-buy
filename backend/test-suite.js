import http from 'http';

const BASE_URL = 'http://127.0.0.1:8000';

function request(method, path, body = null) {
  const url = new URL(path, BASE_URL);
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const duration = Date.now() - start;
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({ status: res.statusCode, duration, data: json });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Kedami Automated Backend & Performance Test Suite...\n');
  const results = [];

  const test = async (name, fn) => {
    try {
      const res = await fn();
      results.push({ name, passed: true, ...res });
      console.log(`✅ [PASS] ${name} (${res.duration}ms) - Status: ${res.status}`);
    } catch (err) {
      results.push({ name, passed: false, error: err.message });
      console.error(`❌ [FAIL] ${name} - Error: ${err.message}`);
    }
  };

  // 1. Health check
  await test('GET /api/health (Server & DB Health)', async () => {
    const res = await request('GET', '/api/health');
    if (res.status !== 200 || !res.data.status) throw new Error('Invalid health response');
    return res;
  });

  // 2. Fetch all properties
  let samplePropId = null;
  await test('GET /api/properties (All Listings)', async () => {
    const res = await request('GET', '/api/properties');
    if (res.status !== 200 || !Array.isArray(res.data) || res.data.length === 0) throw new Error('Properties not found');
    samplePropId = res.data[0]._id || res.data[0].id;
    return res;
  });

  // 3. Filter by city: Addis Ababa
  await test('GET /api/properties?city=Addis Ababa', async () => {
    const res = await request('GET', '/api/properties?city=Addis%20Ababa');
    if (res.status !== 200 || !Array.isArray(res.data)) throw new Error('Failed to filter by city');
    return res;
  });

  // 4. Filter by city: Adama
  await test('GET /api/properties?city=Adama', async () => {
    const res = await request('GET', '/api/properties?city=Adama');
    if (res.status !== 200 || !Array.isArray(res.data)) throw new Error('Failed to filter by city');
    return res;
  });

  // 5. Filter by purpose: Rent
  await test('GET /api/properties?purpose=Rent', async () => {
    const res = await request('GET', '/api/properties?purpose=Rent');
    if (res.status !== 200 || !Array.isArray(res.data)) throw new Error('Failed to filter by purpose');
    return res;
  });

  // 6. Submit Contact / Rent / Buy Lead
  await test(`POST /api/properties/${samplePropId}/contact (Customer Inquiry)`, async () => {
    const res = await request('POST', `/api/properties/${samplePropId}/contact`, {
      name: 'Automated Test Customer',
      email: 'customer.test@kedami.et',
      phone: '+251911998877',
      message: 'Testing inquiry for rent and inspection schedule.',
      inquiryType: 'rent',
      propertyTitle: 'Sample Modern Flat'
    });
    if (res.status !== 200 || res.data.status !== 'success') throw new Error('Contact submission failed');
    return res;
  });

  // 7. List contacts filtered by customer email
  await test('GET /api/contact?email=customer.test@kedami.et (Customer Inbox)', async () => {
    const res = await request('GET', '/api/contact?email=customer.test@kedami.et');
    if (res.status !== 200 || !Array.isArray(res.data) || res.data.length === 0) throw new Error('Customer inquiries lookup failed');
    return res;
  });

  // 8. Fetch Developer Projects
  await test('GET /api/developer-projects (Ayat, Tsehay, Noah, Flintstone)', async () => {
    const res = await request('GET', '/api/developer-projects');
    if (res.status !== 200 || !Array.isArray(res.data) || res.data.length === 0) throw new Error('Developer projects missing');
    return res;
  });

  // 9. Demo Login for Customer
  let customerUser = null;
  await test('POST /api/auth/demo-login (Customer Role)', async () => {
    const res = await request('POST', '/api/auth/demo-login', { role: 'customer' });
    if (res.status !== 200 || !res.data.user) throw new Error('Customer demo login failed');
    customerUser = res.data.user;
    return res;
  });

  // 10. Demo Login for Admin
  await test('POST /api/auth/demo-login (Admin Role)', async () => {
    const res = await request('POST', '/api/auth/demo-login', { role: 'admin' });
    if (res.status !== 200 || res.data.user.role !== 'admin') throw new Error('Admin demo login failed');
    return res;
  });

  // 11. Admin Stats
  await test('GET /api/admin/stats (Platform KPIs)', async () => {
    const res = await request('GET', '/api/admin/stats');
    if (res.status !== 200 || res.data.totalProperties === undefined) throw new Error('Admin stats failed');
    return res;
  });

  // 12. Admin Users List
  await test('GET /api/admin/users (User Approval Management)', async () => {
    const res = await request('GET', '/api/admin/users');
    if (res.status !== 200 || !Array.isArray(res.data)) throw new Error('Admin users lookup failed');
    return res;
  });

  // 13. Update Customer Profile
  if (customerUser) {
    const custId = customerUser.id || customerUser._id;
    await test(`PATCH /api/auth/users/${custId}/profile (Profile Update)`, async () => {
      const res = await request('PATCH', `/api/auth/users/${custId}/profile`, {
        name: 'Tigist Alemu (Verified Customer)',
        phone: '+251 911 556677',
        city: 'Addis Ababa'
      });
      if (res.status !== 200 || res.data.user.name !== 'Tigist Alemu (Verified Customer)') throw new Error('Profile update failed');
      return res;
    });
  }

  console.log('\n========================================');
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const avgDuration = Math.round(results.reduce((acc, r) => acc + (r.duration || 0), 0) / (passed || 1));
  console.log(`📊 Test Results: ${passed}/${total} passed`);
  console.log(`⚡ Average Response Time: ${avgDuration}ms`);
  console.log('========================================\n');

  if (passed === total) {
    console.log('🎉 ALL BACKEND SYSTEMS FULLY FUNCTIONING AND READY FOR DEPLOYMENT!');
  } else {
    process.exit(1);
  }
}

runTests();
