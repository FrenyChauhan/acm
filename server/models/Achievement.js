const mongoose = require('mongoose');
const AchievementSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  date:        { type: Date, required: true },
  description: { type: String },
  imageUrl:    { type: String },
}, { timestamps: true });
module.exports = mongoose.model('Achievement', AchievementSchema);