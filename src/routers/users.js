const { Router } = require("express");
const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");


router.post("/user", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.generateAuthToken();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send("Error : " + e);
  }
});

router.patch("/user/:id", auth, async (req, res) => {
  const allowedUpdates = [
    "name",
    "contact",
    "email",
    "password",
  ];

  const currentUpdate = Object.keys(req.body);
  const isValidUpdate = currentUpdate.every((cu) => {
    return allowedUpdates.includes(cu);
  });

  if (!isValidUpdate)
    return res.status(400).send("Invalid Updates");
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);

    currentUpdate.forEach(update => user[update] = req.body[update]);

    await user.save();

    if (!user) return res.status(404).send();
    res.send(user);
  } catch (e) {
    res.status(400).send("Error :" + e);
  }
});

router.post('/user/login', async (req, res) => {
  try {
    const user = await User.findByCredential(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send(user);
  } catch (e) {
    res.status(404).send("Error : " + e);
  }
});

router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send("Error : " + e);
  }
});

router.get("/user/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user)
      return res.status(404).send("User not found!");
    res.send(user);
  } catch (e) {
    res.status(500).send("Error : " + e);
  }
});


router.delete("/user/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) res.status(404).send("User not found!");
    res.status(200).send();
  } catch (e) {
    res.status(400).send("Error : " + e);
  }
});

module.exports = router;