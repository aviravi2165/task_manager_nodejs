const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').slice(7);
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ _id: decodedToken._id, 'tokens.token': token });

        if (!user) throw new Error("Error : Please Authenticate.");
        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send("Error : Please Authenticate.");
    }
}
module.exports = auth;