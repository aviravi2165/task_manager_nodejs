const express = require("express");
const router = new express.Router();
const Task = require("../models/task");
const auth = require("../middleware/auth");

router.post("/task", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send("Error : " + e);
  }
});

//GET /task?completed=true/false
//GET /task?limit=10&skip=0
//GET /task?sort=createdAT_DESC
router.get("/tasks", auth, async (req, res) => {
  try {
    let match = {};
    let limit = {};
    let skip = {};
    let sort = {};
    if (req.query.completed) {
      match.completed = req.query.completed === "true";
    }
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }
    if (req.query.skip) {
      skip = parseInt(req.query.skip) - 1;
    }
    if (req.query.sort) {
      const sortingOn = req.query.sort.split('_');
      sort[sortingOn[0]] = sortingOn[1] === "desc" ? -1 : 1;
    }
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit,
        skip,
        sort
      }
    });
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send("Error : " + e);
  }
});

router.get("/task/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({
      _id,
      owner: req.user._id,
    });
    if (!task)
      return res.status(404).send("Task not found!");
    res.send(task);
  } catch (e) {
    res.status(500).send("Error : " + e);
  }
});

router.patch("/task/:id", auth, async (req, res) => {
  const allowedUpdates = ["description", "completed"];
  const currentUpdate = Object.keys(req.body);
  const isValidUpdate = currentUpdate.every((cu) => {
    return allowedUpdates.includes(cu);
  });
  if (!isValidUpdate)
    return res.status(400).send("Invalid Updates");

  const _id = req.params.id;
  try {
    const task = await Task.findOne({
      _id,
      owner: req.user._id,
    });
    if (!task)
      return res.status(404).send("No task Found!");
    allowedUpdates.forEach(
      (update) => (task[update] = req.body[update])
    );

    await task.save();

    res.send(task);
  } catch (e) {
    res.status(400).send("Error :" + e);
  }
});

router.delete("/task/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOneAndDelete({
      _id,
      owner: req.user._id,
    });
    if (!task) res.status(404).send("Task not found");
    res.status(200).send();
  } catch (e) {
    res.status(400).send("Error : " + e);
  }
});

module.exports = router;
