// server.js (replace your current file with this)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoute');
const categoryRoutes = require('./routes/categoryRoute');
const subcategoryRoutes = require('./routes/subCategoryRoute');
const reportRoutes = require('./routes/reportRoute');
const transactionRoutes = require('./routes/transactionRoutes');
const userRoutes = require('./routes/userRoutes');
const budgetRoutes = require('./routes/budgetRoutes');

// ------------ CORS setup ------------
/*
  Expected: set CLIENT_URL in Render env to your Vercel frontend URL, e.g.
  CLIENT_URL=https://your-frontend.vercel.app
*/
const clientUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL || ''; // fallback support
const allowedOrigins = new Set([
  'http://localhost:3000',    // CRA default
  'http://localhost:5173',    // Vite default
  'http://127.0.0.1:5173',
  clientUrl
]);

app.use(cors({
  origin: (origin, callback) => {
    // allow non-browser requests like curl/postman (no origin)
    if (!origin) return callback(null, true);

    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    // Log rejected origin for debugging (Render logs)
    console.warn(`CORS blocked origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// ------------ Body parsing ------------
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// ------------ Public / health routes ------------
app.get('/', (req, res) => {
  res.send('Expense Tracker API is running. Visit /health for JSON status.');
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    env: process.env.NODE_ENV || 'development',
    time: new Date().toISOString()
  });
});

// ================== Public/User Routes ==================
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/subcategory', subcategoryRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budget', budgetRoutes);

// ================== User Routes CRUD ==================
app.use('/api/user', userRoutes);

// ================== Admin Routes ==================
app.use('/admin', adminRoutes);
app.use('/admin/category', categoryRoutes);
app.use('/admin/subcategory', subcategoryRoutes);

// ------------ Error handler (CORS and others) ------------
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.message ? err.message : err);
  if (err && err.message && err.message.toLowerCase().includes('cors')) {
    return res.status(403).json({ error: 'CORS error: origin not allowed' });
  }
  res.status(500).json({ error: err && err.message ? err.message : 'Internal Server Error' });
});

// ------------ Start server ------------
const PORT = parseInt(process.env.PORT, 10) || 5002;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  if (clientUrl) console.log(`✅ CLIENT_URL set to ${clientUrl}`);
  console.log(`✅ Your service is live at: ${process.env.SERVICE_URL || 'no SERVICE_URL provided'}`);
});

// Optional graceful shutdown
process.on('SIGTERM', () => {
  console.info('SIGTERM received — shutting down gracefully');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});
