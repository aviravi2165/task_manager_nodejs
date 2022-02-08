const mongoose = require('mongoose');
mongoose.connect(`${process.env.CONNECTION_URL}/${process.env.DB_NAME}`, {
    useNewUrlParser: true
});
