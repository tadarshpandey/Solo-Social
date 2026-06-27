require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/companion_connect';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from the current directory
app.use(express.static(__dirname));

// MongoDB connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB local server database');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB database:', err.message);
  });

// Schema definition
const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Full Name is required']
  },
  phone: {
    type: String,
    required: [true, 'Contact Number is required']
  },
  email: {
    type: String,
    default: ''
  },
  partner: {
    type: String,
    default: ''
  },
  age: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    default: ''
  },
  day: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Model creation
const Booking = mongoose.model('Booking', bookingSchema);

// API Endpoints
app.post('/api/register', async (req, res) => {
  try {
    const { name, phone, email, partner, age, duration, date, day, notes } = req.body;

    // Server-side validation
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and Phone Number are required fields.'
      });
    }

    const newBooking = new Booking({
      name,
      phone,
      email,
      partner,
      age,
      duration,
      date,
      day,
      notes
    });

    const savedBooking = await newBooking.save();
    console.log('New Booking stored successfully:', savedBooking);

    return res.status(201).json({
      success: true,
      message: 'Registration stored successfully in database!',
      data: savedBooking
    });

  } catch (error) {
    console.error('Error storing booking:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error: Unable to save registration. Please try again.',
      error: error.message
    });
  }
});

// Serve frontend on root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
});
