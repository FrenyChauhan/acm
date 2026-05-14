const fs = require('fs');
const path = require('path');

const files = {
  '.env': `PORT=5000\nMONGO_URI=\nCLIENT_URL=http://localhost:5173\nCLOUDINARY_CLOUD_NAME=\nCLOUDINARY_API_KEY=\nCLOUDINARY_API_SECRET=\n`,
  '.env.example': `PORT=5000\nMONGO_URI=\nCLIENT_URL=http://localhost:5173\nCLOUDINARY_CLOUD_NAME=\nCLOUDINARY_API_KEY=\nCLOUDINARY_API_SECRET=\n`,
  'config/cloudinary.js': `const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
module.exports = cloudinary;`,
  'utils/apiResponse.js': `module.exports = {
  success: (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({ success: true, message, data });
  },
  error: (res, message = 'Server Error', statusCode = 500) => {
    return res.status(statusCode).json({ success: false, message, data: null });
  }
};`,
  'middleware/errorHandler.js': `module.exports = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
};`,
  'middleware/validateRequest.js': `module.exports = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};`,
  'middleware/uploadMiddleware.js': `const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
module.exports = upload;`,
  'models/Event.js': `const mongoose = require('mongoose');
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
module.exports = mongoose.model('Event', EventSchema);`,
  'models/Blog.js': `const mongoose = require('mongoose');
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
module.exports = mongoose.model('Blog', BlogSchema);`,
  'models/Project.js': `const mongoose = require('mongoose');
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
module.exports = mongoose.model('Project', ProjectSchema);`,
  'models/TeamMember.js': `const mongoose = require('mongoose');
const TeamMemberSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  role:       { type: String, required: true },
  department: { type: String },
  year:       { type: String },
  photo:      { url: String, cloudinaryId: String },
  linkedin:   { type: String },
  github:     { type: String },
  email:      { type: String },
  isFaculty:  { type: Boolean, default: false },
  isAlumni:   { type: Boolean, default: false },
  quote:      { type: String },
  order:      { type: Number, default: 99 },
}, { timestamps: true });
module.exports = mongoose.model('TeamMember', TeamMemberSchema);`,
  'models/Achievement.js': `const mongoose = require('mongoose');
const AchievementSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  date:        { type: Date, required: true },
  description: { type: String },
  imageUrl:    { type: String },
}, { timestamps: true });
module.exports = mongoose.model('Achievement', AchievementSchema);`,
  'models/Contact.js': `const mongoose = require('mongoose');
const ContactSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  subject: { type: String, enum: ['general','sponsorship','collaboration','recruitment','other'] },
  message: { type: String, required: true },
  read:    { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('Contact', ContactSchema);`,
  'index.js': `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
// Try to connect to DB only if URI is present, to prevent immediate crash if not set.
if (process.env.MONGO_URI) {
  connectDB();
} else {
  console.log('MongoDB URI missing in .env, skipping DB connection for now.');
}

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use('/api/events',       require('./routes/eventRoutes'));
app.use('/api/blogs',        require('./routes/blogRoutes'));
app.use('/api/projects',     require('./routes/projectRoutes'));
app.use('/api/team',         require('./routes/teamRoutes'));
app.use('/api/achievements', require('./routes/achievementRoutes'));
app.use('/api/contact',      require('./routes/contactRoutes'));

app.use(require('./middleware/errorHandler'));
app.listen(process.env.PORT || 5000, () => console.log('ACM Server running on port', process.env.PORT || 5000));`
};

Object.entries(files).forEach(([filepath, content]) => {
  const fullpath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullpath), { recursive: true });
  fs.writeFileSync(fullpath, content);
});
console.log('Files created');
