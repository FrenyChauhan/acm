const mongoose = require('mongoose');
const TeamMemberSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  role:       { type: String, required: true },
  department: { type: String },
  year:       { type: String },
  category:   { type: String, enum: ['leadership', 'developer', 'designer', 'problem-setter', 'core', 'faculty'] },
  photo:      { url: String, cloudinaryId: String },
  linkedin:   { type: String },
  github:     { type: String },
  twitter:    { type: String },
  email:      { type: String },
  isFaculty:  { type: Boolean, default: false },
  isAlumni:   { type: Boolean, default: false },
  quote:      { type: String },
  order:      { type: Number, default: 99 },
}, { timestamps: true });
module.exports = mongoose.model('TeamMember', TeamMemberSchema);