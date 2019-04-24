var pidgeonModel = require('../models/pidgeons');

var pidgeonHandler = {
    getPidgeon: function(id){
        return new Promise(function(resolve, reject){
            pidgeonModel.findById(id, function(er, pidgeon){
                if(er){
                    reject({err: er.message, code: er.code});
                }else if(pidgeon != null){
                    resolve({
                        id: pidgeon.id,
                        name: pidgeon.name,
                        img: pidgeon.img,
                        scoreRating: pidgeon.getScoreRating(),
                        genderRating: pidgeon.getGenderRatings()
                        });
                }else{
                    reject({err: "Not found", code: 404});
                }
            });
        });
    },

    createPidgeon: function(name, img){
        return new Promise(function(resolve, reject){
            var pidgeon = new pidgeonModel();
            pidgeon.name = name;
            pidgeon.img = img;
            pidgeon.save(function(err, savedPidg){
                if(err) reject(err);
                resolve(savedPidg);
            });
        });
    },

    getAllPidgeons: function(){
        return new Promise(function(resolve, reject){
            pidgeonModel.find({}, function(err, pidgeonsArray){
                if(err) reject(err);
                resolve(pidgeonsArray);
            });
        });
    }
};

module.exports = pidgeonHandler;