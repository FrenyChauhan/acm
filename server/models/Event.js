const mongoose = require('mongoose');
const EventSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true },
  category:    { type: String, enum: ['hackathon','competition','workshop','outreach','online','talk'], required: true },
  edition:     { type: String },
  tagline:     { type: String },
  description: { type: String, required: true },
  startDate:   { type: Date, required: true },
  endDate:     { type: Date },
  venue:       { type: String },
  isOnline:    { type: Boolean, default: false },
  isFlagship:  { type: Boolean, default: false },
  isUpcoming:  { type: Boolean, default: false },
  stats: [{
    label: String,
    value: String,
    icon:  String
  }],
  gallery: [{ url: String, cloudinaryId: String, caption: String }],
  tags:       [String],
  achievement: { type: String },
  bannerGradient: { type: String },
  registrationLink: { type: String },
  resultsLink: { type: String },
  year:        { type: Number, required: true },
}, { timestamps: true });

EventSchema.index({ category: 1, year: -1 });
EventSchema.index({ slug: 1 });
module.exports = mongoose.model('Event', EventSchema);