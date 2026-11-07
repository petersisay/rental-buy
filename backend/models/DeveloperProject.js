import mongoose from 'mongoose';

const developerProjectSchema = new mongoose.Schema(
  {
    developerName: {
      type: String,
      required: true,
      trim: true
    },
    developerName_am: {
      type: String,
      trim: true
    },
    projectName: {
      type: String,
      required: true,
      trim: true
    },
    projectName_am: {
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
    totalUnits: {
      type: Number,
      required: true,
      min: 1
    },
    availableUnits: {
      type: Number,
      default: 0
    },
    priceRange: {
      type: String,
      required: true
    },
    priceRange_am: {
      type: String,
      default: ''
    },
    handoverYear: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    description_am: {
      type: String,
      default: ''
    },
    image_url: {
      type: String,
      default: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
    },
    features: {
      type: [String],
      default: []
    },
    contactPhone: {
      type: String,
      default: '+251 911 000000'
    },
    contactEmail: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

developerProjectSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  }
});

export const DeveloperProject =
  mongoose.models.DeveloperProject ||
  mongoose.model('DeveloperProject', developerProjectSchema);
