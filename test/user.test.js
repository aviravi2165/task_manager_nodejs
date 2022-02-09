const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/user");

const userTestId = new mongoose.Types.ObjectId();
const userTest = {
  _id: userTestId,
  name: "Ravi Kumar Asari",
  contact: "9988776655",
  email: "ravi@gmail.com",
  password: "123",
  tokens: [
    {
      token: jwt.sign(
        { _id: userTestId },
        process.env.JWT_SECRET
      ),
    },
  ],
};
beforeEach(async () => {
  await User.deleteMany();
  await new User(userTest).save();
});

test("New User Signup", async () => {
  await request(app)
    .post("/user")
    .send({
      name: "Jainesh",
      contact: "1234567890",
      email: "jainesh@gmail.com",
      password: "123",
    })
    .expect(201);
});

test("Existing user Login test", async () => {
  await request(app)
    .post("/user/login")
    .send({
      email: userTest.email,
      password: userTest.password,
    })
    .expect(200);
});

test("Non existing user login", async () => {
  await request(app)
    .post("/user/login")
    .send({
      email: "abc@asd.com",
      password: "123",
    })
    .expect(404);
});

test("Profile view of User", async () => {
  await request(app)
    .get("/user/me")
    .set(
      "Authorization",
      `Bearer ${userTest.tokens[0].token}`
    )
    .send()
    .expect(200);
});

test("Profile view of un authorized User", async () => {
  await request(app)
    .get("/user/me")
    .set("Authorization", `unauthorized key`)
    .send()
    .expect(401);
});

test("Should delete account of authenticated user", async () => {
  await request(app)
    .delete("/user/me")
    .set(
      "Authorization",
      `Bearer ${userTest.tokens[0].token}`
    )
    .send()
    .expect(200);
});

test("Should delete account of un authenticated user", async () => {
  await request(app)
    .delete("/user/me")
    .set("Authorization", `Bearer unauthenticated token`)
    .send()
    .expect(401);
});

