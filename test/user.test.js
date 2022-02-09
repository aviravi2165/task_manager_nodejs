const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');

const userTest = {
    name: "Ravi Kumar Asari",
    contact: "9988776655",
    email: "ravi@gmail.com",
    password: "123"
};

beforeEach(async () => {
    await User.deleteMany();
    await new User(userTest).save();
})

test("New User Signup", async () => {
    await request(app).post('/user').send({
        name: "Jainesh",
        contact: "1234567890",
        email: "jainesh@gmail.com",
        password: "123"
    }).expect(201)
});

test("Existing user Login test", async () => {
    await request(app).post('/user/login').send({
        email: userTest.email,
        password: userTest.password
    }).expect(200);
});

test("Non existing user login", async () => {
    await request(app).post('/user/login').send({
        email: "abc@asd.com",
        password: "123"
    }).expect(404);
});