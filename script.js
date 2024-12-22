//Define game board
const board = document.getElementById('game-board');
const gridSize = 20;
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const title = document.getElementById('title');
const scoreText = document.getElementById('score');
const highScoreText = document.getElementById('highScore');


//Define game variables
let snake = [{x:10,y:10}];
let food = generateFoodPosition();
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let highScore = 0;

//Define game functions
//Draw game map, snake and food
function draw(){
    board.innerHTML ='';
    drawSnake();
    drawFood();
    updateScore();
}

//Draw snake
function drawSnake(){
    snake.forEach(segment=>{
        const snakeElement = createGameElement('div','snake');
        setPosition(snakeElement,segment);
        board.appendChild(snakeElement);
    });
}

//create game elements
function createGameElement(tag, className){
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

//set element postions
function setPosition(element,position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

//draw food
function drawFood(){
    if (gameStarted){
        const foodElement = createGameElement('div','food');
        setPosition(foodElement,food);
        board.appendChild(foodElement);
    }
}

//generate random food position
function generateFoodPosition(){
    const x = Math.floor(Math.random()*gridSize)+1;
    const y = Math.floor(Math.random()*gridSize)+1;
    return {x,y};
}

function move(){
    const head = {...snake[0]};
    switch(direction){
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    snake.unshift(head);
    if(head.x ===  food.x && head.y === food.y){
        food = generateFoodPosition();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(()=>{
            move();
            checkCollision();
            draw();
        },gameSpeedDelay)
    } else {
        snake.pop();
    }
}

//Start gamefunction

function startGame(){
    gameStarted = true;
    instructionText.style.display ='none';
    logo.style.display ='none';
    title.style.display ='none';
    gameInterval = setInterval(()=>{
        move();
        checkCollision();
        draw();
    },gameSpeedDelay);
}

function increaseSpeed(){
    //console.log(gameSpeedDelay);
    if(gameSpeedDelay >150){
        gameSpeedDelay-=5;
    } else if(gameSpeedDelay >100){
        gameSpeedDelay-=3;
    } else if(gameSpeedDelay >50){
        gameSpeedDelay-=2;
    } else if(gameSpeedDelay >25){
        gameSpeedDelay-=1;
    }
}

function handleKeyPress(event){
    if(!gameStarted && (event.code === 'Space' || event.code === ' ')){
        startGame();
    }
    else{
        switch (event.key.toLowerCase()) { // Convert to lowercase to handle both cases
            case 'arrowup':
            case 'w':
                direction = 'up';
                break;
            case 'arrowdown':
            case 's':
                direction = 'down';
                break;
            case 'arrowleft':
            case 'a':
                direction = 'left';
                break;
            case 'arrowright':
            case 'd':
                direction = 'right';
                break;
        }
    }
}

function checkCollision(){
    const head = snake[0];
    if(head.x < 1 || head.y < 1 || head.x > gridSize || head.y > gridSize){
        resetGame();
    }   
    for(let i = 1; i<snake.length;i++){
        if(head.x === snake[i].x && head.y ===snake[i].y){
            resetGame();
        }
    }
}

function resetGame(){
    updateHighScore();
    stopGame();
    snake = [{x:10,y:10}];
    food = generateFoodPosition();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore(){
    const currentScore = snake.length -1;
    scoreText.textContent = currentScore.toString().padStart(3,'0');
}

function stopGame(){
    clearInterval(gameInterval);
    gameInterval = null;
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
    title.style.display = 'block';
}
function updateHighScore(){
    const currentScore = snake.length -1;
    if(currentScore > highScore){
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3,'0');
    }
    highScoreText.style.display ='block';
}


document.addEventListener('keydown',handleKeyPress); //start games from here, waits for key press