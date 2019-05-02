var pidgeonModel = require('../models/pidgeons');

var pidgeonHandler = {
    getPidgeon: function(id){
        return new Promise(function(resolve, reject){
            pidgeonModel.findById(id, function(er, pidgeon){
                if(er){
                    reject({err: "Not found", code: 404});
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

    ratePidgeon: function(id, score){
        return new Promise(function(resolve, reject){
            pidgeonModel.findOne({_id: id}, function(err, pidgeon) {
                if(err) reject({err: "Not found", code: 404});
                pidgeon.rateThisPidgeon(score);
                pidgeon.save();
                resolve(pidgeon);
            });
        });
    },

    discriminatePidgeon: function(id, discrimination){
        return new Promise(function(resolve, reject){
            pidgeonModel.findOne({_id: id}, function(err, pidgeon){
                if(err) reject({err: "Not found", code: 404});
                pidgeon.discriminateThisPidgeon(discrimination);
                pidgeon.save();
                resolve(pidgeon);
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

    deletePidgeon: function(id){
        return new Promise(function(resolve, reject){
            pidgeonModel.findByIdAndDelete(id, { strict: true }, function(err){
               if(err) reject(err);
               resolve(true);
            });
        });
    },

    getAllPidgeons: function(size, page){
        return new Promise(function(resolve, reject){
            if(size > 0 && size <= 50 && page > 0){
                var query = {};
                query.skip = size * (page - 1);
                query.limit = size;
                pidgeonModel.countDocuments({}, function(err, totalCount){
                    var totalPages = Math.ceil(totalCount / size);
                    pidgeonModel.find({}, {}, query, function(err, pidgeonsArray){
                        console.log(err);
                        if(err) reject(err);
                        var resultArray = [];
                        pidgeonsArray.forEach(function(pidgeon){
                            resultArray.push({
                                id: pidgeon.id,
                                name: pidgeon.name,
                                img: pidgeon.img,
                                scoreRating: pidgeon.getScoreRating(),
                                genderRating: pidgeon.getGenderRatings()
                            });
                        });
                        var res = {};
                        res.totalPages = totalPages;
                        res.size = size;
                        res.page = page;
                        res.data = resultArray;
                        resolve(res);
                    });
                });
            }else{
                reject({err: "Bad Request", code: 400})
            }
        });
    }
};

module.exports = pidgeonHandler;