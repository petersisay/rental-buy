const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  googleId: {
    type: String,
    default: null
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['owner', 'agent', 'developer', 'admin', 'seeker'],
    default: 'seeker'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending' // Admin must approve newly registered users
  },
  phone: {
    type: String,
    default: ''
  },
  company: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: 'Addis Ababa'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
