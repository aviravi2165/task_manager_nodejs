const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOneId, userOne, setupDb } = require('./fixtures/db');

beforeEach(setupDb);

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
      email: userOne.email,
      password: userOne.password,
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
      `Bearer ${userOne.tokens[0].token}`
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
      `Bearer ${userOne.tokens[0].token}`
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

test("Should upoad avatar", async () => {
  await request(app)
    .post('/upload/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'test/fixtures/2.jpg')
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("shoud update user fields", async () => {
  await request(app)
    .patch('/user/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Avi"
    })
    .expect(200);
  const user = await User.findById(userOne._id);
  expect(user.name).toEqual('Avi');
})