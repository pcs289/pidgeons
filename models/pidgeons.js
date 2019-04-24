var mongoose = require("mongoose");

var pidgeonSchema = mongoose.Schema({
    name: String,
    img: String,
    accumulatedScore: Number,
    totalScoreVotes: Number,
    totalMaleVotes: Number,
    totalFemaleVotes: Number,
    totalNonBinaryVotes: Number,
    totalGenderVotes: Number
});

/* Rate a pidgeon from 0 to 10 */
pidgeonSchema.methods.rateThisPidgeon = function(rating){
    this.accumulatedScore += rating;
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
  return this.accumulatedScore / this.totalScoreVotes;
};

pidgeonSchema.methods.getGenderRatings = function(){
    return {
        maleRating: this.totalMaleVotes / this.totalGenderVotes,
        femaleRating: this.totalFemaleVotes / this.totalGenderVotes,
        nonBinaryRating: this.totalNonBinaryVotes / this.totalGenderVotes
    }
};

var pidgeonModel = mongoose.model('Pidgeon', pidgeonSchema);

module.exports =  pidgeonModel;