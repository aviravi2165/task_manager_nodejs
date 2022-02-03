const bcrypt = require("bcryptjs/dist/bcrypt");
const mongoose = require("mongoose");
const validator = require("validator");

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
  }
);

userSchema.pre('save',async function(next){
  const user = this;
  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password,8);
  }
  next();
});


const User = mongoose.model("User", userSchema);

module.exports = User;
