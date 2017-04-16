participantChanges = {
    changes: false,
    changedNums: []
}

function changeName(ev){
    let $target = $(ev.target);
    let num = $target.prev().html();
    console.log(num);
    participantChanges.changedNums.push(num);
    participantChanges.changes = true;
}

function getChangedNames(array){
    let len = array.length;
    let changedUsers = [];
    let participantsNames = $('.participant-name').val().toArray();
        for(let i = 0; i < len; i += 1){
        let changedUser = {
            newName: participantsNames[array[i] - 1],
            num: array[i]
        }
    }
    return ChangedUsers;
}

$('.participant-name').on('change',function(ev){
    changeName(ev);
})

