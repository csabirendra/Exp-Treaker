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
const userRoutes = require('./routes/userRoutes');   // ✅ Added
const budgetRoutes = require('./routes/budgetRoutes');


// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL
];

// CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE']
}));

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ================== Public/User Routes ==================
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);       // ✅ User can fetch category
app.use('/api/subcategory', subcategoryRoutes); // ✅ User can fetch subcategory
app.use('/api/report', reportRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budget', budgetRoutes);

// ================== User Routes CRUD ==================
app.use('/api/user', userRoutes);


// ================== Admin Routes ==================
app.use('/admin', adminRoutes);
app.use('/admin/category', categoryRoutes);     
app.use('/admin/subcategory', subcategoryRoutes);

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
