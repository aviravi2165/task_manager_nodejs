const { Router } = require("express");
const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

//signup User
router.post("/user", async (req, res) => {

  const user = new User(req.body);
  try {
    const token = await user.generateAuthToken();

    res.status(201).send({user,token});
  } catch (e) {
    res.status(400).send("Error : " + e);
  }
});

// modify user
router.patch("/user/me", auth, async (req, res) => {
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
    const user = await User.findById(req.user._id);

    currentUpdate.forEach(update => user[update] = req.body[update]);

    await user.save();

    if (!user) return res.status(404).send();
    res.send(user);
  } catch (e) {
    res.status(400).send("Error :" + e);
  }
});

//login user
router.post('/user/login', async (req, res) => {
  try {
    const user = await User.findByCredential(req.body.email, req.body.password);
    const token = await user.generateAuthToken();

    res.send({user,token});
  } catch (e) {
    res.status(404).send("Error : " + e);
  }
});

//logout current session
router.post('/user/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(500).send("Error : " + e);
  }
});

// logout from all session in all devices
router.post('/user/logoutall', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send("Error : " + e);
  }
});

//fetch user detail
router.get("/user/me", auth, async (req, res) => {
  res.send(req.user);
});

//delete logged in user
router.delete("/user/me", auth, async (req, res) => {
  const _id = req.user._id;
  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) res.status(404).send("User not found!");
    res.status(200).send();
  } catch (e) {
    res.status(400).send("Error : " + e);
  }
});

module.exports = router;