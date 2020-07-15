const mongoose = require("mongoose");
const user = mongoose.model('User')
module.exports = () => {
    return new user({}).save();
};