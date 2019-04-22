var pidgeonModel = require('../models/pidgeons');


var pidgeonHandler = {
    getPidgeon : function(id){
        var prom = new Promise(function(resolve, reject){
            pidgeonModel.findById(id, function(err, pidgeon){
                console.log(err.message);
            if(err){
                reject({err:"NotFound", code: 404});
            }else{
                resolve({
                    id: pidgeon.id,
                    name: pidgeon.name,
                    img: pidgeon.img,
                    scoreRating: pidgeon.getScoreRating(),
                    genderRating: pidgeon.getGenderRatings()
                    });
                }
            });
        });
        return prom;
    }
};

module.exports = pidgeonHandler;