function checkWinner({player, enemy, timerId}){

    document.querySelector('#tie').style.display = 'flex' 
    clearTimeout(timerId)
    //player health conditions displaying appropriate text 
    if(player.health === enemy.health ){
        console.log('DRAW PLAY AGAIN')
        document.querySelector('#tie').style.display = 'flex' 
        document.querySelector('#tie').innerHTML = 'DRAW'
    }else if (player.health > enemy.health){
        console.log('PLAYER WINS')
        document.querySelector('#tie').style.display = 'flex' 
        document.querySelector('#tie').innerHTML = 'PLAYER WINS '
    }else if(enemy.health > player.health){
        console.log('ENEMY WINS')
        document.querySelector('#tie').style.display = 'flex'
        document.querySelector('#tie').innerHTML = 'ENEMY WINS'
    }
}

function rectangularCollision ({rectangle1, rectangle2,}){
    return(
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x 
        && rectangle1.attackBox.position.x <= rectangle2.position.x+ rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
        ) 
}
 

//timer function 
let timerId 
let timer = 60  // initial time is 10 seconds 
function decreaseTimer(){
    timerId = setTimeout(decreaseTimer , 1000) // makes it an infinite loop 
    if (timer > 0){
        timer -- //subtracting one from the timer
        document.querySelector('#timer').innerHTML = timer 
    }
    
    if(timer === 0 ){
        checkWinner({player, enemy, timerId})//calls check winner function 
        
    }    
}

