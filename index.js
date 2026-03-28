require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const fileUpload = require('express-fileupload');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not defined in .env file');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase JSON payload limit
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Increase URL-encoded payload limit
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// MongoDB connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Routes
app.use('/auth', authRoutes);
const taskRoutes = require('./routes/tasks');
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('Server is running on port 3000');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
