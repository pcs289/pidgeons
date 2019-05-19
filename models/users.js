var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true }
});

var userModel = mongoose.model('User', userSchema);

module.exports =  userModel;