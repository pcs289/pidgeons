var pidgeonModel = require('../models/pidgeons');

var pidgeonHandler = {
    getPidgeon: function(id){
        return new Promise(function(resolve, reject){
            pidgeonModel.findById(id, function(er, pidgeon){
                if(pidgeon != null){
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

    getRandomPidgeon: function(){
        return new Promise(function(resolve, reject){
            pidgeonModel.estimatedDocumentCount().exec().then(function(n){
                var r = Math.floor(Math.random() * n);
                pidgeonModel.find({}, null, {limit: 1, skip: r}).then(function(arr){
                    var id = arr[0].id;
                    pidgeonModel.findById(id, function(er, pidgeon){
                        if(pidgeon != null){
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
            });
        });
    },

    ratePidgeon: function(id, score){
        return new Promise(function(resolve, reject){
            pidgeonModel.findOne({_id: id}, function(err, pidgeon) {
                if(err) {reject({err: "Not found", code: 404}); return;}
                pidgeon.rateThisPidgeon(score);
                pidgeon.save();
                resolve({
                    id: pidgeon.id,
                    name: pidgeon.name,
                    img: pidgeon.img,
                    scoreRating: pidgeon.getScoreRating(),
                    genderRating: pidgeon.getGenderRatings()
                });
            });
        });
    },

    getRanking: function(size, page, order){
        return new Promise(function(resolve, reject){
            if(order === "mostRated"){
                //Most Voted
                pidgeonModel.aggregate([
                    {"$sort": { "totalScoreVotes": -1}},
                    {"$skip": size * (page - 1)},
                    {"$limit": size},
                    {"$project":
                            {
                                "_id": 0,
                                "id": "$_id",
                                "img": 1,
                                "name": 1,
                                "scoreRating": { "$divide": ["$accumulatedScore", "$totalScoreVotes"]},
                                "totalScoreVotes": "$totalScoreVotes",
                                "genderRating": {
                                    "maleRating": {"$divide": ["$totalMaleVotes", "$totalGenderVotes"]},
                                    "femaleRating": {"$divide": ["$totalFemaleVotes", "$totalGenderVotes"]},
                                    "nonBinaryRating": {"$divide": ["$totalNonBinaryVotes", "$totalGenderVotes"]}
                                }
                            }
                    }
                ], function(err, pidgeons) {
                    if(err) {reject({err: "Not found", code: 404}); return;}
                    resolve(pidgeons);
                });
            }else if(order === "topScore"){
                //Most Rated
                pidgeonModel.aggregate([
                    {"$skip": size * (page - 1)},
                    {"$limit": size},
                    {"$project":
                            {
                                "_id": 0,
                                "id": "$_id",
                                "img": 1,
                                "name": 1,
                                "scoreRating": { "$divide": ["$accumulatedScore", "$totalScoreVotes"]},
                                "genderRating": {
                                    "maleRating": {"$divide": ["$totalMaleVotes", "$totalGenderVotes"]},
                                    "femaleRating": {"$divide": ["$totalFemaleVotes", "$totalGenderVotes"]},
                                    "nonBinaryRating": {"$divide": ["$totalNonBinaryVotes", "$totalGenderVotes"]}
                                }
                            }
                    },
                    {"$sort": { "scoreRating": -1}}
                ], function(err, pidgeons) {
                    if(err) {reject({err: err, code: 404}); return;}
                    resolve(pidgeons);
                });
            }else if(order === "mostDiscriminated"){
                //Most Discriminated
                pidgeonModel.aggregate([
                    {"$sort": { "totalGenderVotes": -1}},
                    {"$skip": size * (page - 1)},
                    {"$limit": size},
                    {"$project":
                            {
                                "_id": 0,
                                "id": "$_id",
                                "img": 1,
                                "name": 1,
                                "scoreRating": { "$divide": ["$accumulatedScore", "$totalScoreVotes"]},
                                "totalGenderVotes": "$totalGenderVotes",
                                "genderRating": {
                                    "maleRating": {"$divide": ["$totalMaleVotes", "$totalGenderVotes"]},
                                    "femaleRating": {"$divide": ["$totalFemaleVotes", "$totalGenderVotes"]},
                                    "nonBinaryRating": {"$divide": ["$totalNonBinaryVotes", "$totalGenderVotes"]}
                                }
                            }
                    }
                ], function(err, pidgeons) {
                    if(err) {reject({err: "Not found", code: 404}); return;}
                    resolve(pidgeons);
                });
            }else if(order === "topMale"){
                //Most Masculine
                pidgeonModel.aggregate([
                    {"$skip": size * (page - 1)},
                    {"$limit": size},
                    {"$project":
                            {
                                "_id": 0,
                                "id": "$_id",
                                "img": 1,
                                "name": 1,
                                "scoreRating": { "$divide": ["$accumulatedScore", "$totalScoreVotes"]},
                                "genderRating": {
                                    "maleRating": {"$divide": ["$totalMaleVotes", "$totalGenderVotes"]},
                                    "femaleRating": {"$divide": ["$totalFemaleVotes", "$totalGenderVotes"]},
                                    "nonBinaryRating": {"$divide": ["$totalNonBinaryVotes", "$totalGenderVotes"]}
                                }
                            }
                    },
                    {"$sort": { "genderRating.maleRating": -1}}
                ], function(err, pidgeons) {
                    if(err) {reject({err: "Not found", code: 404}); return;}
                    resolve(pidgeons);
                });
            }else if(order === "topFemale"){
                //Most Femenine
                pidgeonModel.aggregate([
                    {"$skip": size * (page - 1)},
                    {"$limit": size},
                    {"$project":
                            {
                                "_id": 0,
                                "id": "$_id",
                                "img": 1,
                                "name": 1,
                                "scoreRating": { "$divide": ["$accumulatedScore", "$totalScoreVotes"]},
                                "genderRating": {
                                    "maleRating": {"$divide": ["$totalMaleVotes", "$totalGenderVotes"]},
                                    "femaleRating": {"$divide": ["$totalFemaleVotes", "$totalGenderVotes"]},
                                    "nonBinaryRating": {"$divide": ["$totalNonBinaryVotes", "$totalGenderVotes"]}
                                }
                            }
                    },
                    {"$sort": { "genderRating.femaleRating": -1}}
                ], function(err, pidgeons) {
                    if(err) {reject({err: "Not found", code: 404}); return;}
                    resolve(pidgeons);
                });
            }else if(order === "topNonBinary"){
                //Most Non Binary
                pidgeonModel.aggregate([
                    {"$skip": size * (page - 1)},
                    {"$limit": size},
                    {"$project":
                            {
                                "_id": 0,
                                "id": "$_id",
                                "img": 1,
                                "name": 1,
                                "scoreRating": { "$divide": ["$accumulatedScore", "$totalScoreVotes"]},
                                "genderRating": {
                                    "maleRating": {"$divide": ["$totalMaleVotes", "$totalGenderVotes"]},
                                    "femaleRating": {"$divide": ["$totalFemaleVotes", "$totalGenderVotes"]},
                                    "nonBinaryRating": {"$divide": ["$totalNonBinaryVotes", "$totalGenderVotes"]}
                                }
                            }
                    },
                    {"$sort": { "genderRating.nonBinaryRating": -1}}
                ], function(err, pidgeons) {
                    if(err) {reject({err: "Not found", code: 404}); return;}
                    resolve(pidgeons);
                });
            }
        });
    },

    discriminatePidgeon: function(id, discrimination){
        return new Promise(function(resolve, reject){
            pidgeonModel.findOne({_id: id}, function(err, pidgeon){
                if(err) {reject({err: "Not found", code: 404}); return;}
                pidgeon.discriminateThisPidgeon(discrimination);
                pidgeon.save();
                resolve({
                    id: pidgeon.id,
                    name: pidgeon.name,
                    img: pidgeon.img,
                    scoreRating: pidgeon.getScoreRating(),
                    genderRating: pidgeon.getGenderRatings()
                });
            });
        });

    },

    createPidgeon: function(name, img){
        return new Promise(function(resolve, reject){
            var pidgeon = new pidgeonModel();
            pidgeon.name = name;
            pidgeon.img = img;
            pidgeon.save(function(err, savedPidg){
                if(err) {reject({err: "Could not be created", code: 500}); return;}
                resolve({
                    id: savedPidg.id,
                    name: savedPidg.name,
                    img: savedPidg.img,
                    scoreRating: savedPidg.getScoreRating(),
                    genderRating: savedPidg.getGenderRatings()
                });
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