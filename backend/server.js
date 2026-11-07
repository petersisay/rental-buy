import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Property } from './models/Property.js';
import { ContactSubmission } from './models/ContactSubmission.js';
import { DeveloperProject } from './models/DeveloperProject.js';
import { seedProperties, seedProjects } from './seedData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// In-Memory Fallback store if MongoDB daemon is unreachable locally
let isInMemoryFallback = false;
let inMemoryProperties = [...seedProperties.map((p, idx) => ({ ...p, id: `prop-${idx + 1}`, _id: `prop-${idx + 1}`, createdAt: new Date() }))];
let inMemoryContacts = [];
let inMemoryProjects = [...seedProjects.map((p, idx) => ({ ...p, id: `proj-${idx + 1}`, _id: `proj-${idx + 1}`, createdAt: new Date() }))];

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
  } catch (err) {
    console.warn(`⚠️ Local MongoDB connection failed (${err.message}).`);
    console.log('ℹ️ Running in resilient In-Memory MERN mode with 20 seeded Ethiopian properties.');
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

// POST /api/properties - Add new property (Used by Owners, Agents, Developers, Admin)
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

    const propertyData = {
      ...body,
      price: priceNum,
      price_formatted: body.price_formatted || formattedETB,
      price_formatted_am: body.price_formatted_am || formattedETBAm,
      city_am: body.city === 'Addis Ababa' ? 'አዲስ አበባ' : 'አዳማ',
      role: body.role || 'owner',
      status: body.role === 'admin' ? 'approved' : 'pending', // Admins auto-approve, others enter pending review
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

// PATCH /api/properties/:id/status - Approve or Reject (Admin Portal)
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

// POST /api/properties/:id/contact - Submit Inquiry
app.post('/api/properties/:id/contact', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and phone number are required.' });
    }

    const submissionData = {
      property_id: id,
      name,
      email,
      phone,
      message,
      createdAt: new Date()
    };

    if (!isInMemoryFallback) {
      const sub = new ContactSubmission(submissionData);
      await sub.save();
      return res.json({
        status: 'success',
        message: 'መልእክትዎ ደርሷል! የአካባቢው የሪል እስቴት ባለሙያ በቅርቡ ያነጋግርዎታል። (Enquiry submitted successfully!)',
        id: sub.id
      });
    } else {
      const memorySub = { ...submissionData, id: `contact-${Date.now()}` };
      inMemoryContacts.push(memorySub);
      return res.json({
        status: 'success',
        message: 'መልእክትዎ ደርሷል! የአካባቢው የሪል እስቴት ባለሙያ በቅርቡ ያነጋግርዎታል። (Enquiry submitted successfully!)',
        id: memorySub.id
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit contact enquiry' });
  }
});

// GET /api/contact - List inquiries (for Agents/Admins)
app.get('/api/contact', async (req, res) => {
  try {
    if (!isInMemoryFallback) {
      const list = await ContactSubmission.find().sort({ createdAt: -1 });
      return res.json(list);
    }
    return res.json(inMemoryContacts);
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

      return res.json({
        total,
        approved,
        pending,
        rejected,
        addisCount,
        adamaCount,
        inquiries,
        developerProjects
      });
    }

    const total = inMemoryProperties.length;
    const approved = inMemoryProperties.filter(p => p.status === 'approved').length;
    const pending = inMemoryProperties.filter(p => p.status === 'pending').length;
    const rejected = inMemoryProperties.filter(p => p.status === 'rejected').length;
    const addisCount = inMemoryProperties.filter(p => p.city === 'Addis Ababa').length;
    const adamaCount = inMemoryProperties.filter(p => p.city === 'Adama').length;

    return res.json({
      total,
      approved,
      pending,
      rejected,
      addisCount,
      adamaCount,
      inquiries: inMemoryContacts.length,
      developerProjects: inMemoryProjects.length
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve platform stats' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Kedami Express Server running on port ${PORT}`);
});
