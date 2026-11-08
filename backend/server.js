import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Property } from './models/Property.js';
import { ContactSubmission } from './models/ContactSubmission.js';
import { DeveloperProject } from './models/DeveloperProject.js';
import { User } from './models/User.js';
import { seedProperties, seedProjects, seedUsers } from './seedData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
// Increase JSON payload limit to 15mb to comfortably support user base64 photo uploads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// In-Memory Fallback store if MongoDB daemon is unreachable locally
let isInMemoryFallback = false;
let inMemoryProperties = [...seedProperties.map((p, idx) => ({ ...p, id: `prop-${idx + 1}`, _id: `prop-${idx + 1}`, createdAt: new Date() }))];
let inMemoryContacts = [];
let inMemoryProjects = [...seedProjects.map((p, idx) => ({ ...p, id: `proj-${idx + 1}`, _id: `proj-${idx + 1}`, createdAt: new Date() }))];
let inMemoryUsers = [...seedUsers.map((u, idx) => ({ ...u, id: u.id || `usr-${idx + 1}`, _id: u._id || `usr-${idx + 1}`, createdAt: u.createdAt || new Date() }))];

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kedami';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`✅ MongoDB connected successfully to: ${MONGODB_URI}`);

    // Auto-seed if database is empty
    const propCount = await Property.countDocuments();
    if (propCount === 0) {
      console.log('Seeding initial 20 Ethiopian properties...');
      await Property.insertMany(seedProperties);
      console.log('✅ Properties seeded.');
    }

    const projCount = await DeveloperProject.countDocuments();
    if (projCount === 0) {
      console.log('Seeding developer projects...');
      await DeveloperProject.insertMany(seedProjects);
      console.log('✅ Developer projects seeded.');
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding initial demo users and pending signups...');
      await User.insertMany(seedUsers);
      console.log('✅ Users seeded.');
    }
  } catch (err) {
    console.warn(`⚠️ Local MongoDB connection failed (${err.message}).`);
    console.log('ℹ️ Running in resilient In-Memory MERN mode with 20 seeded Ethiopian properties and demo users.');
    isInMemoryFallback = true;
  }
}

connectDB();

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    mode: isInMemoryFallback ? 'in-memory-fallback' : 'mongodb',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// AUTHENTICATION & USER MANAGEMENT ROUTES
// ==========================================

