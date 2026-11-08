import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    title_am: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    description_am: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      required: true,
      enum: ['Addis Ababa', 'Adama']
    },
    city_am: {
      type: String,
      default: function () {
        return this.city === 'Addis Ababa' ? 'አዲስ አበባ' : 'አዳማ';
      }
    },
    locality: {
      type: String,
      required: true,
      trim: true
    },
    locality_am: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    price_formatted: {
      type: String,
      default: function () {
        const val = this.price ? Number(this.price).toLocaleString('en-US') : '0';
        return this.purpose === 'rent' ? `${val} ETB/month` : `${val} ETB`;
      }
    },
    price_formatted_am: {
      type: String,
      default: function () {
        const val = this.price ? Number(this.price).toLocaleString('en-US') : '0';
        return this.purpose === 'rent' ? `${val} ብር/ወር` : `${val} ብር`;
      }
    },
    purpose: {
      type: String,
      required: true,
      enum: ['buy', 'rent']
    },
    property_type: {
      type: String,
      required: true,
      enum: ['flat', 'house', 'hause']
    },
    bhk: {
      type: Number,
      required: true,
      min: 1
    },
    bathrooms: {
      type: Number,
      default: 1,
      min: 1
    },
    area: {
      type: Number,
      required: true,
      min: 1
    },
    furnishing: {
      type: String,
      default: 'Unfurnished'
    },
    furnishing_am: {
      type: String,
      default: 'ያልተሟላ እቃ'
    },
    image_url: {
      type: String,
      default: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
    },
    images: {
      type: [String],
      default: []
    },
    amenities: {
      type: String,
      default: ''
    },
    amenities_am: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['owner', 'agent', 'developer', 'admin'],
      default: 'owner'
    },
    postedBy: {
      name: { type: String, default: 'Property Lister' },
      phone: { type: String, default: '+251 911 000000' },
      email: { type: String, default: '' },
      agencyName: { type: String, default: '' },
      developerName: { type: String, default: '' }
    },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'approved'
    }
  },
  {
    timestamps: true
  }
);

// Virtual id field for compatibility with frontend (maps _id to id)
propertySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  }
});

// Production Database Performance Indexes for MongoDB Atlas
propertySchema.index({ city: 1, purpose: 1, status: 1 });
propertySchema.index({ locality: 1, city: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ createdAt: -1 });

export const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);
