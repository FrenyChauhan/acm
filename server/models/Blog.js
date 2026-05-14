const mongoose = require('mongoose');
const BlogSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  excerpt:     { type: String, required: true },
  content:     { type: String, required: true },
  author: {
    name:      String,
    avatar:    String,
    role:      String,
  },
  coverImage:  { url: String, cloudinaryId: String },
  category:    { type: String, enum: ['ai','webdev','cp','opensource','career','general'] },
  tags:        [String],
  readTime:    { type: Number },
  published:   { type: Boolean, default: false },
  publishedAt: { type: Date },
  views:       { type: Number, default: 0 },
}, { timestamps: true });
module.exports = mongoose.model('Blog', BlogSchema);