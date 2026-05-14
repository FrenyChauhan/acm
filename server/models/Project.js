const mongoose = require('mongoose');
const ProjectSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  description: { type: String, required: true },
  longDesc:    { type: String },
  techStack:   [String],
  category:    { type: String, enum: ['web','ai','tools','opensource'] },
  githubUrl:   { type: String },
  liveUrl:     { type: String },
  thumbnail:   { url: String, cloudinaryId: String },
  contributors:[{ name: String, avatar: String, github: String }],
  stars:       { type: Number, default: 0 },
  featured:    { type: Boolean, default: false },
  year:        { type: Number },
}, { timestamps: true });
module.exports = mongoose.model('Project', ProjectSchema);