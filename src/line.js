/*
 * A line linking two vertices in a block
 * --------------------------------------
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      24th February, 2022
 * @email:     redutron@protonmail.com 
 * @license:   GNU General Public License v3.0
 */
class Line
{
    constructor(p1,p2)
    {
        this.p1= p1;
        this.p2 = p2;
        this.strokeColor = "#0691ee";
        this.color = '#e5edf3';
        this.radius = 10;
        this.blinking = false;
        this.maxCounter = 100;
        this.blinkCounter = 0;
    }
    /*-----------------------------------------------
     Sets an end point on the line to blink
     NB: This happens anytime a ball touches the line
    *------------------------------------------------
    */
    startBlinking()
    {
        this.blinking = true;
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
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
    draw()
    {
        if (this.blinking)//if line is set to blink
        {
            this.blinkCounter++;
            //make the line look like its blinking
            noStroke();
            if (this.blinkCounter % 12 === 0)
            {
                fill('#f6ee07');//one shade of yellow
            }
            else
            {
                fill('#676303');//another shade of yellow
            }
            circle(this.p1.x, this.p1.y, this.radius * 2);
            noFill();
            //check if blinking must be stopped
            if(this.blinkCounter > this.maxCounter)
            {   //reset
                this.blinkCounter = 0;
                this.blinking = false;
            }
        }

        //draw the line
        stroke(this.strokeColor);
        strokeWeight(2);
        line(this.p2.x,this.p2.y,this.p1.x,this.p1.y);
        //draw the first end point on the line
        fill(this.color);
        circle(this.p1.x, this.p1.y, this.radius);
        //draw the last end point on the line
        fill(this.color);
        circle(this.p2.x, this.p2.y, this.radius);
    }
}
