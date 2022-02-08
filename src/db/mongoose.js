const mongoose = require('mongoose');
const { CONNECTION_URL, DB_PORT, DB_NAME } = process.env;
mongoose.connect(`${CONNECTION_URL}:${DB_PORT}/${DB_NAME}`, {
    useNewUrlParser: true
});
