import mongoose from 'mongoose';

const contactSubmissionSchema = new mongoose.Schema(
  {
    property_id: {
      type: String,
      required: true
    },
    property_title: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      default: ''
    },
    inquiryType: {
      type: String,
      default: 'rent'
    },
    city: {
      type: String,
      default: 'Addis Ababa'
    },
    price: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new'
    }
  },
  {
    timestamps: true
  }
);

contactSubmissionSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  }
});

// Performance indexes for Customer Inquiry Inbox and Agent Leads
contactSubmissionSchema.index({ email: 1, createdAt: -1 });
contactSubmissionSchema.index({ property_id: 1 });

export const ContactSubmission =
  mongoose.models.ContactSubmission ||
  mongoose.model('ContactSubmission', contactSubmissionSchema);
