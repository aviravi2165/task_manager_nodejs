require("./db/mongoose");
const express = require("express");
const userRouters = require("./routers/users");
const taskRouters = require("./routers/tasks");



const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouters)
app.use(taskRouters)

app.listen(port, () => {
  console.log("Server is running at port " + port);
});