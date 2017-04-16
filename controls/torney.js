let Tourney = require('../database/models/tourney');
let User = require('../database/models/user');
function createTourney(reqbody,id){
     return new Promise(function(resolve,reject){
         let newTorney = new Tourney();
            newTorney.torneyName = reqbody.torneyname;
            newTorney.createdBy = id;
            newTorney.creatorUsername = id.username;
            newTorney.particNum = reqbody.fightersnum;
            newTorney.field = reqbody.field;
            newTorney.fieldName = reqbody.fieldname;
            newTorney.levelsNum = newTorney.getLevelsNum(newTorney.particNum);
            newTorney.levels = newTorney.generateLevels(newTorney.levelsNum);
            newTorney.generateMatches()
            User.findById(id)
                .then(function(user){
                     user.tourneys.push(newTorney._id);
                     user.save() 
                         .catch(reject);
                     })
            newTorney.save()    
                    .then(function(tourney){
                          resolve(tourney);
                    })
                    .catch(reject);
                })
    }

function findTourney(id){
    return Tourney.findById(id)
}

function findTourneys(){
    return Tourney.find({})
}

function saveChanges(id,reqbody){
    return new Promise(function(resolve,reject){
        Tourney.findById(id)
               .then(function(tourney){
                   if(reqbody.startedDate){
                       tourney.starts = reqbody.startedDate
                   }
                   if(reqbody.participants){
                       let len = reqbody.participants.length;
                    if(len > tourney.particNum) {
                      reject('Not this time')
                     }
                      let count = 0;
                      tourney.particCurrent = 0;
                      tourney.participants = []; 
                  for(let i = 0; i < len; i += 1){
                      let newPartic = {
                          name: reqbody.participants[i],
                          num: count += 1
                      };
                      tourney.particCurrent += 1;
                      tourney.participants.push(newPartic);
                    }
                   }
                   if(reqbody.sheet){
                     let len = reqbody.sheet.length / 2, k = 0,  l = 1,
                         sheet = reqbody.sheet;
                   for(let i = 0; i < len; i += 1){
                    tourney.levels[0].matches[i].user1.name = sheet[k];
                    tourney.levels[0].matches[i].user2.name = sheet[l];
                    k += 2;
                    l += 2;
                     }
                   }
                   if(reqbody.scoresChanges){
                       let len = reqbody.scoresChanges.length / 2;
                       let matches = tourney.levels[tourney.currentLevel].matches;
                       let k = 0, l = 1;
                       for(let i = 0; i < len; i += 1){
                           matches[i].user1Score = reqbody.scoresChanges[k];
                           matches[i].user2Score = reqbody.scoresChanges[l];
                           k += 2;
                           l += 2;
                       }
                   }
                   if(reqbody.winners){  
                      if(tourney.currentLevel < tourney.levelsNum){
                      tourney.levels[tourney.currentLevel].currentLevel = false;
                      if(tourney.levels[tourney.currentLevel].levelNum == tourney.levelsNum){
                          console.log(reqbody.winners);
                          tourney.finished = true;
                          tourney.winner = reqbody.winners[0];
                          tourney.levels[tourney.currentLevel].matches[0].winner = tourney.winner;
                      } else {
                        tourney.levels[tourney.currentLevel + 1].currentLevel = true;  
                        tourney.currentLevel += 1; 
                        let len = reqbody.winners.length / 2;
                        let matches = tourney.levels[tourney.currentLevel].matches;
                        let matchesPrev = tourney.levels[tourney.currentLevel - 1].matches;
                        let k = 0, l = 1;
                        for(let i = 0; i < len; i += 1){
                            matches[i].user1.name =  reqbody.winners[k];
                            matches[i].user2.name =  reqbody.winners[l];
                            matchesPrev[k].winner =  reqbody.winners[k];
                            matchesPrev[l].winner =  reqbody.winners[l];
                            k += 2;
                            l += 2;
                         }
                       }
                     } else {
                         reject('Not this time')
                     }
                   }
                   
                  tourney.save()
                         .then(resolve)
                         .catch(reject);
              })
              .catch(reject);
    })
}

function findMyTourneys(id){
    return new Promise(function(resolve,reject){
    User.findById(id)
        .populate('tourneys')
        .then(function(user){
          resolve(user.tourneys)
        })
         .catch(reject);
    })
}

function shuffle(array) {
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function editTourney(id,reqbody){
    return new Promise(function(resolve,reject){
    Tourney.findById(id)
           .then(function(tourney){
                resolve(tourney);               
           })
           .catch(reject)
    })
}


module.exports = {
    createTourney,
    findTourney,
    findTourneys,
    saveChanges,
    editTourney,
    findMyTourneys
}