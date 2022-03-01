'use strict';
/*
 * A ball
 * ------
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      24th February, 2022
 * @email:     redutron@protonmail.com  
 * @license:   GNU General Public License v3.0
 */
class Ball
{
    constructor(x,y,blocks,screenWidth, screenHeight)
    {
        this.x = x;
        this.y = y;
        this.blocks = blocks;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        //most recent coordinates of the center
        this.xOld = this.x;
        this.yOld = this.y;
        this.radius = 12;
        this.unitDistance = 7;
        this.balls;
        this.speed  = this.getStartingVelocity();//the direction and speed with which the ball moves on start
        this.numOfDirections = 16;
        this.activeDirection = this.randomIntFromInterval(1, this.numOfDirections)
        this.distanceMoved = 0
        this.maxDistance = 25
        this.lineLength = 10
        this.color = '#000c16';
        this.tail = {x:this.x, y:this.y}
    }
    /*-----------------------------------------------------------------------------------------------
     Sets the direction of a ball.
     The ball switches between 8 directions: up,down,left,right,up-right,down-right,up-left,down-left
    *------------------------------------------------------------------------------------------------
    */
    setActiveDirection()
    {
        let activeDir = this.activeDirection;//get the current direction of the ball
        for(;;)//keep randomly selecting until a new direction is found that is different from the current direction
        {
            this.activeDirection = this.randomIntFromInterval(1, this.numOfDirections);//randomly choose a direction
            if (activeDir != this.activeDirection)//new direction differs from current direction
            {
                break; //accept the new direction
            }
        }
        this.distanceMoved = 0 //reset the distance moved tracker
        this.tail = {x:this.x, y:this.y}
    }
    moveInActiveDirection()
    {
        switch(this.activeDirection)
        {
            case 1: this.moveUp(); break;
            case 2: this.moveDown(); break;
            case 3: this.moveRight(); break;
            case 4: this.moveLeft(); break;
            case 5: this.moveUpRight(); break;
            case 6: this.moveUpLeft();  break;
            case 7: this.moveDownRight(); break;
            case 8: this.moveDownLeft(); break;
            /*From observation, the balls tend to cluster towards the upper left corner of the screen.
            The cases below are "weights" to skew the balls evenly across the screen
            */
            case 9:  this.moveRight(); break;
            case 10: this.moveRight(); break;
            case 11: this.moveRight(); break;
            case 12: this.moveRight(); break;
            case 13: this.moveDown(); break;
            case 14: this.moveDown(); break;
            default: this.moveDown();
        }
    }
    /*--------------------------------------------------------------
     Gets a random number between two integers, min and max included
     @param Integer min the smaller of the integer inputs
     @param Integer max the greater of the integer inputs
     @return Integer a random number between the two integer inputs
    *---------------------------------------------------------------
    */
    randomIntFromInterval(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    /*-----------------------------------------------------------------------
     The velocity with which the ball moves at the beginning of the animation
    *------------------------------------------------------------------------
    */
    getStartingVelocity()
    {
        let
        //flip a coin to decide if ball moves right or left
        x = Math.random() > 0.5? -this.unitDistance: this.unitDistance,
        //flip a coin to decide if ball moves upwards or downwards
        y = Math.random() > 0.5? -this.unitDistance: this.unitDistance;
        return {x:x, y:y};
    }
    /*------------------------------------------------------
     Checks if ball is touching the left side of the screen
    *------------------------------------------------------
    */
    isTouchingLeftWall()
    {
        if(this.x - this.radius <= 0) //has touched left wall
        {
            return true;
        }
        return false;
    }
    /*------------------------------------------------------
     Checks if ball is touching the right side of the screen
    *------------------------------------------------------
    */
    isTouchingRightWall()
    {
        if(this.x + this.radius >= this.screenWidth) //has touched right wall
        {
            return true;
        }
        return false;
    }
    /*----------------------------------------------------
     Checks if ball is touching the top side of the screen
    *-----------------------------------------------------
    */
    isTouchingCeiling()
    {
        if(this.y - this.radius <= 0)//has touched ceiling
        {
            return true;
        }
        return false;
    }
    /*-------------------------------------------------------
     Checks if ball is touching the bottom side of the screen
    *--------------------------------------------------------
    */
    isTouchingFloor()
    {
        if(this.y + this.radius >= this.screenHeight)//has touched the floor
        {
            return true;
        }
        return false;
    }
    /*-----------------------------------------------
     Checks if ball is touching an edge of the screen
    *------------------------------------------------
    */
    checkWallCollision()
    {
        switch(true)
        {
            case this.isTouchingLeftWall():
              this.x = this.radius + 1; //back off from the left wall
              this.setActiveDirection()//stop going left. Try another direction
              break;
            case this.isTouchingRightWall():
              this.x = this.screenWidth - this.radius - 1; //back off from the right wall
              this.setActiveDirection() //stop going right. Try another direction
              break;
            case this.isTouchingFloor():
              this.y = this.screenHeight - this.radius - 1; //back off from the floor
              this.setActiveDirection() //stop going down. Try another direction
              break;
            case this.isTouchingCeiling():
              this.y = this.radius + 1;//back off from the ceiling
              this.setActiveDirection() //stop going up. Try another direction
              break;
        }
    }
    /*-------------------------------------------
     Checks if this ball is touching another ball
    *--------------------------------------------
    */
    checkBallCollision()
    {
        for(let i = 0; i < this.balls.length; i++)//scan all the balls on the grid
        {
            let ball = this.balls[i];
            if(this.hasTouchedAnotherBall(ball))
            {   //back off a bit
                this.x = this.xOld-this.unitDistance;
                this.y = this.yOld-this.unitDistance;
                //stop going in current direction. Try another direction
                this.setActiveDirection()
                break;
            }
        }
    }
    /*------------------------------------------
     Compares 2 balls to see if they are touching
    *-------------------------------------------
    @return, True if ball is touching another ball, false otherwise
    */
    hasTouchedAnotherBall(node)
    {
        if ( node.x == this.x & node.y == this.y) //same as this ball
        {
            return false;//no need to check
        }
        if(Math.abs(node.x - this.x) > node.radius || Math.abs(node.y - this.y) > node.radius)//other ball is not close enough
        {
            return false;//too far away
        }
        let distX = Math.pow(this.x - node.x,2);
        let distY = Math.pow(this.y - node.y,2);
        let distance = Math.sqrt(distX + distY) //find euclidean distance between the two balls
        return distance <= this.radius //distance compare with radius.
    }
    /*--------------------------------------
     Checks if ball has collided with a line
    *---------------------------------------
    */
    checkLineCollision()
    {
        let x = this.x;
        let y = this.y;
        let collisionFound = false;//assume there's no collision yet
        for (let k = 0; k < this.blocks.length; k++)//scan every block in the grid
        {
            let block = this.blocks[k];//current block being considered
            let lines = block.getLines();
            for(let i = 0; i < lines.length; i++)//scan each line within the block
            {
                let line = lines[i];
                let center = {x:this.x, y:this.y}
                if(this.hasTouchedALine(line.p1, line.p2, center, this.radius))
                {
                    //back off a bit
                    this.x = this.xOld- this.unitDistance;
                    this.y = this.yOld- this.unitDistance;
                    this.setActiveDirection(); //move ball in a different direction
                    block.setActivePoints();
                    this.blocks[k].startBlinking()
                    collisionFound = true
                    break;
                }
            }
            if (collisionFound)
            {
              break;
            }
        }
    }
    /*--------------------------------------------------------
     Makes this ball aware of all the other balls in the grid
    *--------------------------------------------------------
    */
    setBalls(balls)
    {
      this.balls = balls
    }
    /*--------------------------------------
     Checks if this ball is touching a line
    *---------------------------------------
    @param Integer A, first end point on line segment
    @param Integer B, second end point on the line segment
    @param Object C, center coordinates of the circle
    @param Double radius, the radius of the circle
    @return Boolean, True if ball has touched a line, false otherwise
    */
    hasTouchedALine(A, B, C, radius)
    {
        var dist;
        const v1x = B.x - A.x;
        const v1y = B.y - A.y;
        const v2x = C.x - A.x;
        const v2y = C.y - A.y;
        // get the unit distance along the line of the closest point to circle center
        const u = (v2x * v1x + v2y * v1y) / (v1y * v1y + v1x * v1x);
        // if the point is on the line segment get the distance squared from that point to the circle center
        if(u >= 0 && u <= 1){
            dist  = (A.x + v1x * u - C.x) ** 2 + (A.y + v1y * u - C.y) ** 2;
        } else {
            // if closest point not on the line segment
            // use the unit distance to determine which end is closest
            // and get dist square to circle
            dist = u < 0 ?
                  (A.x - C.x) ** 2 + (A.y - C.y) ** 2 :
                  (B.x - C.x) ** 2 + (B.y - C.y) ** 2;
        }
        return dist < radius * radius;
     }
    /*---------------------------------------
      Moves this ball vertically upwards only
    *----------------------------------------
    */
    moveUp()
    {
        this.x += 0; //don't go left or right
        if (this.speed.y >= 0)//ball is not moving up
        {
          this.speed.y = -this.unitDistance //set ball to move up
        }
        this.y += this.speed.y;//move the ball up
    }
    /*-----------------------------------------
      Moves this ball vertically downwards only
    *------------------------------------------
    */
     moveDown()
     {
         this.x += 0; //don't go left or right
         if (this.speed.y <= 0)//ball is not moving down
         {
           this.speed.y = this.unitDistance //set ball to move down
         }
         this.y += this.speed.y;//move the ball up
     }
     /*---------------------------------------
       Moves this ball horizontally right only
     *----------------------------------------
     */
     moveRight()
     {
         this.y += 0; //don't go up or down
         if (this.speed.x <= 0)//ball is not moving right
         {
           this.speed.x = this.unitDistance //set ball to move right
         }
         this.x += this.speed.x;//move the ball right
     }
     /*---------------------------------------
       Moves this ball horizontally left only
     *----------------------------------------
     */
     moveLeft()
     {
         this.y += 0; //don't go up or down
         if (this.speed.x >= 0)//ball is not moving left
         {
           this.speed.x = -this.unitDistance //set ball to move left
         }
         this.x += this.speed.x;//move the ball left
     }
     /*------------------------------------------------
       Moves this ball in the north-east direction only
     *-------------------------------------------------
     */
     moveUpRight()
     {
         if (this.speed.x <= 0)//ball is not moving right
         {
           this.speed.x = this.unitDistance //set ball to move right
         }
         if (this.speed.y >= 0)//ball is not moving up
         {
           this.speed.y = -this.unitDistance //set ball to move up
         }
         this.x += this.speed.x;//move the ball right
         this.y += this.speed.y;//move the ball up
     }
     /*------------------------------------------------
       Moves this ball in the north-west direction only
     *-------------------------------------------------
     */
     moveUpLeft()
     {
         if (this.speed.x >= 0)//ball is not moving left
         {
           this.speed.x = -this.unitDistance //set ball to move left
         }
         if (this.speed.y >= 0)//ball is not moving up
         {
           this.speed.y = -this.unitDistance //set ball to move up
         }
         this.x += this.speed.x;//move the ball left
         this.y += this.speed.y;//move the ball up
     }
     /*------------------------------------------------
       Moves this ball in the south-east direction only
     *-------------------------------------------------
     */
     moveDownRight()
     {
         if (this.speed.x <= 0)//ball is not moving right
         {
           this.speed.x = this.unitDistance //set ball to move right
         }
         if (this.speed.y <= 0)//ball is not moving down
         {
           this.speed.y = this.unitDistance //set ball to move down
         }
         this.x += this.speed.x;//move the ball right
         this.y += this.speed.y;//move the ball down
     }
     /*------------------------------------------------
       Moves this ball in the south-west direction only
     *-------------------------------------------------
     */
     moveDownLeft()
     {
         if (this.speed.x >= 0)//ball is not moving left
         {
           this.speed.x = -this.unitDistance //set ball to move left
         }
         if (this.speed.y <= 0)//ball is not moving down
         {
           this.speed.y = this.unitDistance //set ball to move down
         }
         this.x += this.speed.x;//move the ball left
         this.y += this.speed.y;//move the ball down
     }
    update()
    {
        this.xOld = this.x;
        this.yOld = this.y;
        this.moveInActiveDirection();

        //check collisions
        this.checkWallCollision();
        this.checkBallCollision();
        this.checkLineCollision();

        this.distanceMoved += this.unitDistance; //update the distance moved in the current direction
        if (this.distanceMoved >= this.maxDistance) //prevent ball from straying too far in a one direction
        {
            this.setActiveDirection()
        }
    }
    draw()
    {
        noStroke();
        //fill(this.color);

        //draw the head
        fill("rgba(244, 208, 63,1)");//outer circle
        circle(this.x,this.y,this.radius);
        fill("rgba(0,0,0,1)");//inner circle
        circle(this.x,this.y,this.radius/2);

        //draw tail
        fill("rgba(244, 208, 63,1)");//outer circle
        circle(this.tail.x,this.tail.y,this.radius/2);
        fill("rgba(0,0,0,1)");//inner circle
        circle(this.tail.x,this.tail.y,this.radius/4);

        stroke("black");
        strokeWeight(2);
        line(this.x,this.y,this.tail.x,this.tail.y);


    }

}