// POST /api/auth/login - Google & Email Sign-In / Registration
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, name, avatar, googleId, role, company, phone } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    if (!isInMemoryFallback) {
      let user = await User.findOne({ email: normalizedEmail });

      if (user) {
        // Update avatar or name if Google account provided new values
        if (avatar && !user.avatar) user.avatar = avatar;
        if (googleId && !user.googleId) user.googleId = googleId;
        await user.save();
        return res.json({ user, isNew: false });
      }

      // Determine initial approval status:
      // Pre-approved admin, demo domains and regular customers/seekers get 'approved' without waiting
      // New self-registered owners, agents and developers get 'pending' (requires Admin Approval)
      const assignedRole = role || (normalizedEmail === 'admin@kedami.et' ? 'admin' : 'customer');
      const isAutoApproved = normalizedEmail === 'admin@kedami.et' || 
                             normalizedEmail.endsWith('@kedami.et') || 
                             assignedRole === 'seeker' || 
                             assignedRole === 'customer';

      user = new User({
        name: name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || normalizedEmail)}&background=10b981&color=fff`,
        googleId: googleId || null,
        role: assignedRole,
        company: company || '',
        phone: phone || '',
        status: isAutoApproved ? 'approved' : 'pending' // Admin approval not needed for customers
      });

      await user.save();
      return res.status(201).json({ user, isNew: true });
    } else {
      // In-Memory fallback
      let user = inMemoryUsers.find(u => u.email.toLowerCase() === normalizedEmail);

      if (user) {
        return res.json({ user, isNew: false });
      }

      const assignedRole = role || (normalizedEmail === 'admin@kedami.et' ? 'admin' : 'customer');
      const isAutoApproved = normalizedEmail === 'admin@kedami.et' || 
                             normalizedEmail.endsWith('@kedami.et') || 
                             assignedRole === 'seeker' || 
                             assignedRole === 'customer';
      const newId = `usr-${Date.now()}`;

      user = {
        id: newId,
        _id: newId,
        name: name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || normalizedEmail)}&background=10b981&color=fff`,
        googleId: googleId || null,
        role: assignedRole,
        company: company || '',
        phone: phone || '',
        status: isAutoApproved ? 'approved' : 'pending',
        createdAt: new Date()
      };

      inMemoryUsers.unshift(user);
      return res.status(201).json({ user, isNew: true });
    }
  } catch (err) {
    console.error('Error in login/auth:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// POST /api/auth/demo-login - Instant 1-Click Demo Login for any role
app.post('/api/auth/demo-login', async (req, res) => {
  try {
    const { role } = req.body;
    const targetRole = (role || 'customer').toLowerCase();

    const roleEmailMap = {
      admin: 'admin@kedami.et',
      owner: 'owner.demo@kedami.et',
      agent: 'agent.demo@kedami.et',
      developer: 'developer.demo@kedami.et',
      seeker: 'customer.demo@kedami.et',
      customer: 'customer.demo@kedami.et'
    };

    const targetEmail = roleEmailMap[targetRole] || 'customer.demo@kedami.et';

    if (!isInMemoryFallback) {
      let user = await User.findOne({ email: targetEmail });
      if (!user) {
        const seedMatch = seedUsers.find(u => u.email === targetEmail);
        if (seedMatch) {
          user = new User(seedMatch);
          await user.save();
        }
      }
      return res.json({ user });
    } else {
      let user = inMemoryUsers.find(u => u.email === targetEmail);
      if (!user) {
        user = seedUsers.find(u => u.email === targetEmail);
        if (user) inMemoryUsers.push(user);
      }
      return res.json({ user });
    }
  } catch (err) {
    console.error('Error in demo login:', err);
    res.status(500).json({ error: 'Demo login failed' });
  }
});

// GET /api/auth/users - List users with status filtering (Admin User Approvals Queue)
app.get('/api/auth/users', async (req, res) => {
  try {
    const { status, role } = req.query;

    if (!isInMemoryFallback) {
      const filter = {};
      if (status && status !== 'all') filter.status = status;
      if (role && role !== 'all') filter.role = role;

      const users = await User.find(filter).sort({ createdAt: -1 });
      return res.json(users);
    } else {
      let list = [...inMemoryUsers];
      if (status && status !== 'all') list = list.filter(u => u.status === status);
      if (role && role !== 'all') list = list.filter(u => u.role === role);
      return res.json(list);
    }
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// PATCH /api/auth/users/:id/status - Approve or Reject User Sign-In (Admin Portal)
app.patch('/api/auth/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'pending', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid user approval status' });
    }

    if (!isInMemoryFallback && mongoose.isValidObjectId(id)) {
      const updated = await User.findByIdAndUpdate(id, { status }, { new: true });
      if (!updated) return res.status(404).json({ error: 'User not found' });
      return res.json(updated);
    }

    const idx = inMemoryUsers.findIndex(u => u.id === id || u._id === id);
    if (idx === -1) return res.status(404).json({ error: 'User not found' });

    inMemoryUsers[idx].status = status;
    return res.json(inMemoryUsers[idx]);
  } catch (err) {
    console.error('Error updating user status:', err);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// PATCH /api/auth/users/:id/profile - Update User Profile
app.patch('/api/auth/users/:id/profile', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, company, city, avatar } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (company !== undefined) updates.company = company;
    if (city) updates.city = city;
    if (avatar) updates.avatar = avatar;

    if (!isInMemoryFallback && mongoose.isValidObjectId(id)) {
      const updated = await User.findByIdAndUpdate(id, updates, { new: true });
      if (!updated) return res.status(404).json({ error: 'User not found' });
      const userObj = updated.toJSON();
      return res.json({ status: 'success', user: updated, ...userObj });
    }

    const idx = inMemoryUsers.findIndex(u => u.id === id || u._id === id);
    if (idx === -1) return res.status(404).json({ error: 'User not found' });

    inMemoryUsers[idx] = { ...inMemoryUsers[idx], ...updates };
    return res.json({ status: 'success', user: inMemoryUsers[idx], ...inMemoryUsers[idx] });
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ==========================================
// PROPERTY ROUTES
// ==========================================

// GET /api/properties - Search and Filter
app.get('/api/properties', async (req, res) => {
  try {
    const { city, purpose, property_type, min_price, max_price, bhk, search, role, status } = req.query;

    if (!isInMemoryFallback) {
      const filter = {};

      if (city) {
        filter.$or = [
          { city: new RegExp(city, 'i') },
          { city_am: new RegExp(city, 'i') }
        ];
      }

      if (purpose) {
        filter.purpose = purpose.toLowerCase();
      }

      if (property_type) {
        const pt = property_type.toLowerCase();
        if (pt === 'house' || pt === 'hause') {
          filter.property_type = { $in: ['house', 'hause'] };
        } else {
          filter.property_type = pt;
        }
      }

      if (bhk) {
        filter.bhk = Number(bhk);
      }

      if (min_price || max_price) {
        filter.price = {};
        if (min_price) filter.price.$gte = Number(min_price);
        if (max_price) filter.price.$lte = Number(max_price);
      }

      if (role) {
        filter.role = role.toLowerCase();
      }

      // Default: show approved properties unless specified (e.g. for Admin portal)
      if (status) {
        if (status !== 'all') filter.status = status;
      } else {
        filter.status = 'approved';
      }

      if (search) {
        const regex = new RegExp(search, 'i');
        filter.$or = [
          { title: regex },
          { title_am: regex },
          { locality: regex },
          { locality_am: regex },
          { description: regex },
          { description_am: regex },
          { amenities: regex },
          { amenities_am: regex }
        ];
      }

      const properties = await Property.find(filter).sort({ createdAt: -1 });
      return res.json(properties);
    } else {
      // In-memory filter logic
      let list = [...inMemoryProperties];

      if (city) {
        const cLower = city.toLowerCase();
        list = list.filter(p => 
          (p.city && p.city.toLowerCase().includes(cLower)) || 
          (p.city_am && p.city_am.includes(city))
        );
      }

      if (purpose) {
        list = list.filter(p => p.purpose === purpose.toLowerCase());
      }

      if (property_type) {
        const pt = property_type.toLowerCase();
        if (pt === 'house' || pt === 'hause') {
          list = list.filter(p => p.property_type === 'house' || p.property_type === 'hause');
        } else {
          list = list.filter(p => p.property_type === pt);
        }
      }

      if (bhk) {
        list = list.filter(p => p.bhk === Number(bhk));
      }

      if (min_price) {
        list = list.filter(p => p.price >= Number(min_price));
      }

      if (max_price) {
        list = list.filter(p => p.price <= Number(max_price));
      }

      if (role) {
        list = list.filter(p => p.role === role.toLowerCase());
      }

      if (status && status !== 'all') {
        list = list.filter(p => p.status === status);
      } else if (!status) {
        list = list.filter(p => p.status === 'approved');
      }

      if (search) {
        const sLower = search.toLowerCase();
        list = list.filter(p => 
          (p.title && p.title.toLowerCase().includes(sLower)) || 
          (p.title_am && p.title_am.includes(search)) || 
          (p.locality && p.locality.toLowerCase().includes(sLower)) || 
          (p.locality_am && p.locality_am.includes(search)) || 
          (p.description && p.description.toLowerCase().includes(sLower)) || 
          (p.amenities && p.amenities.toLowerCase().includes(sLower))
        );
      }

      return res.json(list);
    }
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// GET /api/properties/:id
app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isInMemoryFallback && mongoose.isValidObjectId(id)) {
      const property = await Property.findById(id);
      if (!property) return res.status(404).json({ error: 'Property not found' });
      return res.json(property);
    }

    const found = inMemoryProperties.find(p => p.id === id || p._id === id);
    if (!found) return res.status(404).json({ error: 'Property not found' });
    return res.json(found);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving property' });
  }
});

// POST /api/properties - Add new property with image uploads (Admin approvals queue)
app.post('/api/properties', async (req, res) => {
  try {
    const body = req.body;

    // Validate required fields
    if (!body.title || !body.city || !body.locality || !body.price || !body.purpose || !body.property_type || !body.bhk || !body.area) {
      return res.status(400).json({ error: 'Please provide all required property details.' });
    }

    const priceNum = Number(body.price);
    const formattedETB = `${priceNum.toLocaleString('en-US')} ${body.purpose === 'rent' ? 'ETB/month' : 'ETB'}`;
    const formattedETBAm = `${priceNum.toLocaleString('en-US')} ${body.purpose === 'rent' ? 'ብር/ወር' : 'ብር'}`;

    // Handle multiple images gallery array
    let galleryImages = [];
    if (Array.isArray(body.images) && body.images.length > 0) {
      galleryImages = body.images.filter(img => typeof img === 'string' && img.trim().length > 0);
    } else if (body.image_url) {
      galleryImages = [body.image_url];
    } else {
      galleryImages = ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'];
    }

    const propertyData = {
      ...body,
      price: priceNum,
      price_formatted: body.price_formatted || formattedETB,
      price_formatted_am: body.price_formatted_am || formattedETBAm,
      city_am: body.city === 'Addis Ababa' ? 'አዲስ አበባ' : 'አዳማ',
      image_url: galleryImages[0],
      images: galleryImages,
      role: body.role || 'owner',
      status: body.role === 'admin' ? 'approved' : 'pending', // Admins auto-approve; owners, agents, developers enter pending review
      createdAt: new Date()
    };

    if (!isInMemoryFallback) {
      const newProp = new Property(propertyData);
      await newProp.save();
      return res.status(201).json(newProp);
    } else {
      const newId = `prop-${Date.now()}`;
      const memoryProp = { ...propertyData, id: newId, _id: newId };
      inMemoryProperties.unshift(memoryProp);
      return res.status(201).json(memoryProp);
    }
  } catch (err) {
    console.error('Error creating property:', err);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// PATCH /api/properties/:id/status - Approve or Reject Property (Admin Portal)
app.patch('/api/properties/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'pending', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    if (!isInMemoryFallback && mongoose.isValidObjectId(id)) {
      const updated = await Property.findByIdAndUpdate(id, { status }, { new: true });
      if (!updated) return res.status(404).json({ error: 'Property not found' });
      return res.json(updated);
    }

    const idx = inMemoryProperties.findIndex(p => p.id === id || p._id === id);
    if (idx === -1) return res.status(404).json({ error: 'Property not found' });

    inMemoryProperties[idx].status = status;
    return res.json(inMemoryProperties[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Error updating property status' });
  }
});

// DELETE /api/properties/:id
app.delete('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isInMemoryFallback && mongoose.isValidObjectId(id)) {
      await Property.findByIdAndDelete(id);
      return res.json({ message: 'Property deleted successfully' });
    }

    inMemoryProperties = inMemoryProperties.filter(p => p.id !== id && p._id !== id);
    return res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting property' });
  }
});

// POST /api/properties/:id/contact - Submit Inquiry / Rent / Buy Lead
app.post('/api/properties/:id/contact', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, message, inquiryType, propertyTitle, city, price } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and phone number are required.' });
    }

    const submissionData = {
      property_id: id,
      name,
      email: email.toLowerCase().trim(),
      phone,
      message: message || '',
      inquiryType: inquiryType || 'rent_or_buy',
      propertyTitle: propertyTitle || 'Residential Property',
      city: city || 'Addis Ababa',
      price: price || '',
      createdAt: new Date()
    };

    if (!isInMemoryFallback) {
      const sub = new ContactSubmission(submissionData);
      await sub.save();
      return res.json({
        status: 'success',
        message: 'መልእክትዎ ደርሷል! የአካባቢው የሪል እስቴት ባለሙያ በቅርቡ ያነጋግርዎታል። (Enquiry submitted successfully!)',
        id: sub.id,
        inquiry: sub
      });
    } else {
      const memorySub = { ...submissionData, id: `contact-${Date.now()}` };
      inMemoryContacts.unshift(memorySub);
      return res.json({
        status: 'success',
        message: 'መልእክትዎ ደርሷል! የአካባቢው የሪል እስቴት ባለሙያ በቅርቡ ያነጋግርዎታል። (Enquiry submitted successfully!)',
        id: memorySub.id,
        inquiry: memorySub
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit contact enquiry' });
  }
});

