import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
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
      enum: ['owner', 'agent', 'developer', 'admin', 'seeker', 'customer'],
      default: 'customer'
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
    }
  },
  {
    timestamps: true
  }
);

userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  }
});

// Production Database Performance Indexes for User Authentication & Admin Queue
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ createdAt: -1 });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
