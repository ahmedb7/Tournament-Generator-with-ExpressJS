let mongoose = require('mongoose');


let customUserSchema = mongoose.Schema({
    name: {type: String, default: ''},
    num: {type: Number}
})

let matchSchema = mongoose.Schema({
    name: {type: String, default: ''},
    torney: {type: mongoose.Schema.Types.ObjectId, ref: 'Torney'},
    level: {type: Number, default: 1},
    user1: customUserSchema,
    user2: customUserSchema,
    user1Score: {type: Number, default: 0},
    user2Score: {type: Number, default: 0},
    starts: {type: Date},
    ends: {type: Date},
    finished: {type: Boolean, default: false},
    winner: {type: String,default: null}
})

let levelSchema = new mongoose.Schema({
    levelNum: {type: Number, default: 1},
    levelEnds: {type: Date},
    currentLevel: {type: Boolean,default:false},
    matches: [matchSchema]
})




let torneySchema = mongoose.Schema({
    torneyName: {type: String,default: 'standart' + Date.now()},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    creatorUsername: {type: String},
    field: {type: String, default: 'global'},
    fieldName: {type: String, default: ''},
    levelsNum: {type: Number,default: 0},
    levels: [levelSchema],
    currentLevel: {type: Number,default: 0},
    particNum: {type: Number},
    particCurrent: {type: Number,default: 0},
    participants: [customUserSchema],
    createdOn:{type: Date, default: Date.now},
    starts: {type: Date,default: ''},
    ends: {type: Date, default: ''},
    winner: {type: String ,default: null}
})
torneySchema.method({
    generateLevels: function(number){
        let levels = [];
        for (let i = 1; i < number + 1; i += 1){
            let level = {}
            if(i == 1){level.currentLevel = true}
            level.levelNum = i;
            levels.push(level)
        }
        return levels
    },
    getLevelsNum: function(chars){
        let levelsNum = 0;
        while(chars % 2 == 0){
            levelsNum += 1
            chars /= 2;
        }
        return levelsNum;
    },
    checkIfFull: function(){
        if(this.particNum === this.particCurrent){
            return true
        } else {
            return false
        }
    },
    startTorney: function(){
        this.starts = Date.now();
        // this.ends = Date.now() + this.levelsNum * 86400000;
        let len = this.levels.lenght;
        for(let i = 0; i < len; i += 1){
            this.levels[i].levelEnds = this.starts + this.levels[i].levelNum * 86400000;
        }
        
    },
    generateMatches: function(){
        let len = this.levelsNum,
            newMatches = this.particNum / 2;
        for(let i = 0; i < len; i += 1){   
            for(let j = 0; j < newMatches; j += 1){
                let newMatch = {};
                newMatch.name = `Fight ${j + 1}`;
                newMatch.user1 = {name: 'Blank'};
                newMatch.user2 = {name: 'Blank'};
                newMatch.torney = this._id;
                newMatch.level = i + 1;
                // newMatch.starts = thisStarts + i * 86400000;
                // console.log(newFight.starts);
                // console.log(newFight.starts + 86400000);
                // newMatch.ends = newMatch.starts + 86400000;
                this.levels[i].matches.push(newMatch);
            }
            newMatches /= 2;
        }
    },

})


module.exports = mongoose.model('Torney',torneySchema);