const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});


router.post('/', auth, async (req, res) => {
  try {
    const { title, description, dueDate, priority, category, image } = req.body;
    if (!title || !dueDate) {
      return res.status(400).json({ error: 'Title and due date are required' });
    }

    const task = new Task({
      userId: req.user.userId,
      title,
      description: description || '',
      dueDate,
      priority: priority || 'Medium',
      category: category || 'General',
      image: image || null,
      completed: false
    });

    const created = await task.save();
    res.status(201).json(created);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});


router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      updates,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});


router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    
    const task = await Task.findOne({ _id: id, userId: req.user.userId });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await Task.findOneAndDelete({ _id: id, userId: req.user.userId });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
