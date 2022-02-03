const express = require('express');
const router = new express.Router();
const Task = require("../models/task");


router.post("/task", async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send("Error : " + e);
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (e) {
    res.status(500).send("Error : " + e);
  }
});

router.get("/task/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findById(_id);
    if (!task)
      return res.status(404).send("Task not found!");
    res.send(task);
  } catch (e) {
    res.status(500).send("Error : " + e);
  }
});



router.patch("/task/:id", async (req, res) => {
  const allowedUpdates = ["description", "completed"];
  const currentUpdate = Object.keys(req.body);
  const isValidUpdate = currentUpdate.every((cu) => {
    return allowedUpdates.includes(cu);
  });
  if (!isValidUpdate)
    return res.status(400).send("Invalid Updates");

  const _id = req.params.id;
  try {
    const task = await Task.findById(_id);
    allowedUpdates.forEach(update => task[update] = req.body[update]);

    await task.save();

    if (!task) return res.status(404).send();
    res.send(task);
  } catch (e) {
    res.status(400).send("Error :" + e);
  }
});



router.delete("/task/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findByIdAndDelete(_id);
    if (!task) res.status(404).send("Task not found");
    res.status(200).send();
  } catch (e) {
    res.status(400).send("Error : " + e);
  }
});


module.exports = router;