const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const { initRoiCron } = require('./cron/roiCron');

// Route handlers
const authRoutes = require('./routes/authRoutes');
const investmentRoutes = require('./routes/investmentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const referralRoutes = require('./routes/referralRoutes');
const roiRoutes = require('./routes/roiRoutes');
const cronRoutes = require('./routes/cronRoutes');
const docsRoutes = require('./routes/docsRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  })
);

// Global Rate Limiter: max 200 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', limiter);

// Request Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check API
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'Nexachain AI Investment & Referral Backend'
  });
});

// Root welcome & API redirect
app.get('/', (req, res) => {
  res.redirect('/api/docs');
});

// Mount API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/investments', investmentRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/referrals', referralRoutes);
app.use('/api/v1/roi', roiRoutes);
app.use('/api/v1/cron', cronRoutes);
app.use('/api/docs', docsRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found - ${req.originalUrl}`
  });
});

// Central Error Handler Middleware
app.use(errorHandler);

// Initialize Background Automated Schedulers
initRoiCron();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Server] Nexachain API server listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
});

// Process event handlers for graceful termination
process.on('unhandledRejection', (err) => {
  console.error('[Process Error] Unhandled Rejection:', err);
});

process.on('SIGTERM', () => {
  console.log('[Process] SIGTERM received. Closing HTTP server gracefully.');
  server.close(() => {
    console.log('[Process] HTTP server closed.');
  });
});

module.exports = app;
