const bcrypt = require("bcryptjs/dist/bcrypt");
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: Number,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value))
          throw new Error(
            "Invalid Email Address!"
          );
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    tokens: [{
      token: {
        type: String,
        reuired: true
      }
    }]
  }
);

userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id.toString() }, "imearningjs");
  user.tokens = user.tokens.concat({ token });
  user.save();
}

userSchema.statics.findByCredential = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email ID not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Password Missmatch");

  return user;
}

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});


const User = mongoose.model("User", userSchema);

module.exports = User;
