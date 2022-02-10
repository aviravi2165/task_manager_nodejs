const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: "Ravi Kumar Asari",
    contact: "9988776655",
    email: "ravi@gmail.com",
    password: "123",
    tokens: [
        {
            token: jwt.sign(
                { _id: userOneId },
                process.env.JWT_SECRET
            ),
        },
    ],
};
const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: "Mohammed Aarif",
    contact: "9876543210",
    email: "aarif@gmail.com",
    password: "123",
    tokens: [
        {
            token: jwt.sign(
                { _id: userTwoId },
                process.env.JWT_SECRET
            ),
        },
    ],
};

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "Task One",
    completed: true,
    owner: userOne._id
};

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "Task Two",
    completed: false,
    owner: userOne._id
};

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "Task Three",
    completed: true,
    owner: userTwo._id
};


const setupDb = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDb,
}