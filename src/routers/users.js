const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const { welcomeMail, signOffMail } = require('../emails/account');
//signup User
router.post("/user", async (req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.generateAuthToken();
    welcomeMail(req.body.email, req.body.name);
    res.status(201).send({ user, token });
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

    currentUpdate.forEach(
      (update) => (user[update] = req.body[update])
    );

    await user.save();

    if (!user) return res.status(404).send();
    res.send(user);
  } catch (e) {
    res.status(400).send("Error :" + e);
  }
});

//login user
router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findByCredential(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (e) {
    res.status(404).send("Error : " + e);
  }
});

//logout current session
router.post("/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(500).send("Error : " + e);
  }
});

// logout from all session in all devices
router.post("/user/logoutall", auth, async (req, res) => {
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
    signOffMail(user.email, user.name);
    if (!user) res.status(404).send("User not found!");
    res.status(200).send();
  } catch (e) {
    res.status(400).send("Error : " + e);
  }
});

//upload avatar
const upload = multer({
  limits: {
    fileSize: 5000000,
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(JPG|PNG|JPEG|jpg|png|jpeg)$/)) {
      return callback(new Error("Upload only image file!"));
    }
    callback(undefined, true);
  },
});
router.post(
  "/upload/avatar", auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 50, height: 50 }).png().toBuffer();
    req.user.avatar = buffer;
    req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send(error.message);
    next();
  }
);

router.get('/user/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    console.log(user)
    if (!user || !user.avatar) throw new Error("User or Avatar not found");
    res.set('Content-Type', 'image/jpg');
    res.send(user.avatar)
  } catch (e) {
    res.status(404).send('Error : '.e)
  }
});

router.delete('/user/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});
module.exports = router;
