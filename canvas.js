var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
c.lineWidth=4;

//key that player presses
let key="KeyS"; 

//game score
let score=0;

//which key the player presses. Everytime a key is pressed, the "key" var is updated with that value e.g: KeyS
document.addEventListener("keydown", direction);
function direction(event){
	if (event.code== "KeyA" || event.code== "KeyS" || event.code== "KeyD" || event.code== "KeyJ" || event.code== "KeyK" || event.code== "KeyL" || event.code=="Space"){
		key = event.code;
	}
}

//to prevent the page from scrolling down when space is hit, which is somethign most/all browsers do
window.addEventListener('keydown', space); 
function space(event) {
  if(event.code == "Space") {
    event.preventDefault();
  }
}

//draws the player
function drawPlayer(){
	if (key == "KeyA") {
		c.strokeRect(65,500,70,70);
	} else if (key == "KeyS") {
		c.strokeRect(165,500,70,70);
	} else if (key == "KeyD") {
		c.strokeRect(265,500,70,70);
	} else if (key == "KeyJ") {
		c.strokeRect(83,500,35,70);
		c.strokeRect(183,500,35,70);
	} else if (key == "KeyL") {
		c.strokeRect(183,500,35,70);
		c.strokeRect(283,500,35,70);
	} else if (key == "KeyK") {
		c.strokeRect(83,500,35,70);
		c.strokeRect(283,500,35,70);
	} else if (key == "Space") { //70/3 is ~23, not 18 but I did this so that the 1/3 square is visually different from the 1/2 square so that players see it easily
		c.strokeRect(91,500,18,70);
		c.strokeRect(191,500,18,70);
		c.strokeRect(291,500,18,70);
	}
}

//draws the score
function drawScore(){
	c.font = "15px Lucida Console";
	c.textAlign = "right";
	c.fillText("Score",400,15);
	c.fillText("",400,15);
	c.fillText(score,400,30);
}



//draws filled rectangles/obstacles
function drawFilled(type, y){
	if (type == 0){ //for A
		c.fillRect(165,y,70,70);
		c.fillRect(265,y,70,70);
	} else if (type == 1) { //for S
		c.fillRect(65,y,70,70);
		c.fillRect(265,y,70,70);
	} else if (type == 2) { //for D
		c.fillRect(65,y,70,70);
		c.fillRect(165,y,70,70);
	} else if (type == 3) { //for J
		c.fillRect(265,y,70,70);
		c.fillRect(65,y,18,70);
		c.fillRect(118,y,18,70);
		c.fillRect(165,y,18,70);
		c.fillRect(218,y,18,70);
	} else if (type == 4) { //for L
		c.fillRect(65,y,70,70);
		c.fillRect(165,y,18,70);
		c.fillRect(218,y,18,70);
		c.fillRect(265,y,18,70);
		c.fillRect(318,y,18,70);
	} else if (type == 5) { //for K 
		c.fillRect(165,y,70,70);
		c.fillRect(65,y,18,70);
		c.fillRect(118,y,18,70);
		c.fillRect(265,y,18,70);
		c.fillRect(318,y,18,70);
	} else if (type == 6) { //for Space
		c.fillRect(65,y,26,70);
		c.fillRect(109,y,26,70);
		c.fillRect(165,y,26,70);
		c.fillRect(209,y,26,70);
		c.fillRect(265,y,26,70);
		c.fillRect(309,y,26,70);
	}
}


//the function that defines the filled rectangles (obstacles)
function rand() {
	if (score>=0 && score<=10 ){
		return Math.floor(Math.random() * 3);
	} else if (score>10 && score<=20) {
		return (Math.floor(Math.random() * 3)+3);
	} else if (score>20 && score<40) {
		return Math.floor(Math.random() * 6);
	} else if (score==40) {
		return 6;
	} else if (score>40){
		return Math.floor(Math.random() * 7);
	}
}

//same rand function again to increase the randomness
function rand2() {
	if (score>=0 && score<=10 ){
		return Math.floor(Math.random() * 3);
	} else if (score>10 && score<=20) {
		return (Math.floor(Math.random() * 3)+3);
	} else if (score>20 && score<40) {
		return Math.floor(Math.random() * 6);
	} else if (score==40) {
		return 6;
	} else if (score>40){
		return Math.floor(Math.random() * 7);
	}
}			      

//there will be sometimes two waves of rectangle at the same time on the screen so two sets of variables are necessary for some
let y1 = -72; //position of the first wave of filled rectangle
let y2 = -72; //position of the second wave of filled rectangle
let filled1 = true; //boolean for the first wave of filled rectangles
let filled2 = false; //boolean for the second wave of filled rectangles
let dy=15; //speed of the waves
let ddy=8; //after a score of 50, the speed will increase, so this var is the acceleration of the waves till they reach a maximum speed
let sep=325; //separation between the two waves goes from 400 to 350
let type=1; //first wave is the easiest one (Answer: KeyS)
let count=true;//booleans for counting score

//each frame is being drawn here
function draw(){
	c.clearRect(0,0,400,600); //erases previous frame
	drawPlayer();
	drawScore();
	if (filled1 == true) {
		drawFilled(type,y1);
		y1=y1+dy/5;
	}
	if (filled2 == true) {
		drawFilled(type2,y2);
		y2=y2+dy/5;
	}
	if (y1>=sep && y2>y1) {
		y2=-72;
		type2= rand2();
	} else if (y1>=sep && filled2 == false) {
		y2=-72;
		filled2=true;
		type2= rand2();
	}
	if (y2>=sep && y1>y2) {
		y1=-72;
		type= rand();
	} 
	if (y1>570 && count==true) {
		score = score+1;
		count= false;
	}
	if (y2>570 && count==false) {
		score = score+1;
		count= true;
	}
	if(score>40 && dy<30){ //speeding up the waves after the player reach a score of 50, till the speed of the waves dy reaches a maximum
		dy=15+(score-40-(score-40)%ddy)/ddy; //mod so that the increase in speed happens incrementally
	}
	console.log(dy); //debug
}

//game has an image drawn every 100 milliseconds
let game = setInterval(draw,10);
