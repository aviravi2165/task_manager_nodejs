require("./db/mongoose");
const express = require("express");
const userRouters = require("./routers/users");
const taskRouters = require("./routers/tasks");

const app = express();

const port = process.env.PORT;

const multer = require("multer");
const upload = multer({
  dest: "images",
  limits: {
    fileSize: 4000000,
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(JPG|PNG|JPEG)/)) {
      return callback(
        new Error("File must be a Image Document"
      );
    }
    callback(undefined, true);
  },
});

app.post("/upload", upload.single("upload"), (req, res) => {
  res.send("Success");
});

app.use(express.json());
app.use(userRouters);
app.use(taskRouters);

app.listen(port, () => {
  console.log("Server is running at port " + port);
});
