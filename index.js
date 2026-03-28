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


app.use(cors());
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true })); 
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, 
  useTempFiles: false
}));


mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });


app.use('/auth', authRoutes);
const taskRoutes = require('./routes/tasks');
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('Server is running on port 3000');
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
