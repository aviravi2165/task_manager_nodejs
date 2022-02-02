const express = require("express");
const router = new express.Router();
const User = require("../models/user");

router.post("/user", async (req, res) => {
    const user = new User(req.body);
    try {
      await user.save();
      res.status(201).send(user);
    } catch (e) {
      res.status(400).send("Error : " + e);
    }
  });

router.get("/users", async (req, res) => {
    try {
      const users = await User.find({});
      res.send(users);
    } catch (e) {
      res.status(500).send("Error : " + e);
    }
  });

  router.get("/user/:id", async (req, res) => {
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

  router.patch("/user/:id", async (req, res) => {
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
      const user = await User.findByIdAndUpdate(
        _id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!user) return res.status(404).send();
      res.send(user);
    } catch (e) {
      res.status(400).send("Error :" + e);
    }
  });

  router.delete("/user/:id", async (req, res) => {
    const _id = req.params.id;
    try {
      const user = await User.findByIdAndDelete(_id);
      if(!user) res.status(404).send("User not found!");
      res.status(200).send();
    } catch (e) {
      res.status(400).send("Error : " + e);
    }
  });

  module.exports = router;