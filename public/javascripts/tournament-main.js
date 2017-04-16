let particChanges = false;
let sheetChanges = false;
let nextLevelChanges = {
  changes: false
};
let scoresChanges = {
    changes: false
}
let tourneyStarted = {
    changes: false
}

function addPartic(){
    let name = $('.add-new-name').val();
               $('.add-new-name').val('')
    let parag = $('<p></p>')
                .addClass('participant');
    let span = $('<span></span>')
                .addClass('participant-name')
                .html(name)
                .appendTo(parag);
    let current = +$('#curr-partic').html();
    let max =  +$('#total-partic').html();
    if(current < max){
        current += 1;
        $('#curr-partic').html(current);
        $('.participants').append(parag);
    } else {
        console.log('problem');
    }
    particChanges = true;
}

function getParticNames(){
   let partic = $('.participant-name').map(function(){
       return $(this).html();
   }).toArray();
   return partic
}

function removePartic(partic){
     let current = +$('#curr-partic').html();
         current -= 1;
     $('#curr-partic').html(current);
     $(partic).parent().remove();
     particChanges = true;
}

function saveChanges(){
    return new Promise(function(resolve,reject){
    let data = {};
    if(tourneyStarted.changes){
        data.startedDate = tourneyStarted.date;
    }
    if(particChanges){
        data.participants = getParticNames();
    };
    if(sheetChanges){
        data.sheet = $('[data-num="1"]').find('.username').map(function(){
             return $(this).html();
         }).toArray();   
    }
    if(nextLevelChanges.changes){
        data.winners = nextLevelChanges.winners;
    }
    if(scoresChanges.changes){
        data.scoresChanges = getScores();
    }
    let id = $('.sing-cont').attr('data-id');
    let path = `save-changes/${id}`
    $.ajax(path,{
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(data),
          success: function(result){
          console.log('success');    
          console.log(result);
          resolve(result)
                },
              error: function(err){
             reject(err)
                }
            })        
    }).catch(console.log)  
}

function generateShteet() {
         let names = $('.participant-name').map(function(){
             return $(this).html();
         }).toArray();
         let fields = $('[data-num="1"]').find('.username').toArray();
         let len = names.length;
         let left = fields.length;
         for(let i = 0; i < len; i += 1){
             $(fields[i]).html(names[i])
            }
         for(let i = len; i < left; i += 1){
             $(fields[i]).html('Blank')
         }
         $('[data-num="1"]').find('.username').map(function(){
             return $(this).html();
         }).toArray();       
            sheetChanges = true;
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

function generateNextLevel(){
    let currentLevelNum = +$('.level.current').attr('data-num');
    let currentLevelNames = $('.level.current').find('.username').map(function(){
         return $(this).html();
        }).toArray();
    let particScore = $('.level.current').find('.score').map(function(){
         return $(this).val();
        }).toArray();
    let winners = [];
    let len = particScore.length / 2;
    let j = 0, k = 1;
    for(let i = 0; i < len; i += 1){
        if(+particScore[j] > +particScore[k]){
            winners.push(currentLevelNames[j])
        } else if(+particScore[j] < +particScore[k]) {
            winners.push(currentLevelNames[k]);
        } else {
            winners.push(null)
        }
        j += 2;
        k += 2;
    }
    let nextLevelFields = $(`.level[data-num="${currentLevelNum + 1}"]`).find('.username').toArray();
        len = nextLevelFields.length;
        console.log(len);
    for(i = 0; i < len; i += 1){
        $(nextLevelFields[i]).html(winners[i])
    }
    if(!len){
        $('#winner p').html(winners[0]);
       }
    nextLevelChanges.changes = true;
    nextLevelChanges.winners = winners;
}
function editScores(){
    scoresChanges.changes = true;
}
function getScores(){
    let currentLevelScores = $('.level.current').find('.score').map(function(){
         return +$(this).val();
        }).toArray();
    return currentLevelScores;
}
function startTourney(){
    let date = Date.now();
    $('#add-partic-cont').remove();
    $('#gen-brackets').remove();
    tourneyStarted.date = date;
    tourneyStarted.changes = true;
}


        
//event listeners
$('.add-partic').on('click',function(ev){
    addPartic();
})

$('.participants').on('click','.remove',function(ev){
   removePartic(this);
})

$('.save-changes').on('click',function(ev){
    saveChanges();
})

$('#gen-brackets').on('click',function(ev){
    generateShteet();
})

$('#fill-next-level').on('click',function(ev){
    generateNextLevel();
})

$('#edit-scores').on('click',function(ev){
    editScores()
})

$('#start-tourney').on('click',function(ev){
    startTourney();
})