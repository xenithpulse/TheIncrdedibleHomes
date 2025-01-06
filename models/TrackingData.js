import mongoose from 'mongoose';

const trackingDataSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true
  },
  referrer: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  device: {
    deviceType: {
      type: String,
      required: true
    },
    browser: {
      type: String,
      required: true
    },
    os: {
      type: String,
      required: true
    }
  },
  sessionId: {
    type: String,
    required: true
  },
  referralSource: {
    type: String,
    required: true
  },
  utmParams: {
    utmSource: {
      type: String,
      required: true
    },
    utmMedium: {
      type: String,
      required: true
    },
    utmCampaign: {
      type: String,
      required: true
    }
  },
  pageLoadTime: {
    type: Number,
    required: true
  },
  timeSpentOnPage: {
    type: Number,
    required: true
  },
  viewedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'  // Assuming you have a Product model in the database
  }],
  cartActions: [{
    type: String,  // Example: 'added', 'removed'
    required: true
  }]
}, { timestamps: true });

export default mongoose.models.TrackingData || mongoose.model('TrackingData', trackingDataSchema);