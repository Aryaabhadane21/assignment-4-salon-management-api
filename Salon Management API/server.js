const express = require('express');
require('dotenv').config();

const salonRoutes = require('./routes/salonRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const authRoutes = require('./routes/authRoutes');
const loggerMiddleware = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser
app.use(express.json());

// Logging middleware
app.use(loggerMiddleware);

// Welcome route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Salon APIs' });
});

// Routes
app.use('/', authRoutes);
app.use('/salons', salonRoutes);
app.use('/services', serviceRoutes);

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
