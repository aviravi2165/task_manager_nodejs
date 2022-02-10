const request = require('supertest');
const app = require("../src/app");
const Task = require('../src/models/task');
const User = require('../src/models/user');

const { userOneId, userOne, userTwoId, userTwo, taskOne, taskTwo, taskThree, setupDb } = require('./fixtures/db');

beforeEach(setupDb);

test("Should create a task", async () => {
    const response = await request(app)
        .post('/task')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: "Test Task",
            completed: true
        })
        .expect(201);
    const task = await Task.findById(response.body._id);
    expect(task.completed).not.toBeNull();
    expect(task.description).toEqual('Test Task');
    expect(task.completed).toEqual(true);
});

test("should Fetch selected user's task", async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    expect(response.body.length).toBe(2);
});

test("should not delete tasks of selected user", async () => {
    const response = await request(app)
        .delete(`/task/${taskThree._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(404);
});

test("should delete tasks of selected user", async () => {
await request(app)
        .delete(`/task/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    const task = await Task.findById(taskOne._id);
    expect(task).toBeNull();
});