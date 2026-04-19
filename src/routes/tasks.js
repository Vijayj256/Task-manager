const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Internal error" });
  }
});

router.post("/", auth, async (req, res) => {
  const { text, category, dueDate, priority, done } = req.body;

  try {
    const task = new Task({
      userId: req.userId,
      text,
      category,
      dueDate: dueDate || null,
      priority: priority || "medium",
      done: done || false,
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Internal error" });
  }
});

router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const task = await Task.findOne({ _id: id, userId: req.userId });
    if (!task) return res.status(404).json({ error: "Task not found" });

    Object.assign(task, updates);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Internal error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOne({ _id: id, userId: req.userId });
    if (!task) return res.status(404).json({ error: "Task not found" });

    await task.remove();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: "Internal error" });
  }
});

module.exports = router;