var express = require('express');
var router = express.Router();
var pidgeonHandler = require('../handlers/pidgeons');

/* SHOW all pidgeons. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* TODO: FIX Error => Cast to ObjectId failed for value "1we" at path "_id" for model "Pidgeon"*/
router.get('/:id', function(req, res, next) {
    pidgeonHandler.getPidgeon(req.params.id).then(function(pidgeon){
        res.send(pidgeon);
    }).catch(function(err){
        res.sendStatus(404).send(err);
    });
});

module.exports = router;
