require("./db/mongoose");
const express = require("express");
const userRouters = require("./routers/users");
const taskRouters = require("./routers/tasks");

const app = express();


app.use(express.json());
app.use(userRouters);
app.use(taskRouters);

module.exports = app;
