const mongoose = require('mongoose');

const connectionURL = "mongodb://127.0.0.1";
const port = "27017";
const dbName = "task-manager";

mongoose.connect(`${connectionURL}:${port}/${dbName}`, {
    useNewUrlParser: true
});
