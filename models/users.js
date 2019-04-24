var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

var userModel = mongoose.model('User', userSchema);

module.exports =  userModel;