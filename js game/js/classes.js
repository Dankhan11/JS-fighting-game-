
class Sprite {
    constructor({position, imageSrc, scale = 1, framesMax = 1 , offset = {x:0, y:0},}) {//passing as objects
        this.position = position 
        this.width = 50
        this.height = 150 
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale 
        this.framesMax  = framesMax
        this.frameCurrent = 0
        this.framesElapsed = 0 //how many frames have we gone over in the whole enamtion
        this.framesHold = 10
        this.offset = offset
        
    }
        

    draw(){
        //drawing the image
        c.drawImage(
            //cropping the image 
            this.image, //grabbimg
            this.frameCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,//number of frames within the image 
            this.image.height,


            this.position.x - this.offset.x , 
            this.position.y - this.offset.y, 
            (this.image.width / this.framesMax) * this.scale,  //resizing the image 
            this.image.height * this.scale)
            

    }
   
    animateFrame(){
        this.framesElapsed++
        if (this.framesElapsed % this.framesHold === 0){

            if (this.frameCurrent < this.framesMax - 1){
                this.frameCurrent++
            } else{
                this.frameCurrent = 0 
            }
        }
    }


    update(){
        this.draw()
        this.animateFrame()
        
    } 
}


//stopped at 2:15:29


class Fighter extends Sprite{
    constructor({position, velocity, color = 'red', offset = {x:0, y:0}, imageSrc, scale = 1, framesMax = 1, sprites, attackBox  = {offset:{}, width:undefined, height: undefined} }) {//passing pos and veloc as object
       
       
       super({
        imageSrc,
        framesMax,
        scale,
        position,
        offset,
       
        

       })
       
     
        this.velocity = velocity
        this.width = 50
        this.height = 150 
        this.lastKey//allows for property to be independent 
        this.attackBox = {
            position:{
                x:this.position.x,
                y:this.position.y
            },//position changes relative to player
            offset:attackBox.offset,
            width:attackBox.width,
            height:attackBox.height,
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.frameCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 8
        this.sprites = sprites
        
        for (const sprite in sprites){
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
        
        
    }

   
   
    update(){
        this.draw()
        this.animateFrame()

        this.attackBox.position.x = this.position.x - this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        c.fillRect(this.attackBox.position.x , this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

        this.position.x += this.velocity.x // defines how player moves in x axis
        this.position.y += this.velocity.y //increasing our velocity
        
        //gravity function 
        if(this.position.y + this.height + this.velocity.y >= canvas.height - 97 ){
            this.velocity.y = 0 //stopping player from moving downward
            this.position.y = 330  
        }else{
            this.velocity.y += gravity
        }
    } 


    //2:48 SWITCH CASE 
    //method for switching between sprite
    switchSprite(sprite){
        if(this.image === this.sprites.attack1.image && this.frameCurrent < this.sprites.attack1.framesMax -1){
            return 
        }
        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image){
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.frameCurrent = 0 
                }
            break ;
            case 'run':
                if (this.image !== this.sprites.run.image){
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.frameCurrent = 0 
                }
            break ; 
            case 'jump':
                if (this.image !== this.sprites.jump.image){
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.frameCurrent = 0 
                }
            break ;
            case 'fall':
                if (this.image !== this.sprites.fall.image){
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.frameCurrent = 0 
                }
            break;
            case 'attack1':
                if (this.image !== this.sprites.attack1.image){
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.frameCurrent = 0 
                }
            break;
        }

    }

    attack(){
        this.switchSprite('attack1')
        this.isAttacking = true
        //set a timer so it is back to its original value
        setTimeout(()=>{   
            this.isAttacking = false //condition set back  
        }, 100) 
    }
}