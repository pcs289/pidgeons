var express = require('express');
var router = express.Router();
var pidgeonHandler = require('../handlers/pidgeons');
var VerifyToken = require('../handlers/verifyToken');

/* SHOW all pidgeons. */
router.get('/', function(req, res, next) {
  pidgeonHandler.getAllPidgeons().then(function(pidgeons){
      res.send(pidgeons);
  }).catch(function(err){
      res.send(err);
  });
});


router.post('/', VerifyToken, function(req, res, next){
    var name = req.body.name;
    var img = req.body.img;
    pidgeonHandler.createPidgeon(name, img).then(function(pidgeon){
        res.send(pidgeon);
    }).catch(function(err){
        res.send(err);
    });
});

router.get('/:id', function(req, res, next) {
        pidgeonHandler.getPidgeon(req.params.id).then(function(pidgeon){
            res.send(pidgeon);
        }).catch(function(err){
            res.send(err);
        });
});

module.exports = router;
