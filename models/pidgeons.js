var mongoose = require("mongoose");

var pidgeonSchema = mongoose.Schema({
    name: String,
    img: String,
    accumulatedScore: { type: Number, default: 0 },
    totalScoreVotes: { type: Number, default: 0 },
    totalMaleVotes: { type: Number, default: 0 },
    totalFemaleVotes: { type: Number, default: 0 },
    totalNonBinaryVotes: { type: Number, default: 0 },
    totalGenderVotes: { type: Number, default: 0 }
});

/* Rate a pidgeon from 0 to 10 */
pidgeonSchema.methods.rateThisPidgeon = function(rating){
    this.accumulatedScore += +rating;
    this.totalScoreVotes++;
};

/* Discriminate a pidgeon whether a male "M" or female "F" or Non Binary "NB"*/
pidgeonSchema.methods.discriminateThisPidgeon = function(discrimination){
    if(discrimination === "M"){
        this.totalMaleVotes++;
        this.totalGenderVotes++;
    }else if(discrimination === "F"){
        this.totalFemaleVotes++;
        this.totalGenderVotes++;
    }else if(discrimination === "NB"){
        this.totalNonBinaryVotes++;
        this.totalGenderVotes++;
    }
};

pidgeonSchema.methods.getScoreRating = function(){
  return (this.accumulatedScore / this.totalScoreVotes) || 0;
};

pidgeonSchema.methods.getGenderRatings = function(){
    return {
        maleRating: (this.totalMaleVotes / this.totalGenderVotes) || 0,
        femaleRating: (this.totalFemaleVotes / this.totalGenderVotes) || 0,
        nonBinaryRating: (this.totalNonBinaryVotes / this.totalGenderVotes) || 0
    }
};

var pidgeonModel = mongoose.model('Pidgeon', pidgeonSchema);

module.exports =  pidgeonModel;