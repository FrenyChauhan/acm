const express = require('express');
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

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim().replace(/\/$/, '')); // strip trailing slashes

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
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
app.listen(process.env.PORT || 5000, () => console.log('ACM Server running on port', process.env.PORT || 5000));