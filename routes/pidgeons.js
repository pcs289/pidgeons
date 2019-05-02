var express = require('express');
var router = express.Router();
var pidgeonHandler = require('../handlers/pidgeons');
var VerifyToken = require('../handlers/verifyToken');

/* SHOW all pidgeons. */
router.get('/', function(req, res) {
    var size = parseInt(req.body.size);
    var page = parseInt(req.body.page);
    pidgeonHandler.getAllPidgeons(size, page).then(function(pidgeons){
        res.send(pidgeons);
    }).catch(function(err){
        res.send(err);
    });
});

/* CREATE a pidgeon */
router.post('/', VerifyToken, function(req, res){
    var name = req.body.name;
    var img = req.body.img;
    pidgeonHandler.createPidgeon(name, img).then(function(pidgeon){
        res.send(pidgeon);
    }).catch(function(err){
        res.send(err);
    });
});

/* DELETE a pidgeon */
router.delete('/:id', VerifyToken, function(req, res){
    var id = req.params.id;
    pidgeonHandler.deletePidgeon(id).then(function(){
        res.sendStatus(200);
    }).catch(function(err){
        res.send(err);
    });
});

/* GET a pidgeon */
router.get('/:id', function(req, res) {
        pidgeonHandler.getPidgeon(req.params.id).then(function(pidgeon){
            res.send(pidgeon);
        }).catch(function(err){
            res.send(err);
        });
});

/* Rate a pidgeon */
router.post('/:id/rate', function(req, res){
    var id = req.params.id;
    var score = req.body.rate;
    pidgeonHandler.ratePidgeon(id, score).then(function(pidgeon){
        res.send(pidgeon);
    }).catch(function(err){
        res.send(err);
    });
});

/* MALE-DISCRIMINATE a pidgeon */
router.post('/:id/male', function(req, res){
    var id = req.params.id;
    pidgeonHandler.discriminatePidgeon(id, "M").then(function(pidgeon){
        res.send(pidgeon);
    }).catch(function(err){
        res.send(err);
    });
});

/* FEMALE-DISCRIMINATE a pidgeon */
router.post('/:id/female', function(req, res){
    var id = req.params.id;
    pidgeonHandler.discriminatePidgeon(id, "F").then(function(pidgeon){
        res.send(pidgeon);
    }).catch(function(err){
        res.send(err);
    });
});

/* NONBINARY-DISCRIMINATE a pidgeon */
router.post('/:id/nonbinary', function(req, res){
    var id = req.params.id;
    pidgeonHandler.discriminatePidgeon(id, "NB").then(function(pidgeon){
        res.send(pidgeon);
    }).catch(function(err){
        res.send(err);
    });
});

module.exports = router;
