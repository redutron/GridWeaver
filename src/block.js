'use strict';
/*
 * A block. A block is made up of horizontal and vertical lines. However, only some of the
 * lines are drawn at any time, creating the effect of a grid
 * ----------------------------------------------------------------------------------------
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      24th February, 2022
 * @email:     redutron@protonmail.com
 * @license:   GNU General Public License v3.0
 */
class Block
{
    constructor(x,y,length)
    {
        this.x = x;
        this.y = y;
        this.length = length;
        this.lines = [];//all the lines that make up the block
        this.points = [];//all the vertices within the block
        this.activePoints = [];//the points that are set to be drawn
        this.setPoints()//the coordinates of the edges of the block and its center
        this.setActivePoints()//
    }
    startBlinking()
    {
        this.lines.forEach(function(ln,index)//update balls
        {
            ln.startBlinking();
        });
    }
    /*--------------------------------------
      Gets all the vertices within the block
    *---------------------------------------
    */
    setPoints()
    {
        this.points = [
          {x:this.x,y:this.y}, //upper left vertex
          {x:this.x + this.length,y:this.y},//upper right vertex
          {x:this.x + this.length,y:this.y + this.length},//middle vertex
          {x:this.x,y:this.y+ this.length},//bottom left vertex
          {x:this.x+ this.length/2,y:this.y+ this.length/2}];//bottom right vertex
    }
    /*-----------------------------------------------------------
      Sets all the vertices that are to be drawn within the block
    *------------------------------------------------------------
    */
    setActivePoints()
    {
        this.activePoints = [];
        let index = this.randomIntFromInterval(0, this.points.length -1); //pick a random point
        this.activePoints.push(this.points[index]);
        while(this.activePoints.length < 2)
        {
            var i;
            for (i = 0 ; i < 4; i++)
            {
                index = this.randomIntFromInterval(0, this.points.length -1);
                let point = this.points[index];
                if (!this.containsObject(point, this.activePoints))//point is not currently active
                {
                    this.activePoints.push(point);
                }
            }
        }
        this.setLines();
    }
    /*--------------------------------------------------------
      Gets all the lines that are to be drawn within the block
    *---------------------------------------------------------
    */
    getLines()
    {
        return this.lines;
    }
    /*--------------------------------------------------------
      Sets all the lines that are to be drawn within the block
    *---------------------------------------------------------
    */
    setLines()
    {
        this.lines = []
        for (let i = 0; i < this.activePoints.length - 1; i++) //scan every point to be drawn
        {
            let p1 = this.activePoints[i];
            let p2 = this.activePoints[i+1];
            this.lines.push( new Line(p1,p2));//get a line between them
        }
    }
    /*-------------------------------------------
      Checks if an object is an a list of objects
    *--------------------------------------------
    */
    containsObject(obj, list)
    {
        var i;
        for (i = 0; i < list.length; i++)//scan the list
        {
            if (list[i] === obj)
            {
                return true;
            }
        }
        return false;
    }
    draw()
    {
        this.lines.forEach(function(ln)//draw all the lines
        {
            ln.draw()
        });
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
    update(){}

}
