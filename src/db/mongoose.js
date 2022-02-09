<<<<<<< HEAD
const mongoose = require("mongoose");
mongoose.connect(
  `${process.env.CONNECTION_URL}/${process.env.DB_NAME}`,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
  }
);
=======
const mongoose = require('mongoose');

mongoose.connect(`${process.env.CONNECTION_URL}/${process.env.DB_NAME}`);
>>>>>>> e3ac0927cc57b7b743756c022ec6ca8b15bcef75
