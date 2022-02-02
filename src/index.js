require('./db/mongoose');
const express = require("express");
const User = require('./models/user');
const Task = require('./models/task');


const app = express();

const port = process.nextTick.PORT || 3000;

app.use(express.json());


app.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).send(user);
    } catch (e) {
        res.status(400).send("Error : " + e);
    }
});

app.post('/task', async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send("Error : " + e);
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(500).send("Error : " + e);
    }
});

app.get('/user/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if (!user) return res.status(404).send("User not found!");
        res.send(user);
    } catch (e) {
        res.status(500).send("Error : " + e);
    }
});

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (e) {
        res.status(500).send("Error : " + e);
    }
});

app.get("/task/:id", async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findById(_id);
        if (!task) return res.status(404).send("Task not found!");
        res.send(task);
    } catch (e) {
        res.status(500).send("Error : " + e);
    }
});

app.patch("/user/:id", async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
        if (!user) return res.status(404).send();
        res.send(user);
    } catch (e) {
        res.status(400).send("Error :" + e);
    }
});

app.patch("/task/:id", async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
        if(!task) return res.status(404).send();
        res.send(task);
    } catch (e) {
        res.status(400).send("Error :" + e);
    }
});

app.delete("user/:id",async (req,res)=>{
    const _id = req.params.id;
    await User.findByIdAndDelete(_id);
    res.status(200).send();

});


app.listen(port, () => {
    console.log("Server is running at port " + port);
});