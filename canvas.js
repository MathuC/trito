var canvas = document.getElementById("trito");
var c = canvas.getContext('2d');

 
//game score
let score=0;

//When score is a hundred multiple the score is displayed in big accompanied with this image
var banner = new Image();
banner.src = "img/banner1.png";

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

//load audio fileSize
let hit = new Audio();
hit.src="audio/hit.wav";




//draws the player
function drawPlayer(){
	c.lineWidth=4;
	c.fillStyle="white"; // Without this line, the stuff can be seen through the player which is not very appealing to the eyes
	if (key == "KeyA") {
		c.fillRect(65,500,70,70);
		c.strokeRect(65,500,70,70);
	} else if (key == "KeyS") {
		c.fillRect(165,500,70,70);
		c.strokeRect(165,500,70,70);
	} else if (key == "KeyD") {
		c.fillRect(265,500,70,70);
		c.strokeRect(265,500,70,70);
	} else if (key == "KeyJ") {
		c.fillRect(83,500,35,70);
		c.fillRect(183,500,35,70);
		c.strokeRect(83,500,35,70);
		c.strokeRect(183,500,35,70);
	} else if (key == "KeyL") {
		c.fillRect(183,500,35,70);
		c.fillRect(283,500,35,70);
		c.strokeRect(183,500,35,70);
		c.strokeRect(283,500,35,70);
	} else if (key == "KeyK") {
		c.fillRect(83,500,35,70);
		c.fillRect(283,500,35,70);
		c.strokeRect(83,500,35,70);
		c.strokeRect(283,500,35,70);
	} else if (key == "Space") { //70/3 is ~23, not 18 but I did this so that the 1/3 square is visually different from the 1/2 square so that players see it easily
		c.fillRect(91,500,18,70);
		c.fillRect(191,500,18,70);
		c.fillRect(291,500,18,70);
		c.strokeRect(91,500,18,70);
		c.strokeRect(191,500,18,70);
		c.strokeRect(291,500,18,70);
	}
}

//draws filled rectangles/obstacles
function drawFilled(type, y){
	c.fillStyle="black";
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

//draws the score
function drawScore(){
	c.fillStyle="black";
	c.font = "15px Lucida Console";
	c.textAlign = "right";
	c.fillText("Score",400,15);
	c.fillText("",400,15);
	c.fillText(score,400,30);
}

//the function that defines the type of the filled rectangles (wave obstacles)
function rand() {
	if (score>=0 && score<=5 ){
		return Math.floor(Math.random() * 3); //only first
	} else if (score>5 && score<=15) {
		return (Math.floor(Math.random() * 3)+3);
	} else if (score>15 && score<30) {
		return Math.floor(Math.random() * 6);
	} else if (score==30) { //player needs to be introduced to this new wave at least once when the speed is still pretty low
		return 6;
	} else if (score>30){
		return Math.floor(Math.random() * 7);
	}
}


function drawHundred(y) { //when you reach mutliples of 100, you get a little break and your score is shown in the game in BIG instead of a wave
	c.fillStyle="black";
	c.font = "65px Lucida Console";
	c.textAlign = "center";
	const temp= score+1-(score+1)%100; //So the score doesn't change in the middle of the screen
	c.drawImage(banner,10,y-113,380,170);
	c.fillText(temp,200,y);
}	

//there will be sometimes two waves of rectangle at the same time on the screen so two sets of variables are necessary for some
let y1 = -72; //position of the first wave of filled rectangle
let y2 = -72; //position of the second wave of filled rectangle
let y3 = -90;
let filled1 = true; //boolean for the first wave of filled rectangles
let filled2 = false; //boolean for the second wave of filled rectangles
let dy=15; //speed of the waves
let ddy=8; //after a score of 50, the speed will increase, so this var is the acceleration of the waves till they reach a maximum speed
let sep=325; //separation between the two waves goes from 400 to 350
let type=1; //first wave is the easiest one (Answer: KeyS)
let type2; //since there will be two waves on the same screen type and type2 are distinct types
let count=true;//booleans for counting score
let hundred=false;//boolean for the function drawHundred(y) to be called

function gameOver(){
	clearInterval(trito);
	hit.play(); //hit audio
	setTimeout(function(){c.clearRect(0,0,400,600);},600); //erases previous frame after 0.6 seconds
	setTimeout(function(){ //displays Game Over and score after 0.6s
		c.fillStyle="black";
		c.font = "25px Lucida Console";
		c.textAlign = "center";
		c.fillText("Game Over",200,300);
		c.font = "15px Lucida Console";
		c.fillText("Score: "+score,200,315);},600
	)
}

//each frame is being drawn here
function draw(){
	c.clearRect(0,0,400,600); //erases previous frame
	drawScore(); //draws score
	if (filled1 == true) {
		drawFilled(type,y1);
		y1=y1+dy/5;
	}
	if (filled2 == true) {
		drawFilled(type2,y2);
		y2=y2+dy/5;
	}
	if (hundred==true) {
		drawHundred(y3);
		y3=y3+dy/5;
	}
	if (y3>700) {
		hundred=false;
		y3=-72
	}
	if (y1>=sep && y2>y1) {
		y2=-72;
		type2= rand();
	} else if (y1>=sep && filled2 == false) {
		y2=-72;
		filled2=true;
		type2= rand();
	} 
	if (y2>=sep && y1>y2 && score%100!=99) {
		y1=-72;
		type= rand();
	} else if (score%100==99) {
		hundred= true;
	}
	if (y1>570 && count==true) {
		score = score+1;
		count= false;
	}
	if (y2>570 && count==false) {
		score = score+1;
		count= true;
	}
	//speed starts to go up from score=40 to around score=800. 
	if(score>30 && score<=1000){ //speeding up the waves after the player reach a score of 50, till the speed of the waves dy reaches a maximum
		dy=15+Math.floor(0.8*(Math.sqrt(score-30))); //using a squrt function made a lot of sense since you want the speed to increase 
		//quickly at the beginning so it's not boring but you want it to stop increasing so quickly towards the end since the difficulty increase between 15 and 20 is a lot lower than the difficulty increase between 30 and 35
	} else if (score>1000){ //for debuggin purpose 
		dy=39;
	}
	drawPlayer(); //draws player on top of everyting else
	console.log("Speed:"+dy); //debugging

	//GameOver
	if (y1>430 && y1<570){ 
		if ((type==0 && key!="KeyA") || (type==1 && key!="KeyS") || (type==2 && key!="KeyD") || (type==3 && key!="KeyJ") || (type==4 && key!="KeyL") || (type==5 && key!="KeyK") || (type==6 && key!="Space")) {
			gameOver(); //stops animation
		}
	}
	if (y2>432 && y2<570) {
		if ((type2==0 && key!="KeyA") || (type2==1 && key!="KeyS") || (type2==2 && key!="KeyD") || (type2==3 && key!="KeyJ") || (type2==4 && key!="KeyL") || (type2==5 && key!="KeyK") || (type2==6 && key!="Space")) {
			gameOver(); //stops animation
		}
	}
}

//game has an image drawn every 100 milliseconds
let key="KeyS"; //player's square starts in the middle by default
let k=2;
alert(k);
let trito = setInterval(draw,10);
k=3;
alert(k);


