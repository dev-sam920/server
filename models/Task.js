const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  dueDate: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  category: { type: String, default: 'General' },
  image: { type: String, default: null },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