// GET /api/contact - List inquiries (supports filtering by customer email)
app.get('/api/contact', async (req, res) => {
  try {
    const { email } = req.query;

    if (!isInMemoryFallback) {
      const filter = email ? { email: email.toLowerCase().trim() } : {};
      const list = await ContactSubmission.find(filter).sort({ createdAt: -1 });
      return res.json(list);
    }

    const filtered = email 
      ? inMemoryContacts.filter(c => c.email && c.email.toLowerCase() === email.toLowerCase().trim())
      : inMemoryContacts;
    return res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve enquiries' });
  }
});

// GET /api/developer-projects - List Developer Mega Projects
app.get('/api/developer-projects', async (req, res) => {
  try {
    if (!isInMemoryFallback) {
      const projects = await DeveloperProject.find().sort({ createdAt: -1 });
      return res.json(projects);
    }
    return res.json(inMemoryProjects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve developer projects' });
  }
});

// POST /api/developer-projects - Add new development (Builders & Developers Portal)
app.post('/api/developer-projects', async (req, res) => {
  try {
    const body = req.body;
    if (!body.developerName || !body.projectName || !body.city || !body.locality || !body.totalUnits || !body.priceRange) {
      return res.status(400).json({ error: 'Missing required project details.' });
    }

    const projectData = {
      ...body,
      city_am: body.city === 'Addis Ababa' ? 'አዲስ አበባ' : 'አዳማ',
      createdAt: new Date()
    };

    if (!isInMemoryFallback) {
      const proj = new DeveloperProject(projectData);
      await proj.save();
      return res.status(201).json(proj);
    } else {
      const memoryProj = { ...projectData, id: `proj-${Date.now()}` };
      inMemoryProjects.unshift(memoryProj);
      return res.status(201).json(memoryProj);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to create developer project' });
  }
});

// GET /api/stats - Platform Statistics for Admin Portal
app.get('/api/stats', async (req, res) => {
  try {
    if (!isInMemoryFallback) {
      const total = await Property.countDocuments();
      const approved = await Property.countDocuments({ status: 'approved' });
      const pending = await Property.countDocuments({ status: 'pending' });
      const rejected = await Property.countDocuments({ status: 'rejected' });
      const addisCount = await Property.countDocuments({ city: 'Addis Ababa' });
      const adamaCount = await Property.countDocuments({ city: 'Adama' });
      const inquiries = await ContactSubmission.countDocuments();
      const developerProjects = await DeveloperProject.countDocuments();

      const totalUsers = await User.countDocuments();
      const pendingUsers = await User.countDocuments({ status: 'pending' });
      const approvedUsers = await User.countDocuments({ status: 'approved' });

      return res.json({
        total,
        totalProperties: total,
        approved,
        pending,
        rejected,
        addisCount,
        adamaCount,
        inquiries,
        developerProjects,
        totalUsers,
        pendingUsers,
        approvedUsers
      });
    }

    const total = inMemoryProperties.length;
    const approved = inMemoryProperties.filter(p => p.status === 'approved').length;
    const pending = inMemoryProperties.filter(p => p.status === 'pending').length;
    const rejected = inMemoryProperties.filter(p => p.status === 'rejected').length;
    const addisCount = inMemoryProperties.filter(p => p.city === 'Addis Ababa').length;
    const adamaCount = inMemoryProperties.filter(p => p.city === 'Adama').length;

    const totalUsers = inMemoryUsers.length;
    const pendingUsers = inMemoryUsers.filter(u => u.status === 'pending').length;
    const approvedUsers = inMemoryUsers.filter(u => u.status === 'approved').length;

    return res.json({
      total,
      totalProperties: total,
      approved,
      pending,
      rejected,
      addisCount,
      adamaCount,
      inquiries: inMemoryContacts.length,
      developerProjects: inMemoryProjects.length,
      totalUsers,
      pendingUsers,
      approvedUsers
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve platform stats' });
  }
});

// Admin aliases for backward & microservice compatibility
app.get('/api/admin/stats', (req, res, next) => {
  req.url = '/api/stats';
  app.handle(req, res, next);
});

app.get('/api/admin/users', (req, res, next) => {
  req.url = '/api/auth/users';
  app.handle(req, res, next);
});

app.listen(PORT, () => {
  console.log(`🚀 Kedami Express Server running on port ${PORT}`);
});
