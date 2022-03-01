/*
 * Sets everything up
 * ------------------
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      24th February, 2022
 * @email:     redutron@protonmail.com 
 * @license:   GNU General Public License v3.0
 */
let blocks = []; //square blocks within the grid
let balls = []; //circles moving about in the grid
let lines = []; //straight lines joining one node to another
let blockLength = 50;//Determines the minimum distance between blocks either vertically or horizontally
let horizontalOffset = 0;//allowance left at the edge of the screen along the x-axis
let verticalOffset = 0;//allowance left at the edge of the screen along the y-axis
let backgroundColor = 'rgba(2,45,74,1)';//blue
/*----------------------------------------------------------------------------------------
  Divides the canvas into a grid of squares and gets the upper left vertex of each
  square to be created.
  @param Double blockLength, the vertical and horizontal distance between adjacent squares
  @param Object windowSize, the size of the screen
  @return Object, all vertices that belong to blocks, and all vertices that belong to balls
*-----------------------------------------------------------------------------------------
*/
function getBlockVertices(blockLength,windowSize)//divide the canvas into blocks
{
    let
    blockVertices = [],
    ballVertices = [];
    //How many blocks can be set on the canvas horizontally?
    let numHorizontal = ~~(windowSize.width/blockLength);//num of blocks that can be packed horizontally
    let horizontalRemainder = windowSize.width - blockLength * numHorizontal;//the horizontal space left when all blocks are packed
    horizontalOffset = horizontalRemainder/2;//so an equal space is at the left and right of the grid
    //How many blocks can be set on the canvas vertically?
    let numVertical = ~~(windowSize.height/blockLength);//num of blocks that can be packed vertically
    let verticalRemainder = windowSize.height - blockLength * numVertical;//the vertical space left when all blocks are packed
    verticalOffset = verticalRemainder/2;//so an equal space is at the top and bottom of the grid

    for(;;)//don't stop until at least 1 vertex for a ball is found
    {
        for(let y = verticalOffset; y < windowSize.height; y+=blockLength)//get all points in the grid, starting from the top to the bottom
        {
            if(y+ blockLength > windowSize.height)//if the next point is beyond the bottom edge of the canvas
            {
                continue; //skip
            }
            for(let x = horizontalOffset; x < windowSize.width; x+=blockLength)//all the while, getting all the horizontal points at each level
            {
                if(x+blockLength > windowSize.width)//if the next point is beyond the right edge of the canvas
                {
                    continue; //skip
                }
                //flip a coin to add or reject the vertex
                if( coinFlipIsAllHeads(1))//vertex is accepted
                {
                    blockVertices.push({x:x,y:y});
                }
                else//vertex is rejected (will result in an empty space)
                {
                    if(coinFlipIsAllHeads(4)) //flip some coins to add or reject a ball
                    {
                        ballVertices.push({x:x,y:y});
                    }
                }
            }
        }
        if (ballVertices.length > 0)
        {
            break;
        }
    }

    return {blocks:blockVertices, balls:ballVertices};
}
/*------------------------------------------------------------------------------------
  Flips a coin a consecutive number of times to determine if all flips result in heads
  @param Integer numOfFlips, the number of times to flip the coin
  @param Boolean , True if all consecutive flips result in heads, false otherwise
*-------------------------------------------------------------------------------------
*/
function coinFlipIsAllHeads(numOfFlips)
{
    let allheads = true;
    for (let i = 0; i < numOfFlips; i++)//do a consecutive number of coin flips(searching for all heads)
    {
        if (Math.random() <= 0.5)//flip results in tails
        {
            allheads = false;
            break;
        }
    }
    return allheads;
}
/*-----------------------------------------------------------
  Gets the width and height of the browser window
  @return Object , the height and width of the browser window
*------------------------------------------------------------
*/
function getBrowserWindowSize()
{
    let win = window,
    doc = document,
    offset = 20,
    docElem = doc.documentElement,
    body = doc.getElementsByTagName('body')[0],
    browserWindowWidth = win.innerWidth || docElem.clientWidth || body.clientWidth,
    browserWindowHeight = win.innerHeight|| docElem.clientHeight|| body.clientHeight;
    return {width:browserWindowWidth-offset,height:browserWindowHeight-offset};
}
/*------------------------------------------------------------
  Draws a new grid upon the screen
  NB: this is called whenever the screen is resized or clicked
*-------------------------------------------------------------
*/
function setNewGrid()
{
    let browserWindowSize = getBrowserWindowSize();
    createCanvas(browserWindowSize.width,browserWindowSize.height);
    let vertices = getBlockVertices(blockLength,browserWindowSize);
    let blockVertices = vertices.blocks;//coordinates of the upper left corner of each block
    let ballVertices = vertices.balls;//coordinates of the center of all balls
    blocks = [];//get rid of all former blocks
    blockVertices.forEach(function(vertex)
    {
        blocks.push(new Block(vertex.x,vertex.y,blockLength)); //create new blocks
    });
    balls = [];//get rid of all former balls
    ballVertices.forEach(function(vertex)
    {
        balls.push(new Ball(vertex.x,vertex.y,blocks,browserWindowSize.width,browserWindowSize.height));//create new balls
    });
    balls.forEach(function(ball) //make every ball aware of all the other balls in the grid
    {
        ball.setBalls(balls);
    });
}
function setup()
{
    let browserWindowSize = getBrowserWindowSize();
    createCanvas(browserWindowSize.width,browserWindowSize.height);
    let vertices = getBlockVertices(blockLength,browserWindowSize);
    let blockVertices = vertices.blocks;//coordinates of the upper left corner of the block
    let ballVertices = vertices.balls;//coordinates of the center of all balls
    blockVertices.forEach(function(vertex)//create blocks
    {
        blocks.push(new Block(vertex.x,vertex.y,blockLength));
    });
    ballVertices.forEach(function(vertex)//create balls
    {
        balls.push(new Ball(vertex.x,vertex.y,blocks,browserWindowSize.width,browserWindowSize.height));
    });
    balls.forEach(function(ball) //make every ball aware of all the other balls in the grid
    {
        ball.setBalls(balls);
    });
    background(backgroundColor);
    document.addEventListener('click',(event)=>//when user clicks on the canvas,
    {
        setNewGrid();
    });
    window.addEventListener('resize',function()//when the screen is resized
    {
        let browserWindowSize = getBrowserWindowSize();
        resizeCanvas(browserWindowSize.width,browserWindowSize.height);
        setNewGrid();
        background(backgroundColor);
    });
}
function draw()
{
    background(backgroundColor);
    [...balls].forEach(function(ball)//update balls
    {
        ball.update();
    });
    [...blocks,...balls].forEach(function(x)//draw all blocks and balls
    {
        x.draw();
    });

}
