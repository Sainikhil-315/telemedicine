const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./db/connection');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS configuration - should be early in the middleware chain
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Enable pre-flight for all routes
app.options('*', cors());

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security middleware
app.use(helmet()); // Set security headers
app.use(mongoSanitize()); // Sanitize data
app.use(hpp()); // Prevent HTTP param pollution

// Rate limiting - adjust for development
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // Higher limit in development
  message: 'Too many requests from this IP, please try again later'
});

// Apply rate limiting selectively - skip for auth routes in development
if (process.env.NODE_ENV === 'development') {
  app.use('/api', (req, res, next) => {
    if (req.path.startsWith('/auth/')) {
      return next(); // Skip rate limiting for auth routes
    }
    limiter(req, res, next);
  });
} else {
  app.use(limiter); // Apply to all routes in production
}

// Mount routes
app.use('/', routes);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});