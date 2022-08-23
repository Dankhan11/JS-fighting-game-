//resizing the canvas to fit the game properly 
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');//getting a 2d context

//intialise the size of the canvas 
canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height) 

const gravity = 0.7
const background = new Sprite({
    position:{
        x:0,
        y:0,
    },
    imageSrc: './assets/background.png'
})
  



//adding the shops animation

const shop = new Sprite({
    position:{
        x:600,
        y:128,
    },
    imageSrc: './assets/shop.png',
    scale: 2.75,
    framesMax : 6 
})
//creating an instance of a player
const player = new Fighter({
    position:{
    x:0,
    y:0,
},
    velocity:{
    x:0,
    y:0,
},
    color:'red',

    offset:{
        x:215,
        y:157,
    },
    sprites:{
        idle:{
            imageSrc:'./assets/samuraiMack/idle.png',
            framesMax:8,
        },
        run:{
            imageSrc:'./assets/samuraiMack/Run.png',
            framesMax:8
        },
        jump:{
            imageSrc:'assets/samuraiMack/Jump.png',
            framesMax:2
        },
        fall:{
            imageSrc:'assets/samuraiMack/Fall.png',
            framesMax:2
        },
        attack1:{
            imageSrc:'assets/samuraiMack/Attack1.png',
            framesMax:6 
        }
    },
        attackBox:{
            offset:{
                x:0, 
                y:0, 

            },
            width:100,
            height:50
    },
    imageSrc:'./assets/samuraiMack/Idle.png',
    scale:2.5,
    framesMax:8
   
})

//creating an instance of an enemy 
const enemy = new Fighter({
    position:{
    x:300,
    y:100,
},
    velocity:{
     x:0,
     y:0,
},
    color:'green',

    offset:{
        x:50,
        y:170,
    },

    sprites:{
        idle:{
            imageSrc:'./assets/kenji/idle.png',
            framesMax:4,
        },
        run:{
            imageSrc:'./assets/kenji/Run.png',
            framesMax:8
        },
        jump:{
            imageSrc:'assets/kenji/Jump.png',
            framesMax:2
        },
        fall:{
            imageSrc:'assets/kenji/Fall.png',
            framesMax:2
        },
        attack1:{
            imageSrc:'assets/kenji/Attack1.png',
            framesMax:4 
        }

    },
    attackBox:{
        offset:{
            x:-150, 
            y:0, 

        },
        width:100,
        height:50
},
    imageSrc:'./assets/kenji/Idle.png',
    scale:2.5,
    framesMax:4

    
})

enemy.draw()
console.log(player)

//keys object 
const keys = {
    a:{
        pressed: false
    },
    d:{
        pressed:false
    }, 
    w:{
        pressed:false
    },
    ArrowLeft:{
        pressed:false
    },
    ArrowRight:{
        pressed:false
    },

    
}


decreaseTimer()



//keeps track of last key that is pressed 
let lastKey 

//animation function 
function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height )
   
    //rendering in layers 
    background.update()
    shop.update()
    player.update()
    enemy.update()

    //2:35:26

    //default velocities for both x and y planes 
    player.velocity.x = 0 //default set to 0 to stop movement 
    enemy.velocity.x = 0 //default velocity for enemy set to 0 
    
    //player movement
    
    if (keys.a.pressed && player.lastKey === 'a'){ //check for each keypress
        player.velocity.x = -5
       player.switchSprite('run') //changing image on key press
    } else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
        player.switchSprite('run')
    } else{
        player.switchSprite('idle')
    }

    if(player.velocity.y < 0 ){
        player.switchSprite('jump')
        player.framesMax = player.sprites.jump.framesMax
    } else if (player.velocity.y > 0 ){
        player.switchSprite('fall')
        player.framesMax = player.sprites.jump.framesMax
    }





    //enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5 
        enemy.switchSprite('run') //changing image on key press
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else{
        enemy.switchSprite('idle')
    }


    if(enemy.velocity.y < 0 ){
        enemy.switchSprite('jump')
        enemy.framesMax = enemy.sprites.jump.framesMax
    } else if (enemy.velocity.y > 0 ){
        enemy.switchSprite('fall')
        enemy.framesMax = enemy.sprites.jump.framesMax
    }


    //detect for collision 
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy,
        })
        && player.isAttacking){
        
        player.isAttacking = false
        enemy.health -= 20 //subtracting 20 hp
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }


    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player,
        })
        && enemy.isAttacking){
        
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    //end game 
    if( enemy.health <= 0 || player.health <=0){
        console.log('Game over')
        checkWinner({player, enemy}) //calling check winner function  

    }
}

animate()

//event listeners 

window.addEventListener('keydown', (event)=>{
  
    switch(event.key){//grab key currently pressed
        case 'd':
         keys.d.pressed = true
         player.lastKey = 'd'
        break
        case 'a':
         keys.a.pressed = true 
         player.lastKey = 'a'
        break
        case 'w':
         player.velocity.y = -20
        break
        case ' ':
        player.attack()  
        
        break  
        case 'ArrowRight':
         keys.ArrowRight.pressed = true
         enemy.lastKey = 'ArrowRight'
        break
        case 'ArrowLeft':
         keys.ArrowLeft.pressed = true 
         enemy.lastKey = 'ArrowLeft'
        break
        case 'ArrowUp':
         enemy.velocity.y = -20
        break
        case 'ArrowDown':
        enemy.attack()
        break

    


    }
 
})

//different cases for when the key is lifted 
window.addEventListener('keyup', (event)=>{
    switch(event.key){//grab key currently pressed
        case 'd':
        keys.d.pressed = false //boolean setting to false when key is left  
        break
        case 'a':
        keys.a.pressed = false 
        break
        case 'w':
        player.velocity.y = 0 
        break

        case 'ArrowRight':
        keys.ArrowRight.pressed = false //boolean setting to false when key is left  
        break
        case 'ArrowLeft':
        keys.ArrowLeft.pressed = false 
        break
        case 'ArrowUp':
        player.velocity.y = 0 
        break
    }
 
})


//2:38:45 