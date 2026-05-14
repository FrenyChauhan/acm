const mongoose = require('mongoose');
const ContactSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  subject: { type: String, enum: ['general','sponsorship','collaboration','recruitment','other'] },
  message: { type: String, required: true },
  read:    { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('Contact', ContactSchema);