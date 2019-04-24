var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var userModel = require('../models/users');
var VerifyToken = require('../handlers/verifyToken');

router.post('/register', function(req, res, next){
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    userModel.create({name: req.body.name, email: req.body.email, password: hashedPassword}, function(err, createdUser){
        if(err) res.status(500).send("There was a problem registering the user.");
        var token = jwt.sign({id: createdUser._id}, process.env.TOKEN_SECRET, { expiresIn: 86400});
        res.send({auth: true, token: token});
    });
});

router.post('/login', function(req, res, next){
    //Check if exists name/email and verify hashedPassword
    var username = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    if(username && !email){
        userModel.findOne({name: username}).exec(function(err, user){
            if(!user) res.send({auth: false, reason: "Wrong username"});
            if(bcrypt.compareSync(password, user.pass)){
                var token = jwt.sign({id: user._id}, process.env.TOKEN_SECRET, { expiresIn: 86400 });
                res.send({auth: true, token: token});
            }else{
                res.send({auth: false, reason: "Wrong password"});
            }
        });
    }else if(!username && email){
        userModel.findOne({email: email}).exec(function(err, user){
            if(!user) res.send({auth: false, reason: "Wrong email"});
            if(bcrypt.compareSync(password, user.password)){
                var token = jwt.sign({id: user._id}, process.env.TOKEN_SECRET, { expiresIn: 86400 });
                res.send({auth: true, token: token});
            }else{
                res.send({auth: false, reason: "Wrong password"});
            }
        });
    }else{
        res.sendStatus(402).send({auth: false});
    }

});

router.get('/list', function(req, res, next){
    userModel.find({}, { password: 0, __v: 0}, function(err, users){
        res.send(users);
    });
});

router.get('/me', VerifyToken, function(req, res, next){
    userModel.findById(req.userId, { password: 0, __v: 0 }, function(err, user){
        if(err) res.send(err);
        res.send(user);
    });
});

module.exports = router;