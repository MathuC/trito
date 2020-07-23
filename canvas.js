var canvas = document.getElementById("trito");

var c = canvas.getContext('2d');


//When score is a fifty multiple the score is displayed in big accompanied with this image
var banner = new Image();
banner.src = "img/banner.png";
var instructions = new Image();


//load audio fileSize
let hit = new Audio();
hit.src="audio/hit.wav";
let go = new Audio();
go.src="audio/gameOver.wav"; //my browser doesn't loop well so I had to cut off a bit of the loop at the end on flstudio
let track = new Audio(); 
track.src= "audio/corona.wav"; //background music for during the game
track.volume=0.15; //it was too loud and drowned the point audio, so 15% of the original volume works
let point= new Audio();
point.src= "audio/point.wav";
let clap= new Audio();
clap.src="audio/clap.wav";

let trial; //interval for the beginning to let players try out the keyboard controls 
let trialBool=true; //if the trial keyboard control is going to happen, happening, or just happened, this is true
let trito; //global variable that will store the interval (game loop)
let player; //global variable which stores the position of the player 
let a=false; //these are the keys and they are false since they are up.
let d=false;
let s=false;
let w=false;
let score=0;//game score
let hiScore=0; //highscore
let game= false;//if the game has started, need this since if not, everytime the trisected square command would be received, it would restart the whole game :/
let y1 = -72; //position of the first wave of filled rectangle, there will be sometimes two waves of rectangle at the same time on the screen so two sets of variables are necessary for some
let y2 = -72; //position of the second wave of filled rectangle
let y3 = -125; //since it's height is slightly bigger than the waves is starts a little higher
let filled1 = true; //boolean for the first wave of filled rectangles
let filled2 = false; //boolean for the second wave of filled rectangles
let dy=17; //speed of the waves
let sep=350; //separation between the two waves
let type=1; //first wave is the easiest one (Answer: KeyS)
let type2; //since there will be two waves on the same screen type and type2 are distinct types
let count=true;//booleans for counting score
let fifty=false;//boolean for the function drawFfity(y) to be called
let flashing= false; //if flashing text at the end is flashing
let alias; //name of the player




//BEGINNING OF EVERYTHING, then addEventListener starts the whole game
instructions.onload= function(){ //if I don't do this and use function startscreen(); alone instead, then the canvas loads before the image (instructions.png) loads and the image is not here. Write "startScreen();" instead of this big block and see for yourself
	startScreen();
} 
instructions.src = "img/instructions.png"; // It has to be in this order for the image to load and work: 1. var img = new Image() 2. img.onload = function(){ something you want to do} 3.img.src=img/img.png




trial = setInterval(function(){
	c.clearRect(0,490,400,110);
	position();
	drawPlayer();
},10);





//The start screen
function startScreen(){
	c.fillStyle="black";
	c.font = "bold 25px Lucida Console"; 
	fontMac("bold 25px");
	c.textAlign = "center";
	c.fillText("Press  Space  to start",200,50);
	c.font = "10px Lucida Console";
	fontMac("10px");
	c.fillText("Read the instructions below if it's your first time.",200,80);
	c.lineWidth=3;
	c.strokeRect(118,30,120,26);
	c.lineWidth=3;
	c.font = "bold 13px Lucida Console";
	fontMac("bold 13px");
	c.textAlign = "left";
	c.fillText("INSTRUCTIONS",0,190);
	c.font = "13px Lucida Console";
	fontMac("13px");
	c.textAlign = "center";
	c.fillText("Goal: Dodge the rectangles coming your way",200,210);
	c.fillText("Controls:                                         ",200,230);
	c.drawImage(instructions,97,240,200,140); 
	c.fillText("Try the controls on this page by using the 4 keys",200,400);
	c.fillText("Hint: Combine different keys (A,S,D,F) together",200,420);
}


function reset(){ //If the player wants to play the game again
	a=false; 
	d=false;
	s=false;
	w=false;
	score=0;
	y1 = -72; 
	y2 = -72; 
	y3 = -125; 
	filled1 = true; 
	filled2 = false; 
	sep=350; 
	type=1; 
	type2; 
	count=true;
	fifty=false;
	if (flashing==true){
		clearInterval(loop);
	}
}



//When a key is pressed down
document.addEventListener("keydown", down); //the event is sent (returned) to the function down
function down(event){ //function down receives the event sent by addEventListener as an argument
	if (event.code=="KeyA"){
		a=true;
	} else if (event.code=="KeyD") {
		d=true;
	} else if (event.code=="KeyS") {
		s=true;
	} else if (event.code=="KeyW") {
		w=true;
	}
	if (event.code=="Space" && game==false) {
		reset(); //If the player is playing multiple games
		go.pause();
		game = true;
		if (trialBool==true){
			clearInterval(trial);
			trialBool=false;
		}
		gameStart(); 
	}
}

//When a key is let go
document.addEventListener("keyup", up);
function up(event){
	if (event.code=="KeyA"){
		a=false;
	} else if (event.code=="KeyD") {
		d=false;
	} else if (event.code=="KeyS") {
		s=false;
	} else if (event.code=="KeyW") {
		w=false;
	}
}

//to prevent the page from scrolling down when space is hit, which is somethign most/all browsers do
window.addEventListener('keydown', space); 
function space(event) {
  if(event.code == "Space") {
    event.preventDefault();
  }
}

//Apparently macs and pcs dont have the same font compatibilities smh, so this function changes the font to a more pretty font than Times New Roman for macs
function fontMac(size){ 
	if (navigator.platform!="Win32"){
		c.font = size+" Courier";
	}
}


//This is the nearly the whole game and it has an image drawn every 10 milliseconds
function gameStart(){
	a=false; 
	d=false;
	s=false;
	w=false; //player's square starts in the middle by default
	track.play()
	track.loop=true;
	trito = setInterval(draw,10); 
}

//I started this game with 7 controls ASD for the square position and JKL for the half-square position and space for the trisected squares
//After a friend told me that keyup is a thing in JS, something I overlooked I decided to go back to my original plan when starting this game and to only use 4 controls A,S,D,W like the typical games which will make the learning curve more shallow
function position(){
	if (a==false && d==false && s==false && w==true){
		player="m3";
	} else if (a==true && d==false  && s==false && w==true){
		player="l3";
	} else if (a==false && d==true && s==false && w==true){
		player="r3";
	} else if (a==true && d==false && s==true && w==false){
		player="l2";
	} else if (a==false && d==true && s==true && w==false){
		player="r2";
	} else if (a==false && d==false && s==true && w==false){ 
		player="m2";
	} else if (a==true && d==false && s==false && w==false){
		player="l";
	} else if (a==false && d==true && s==false && w==false){
		player="r";
	} else if (a==false && d==false && s==false && w==false){
		player="m";
	} //if both a and d are pressed down at the same time, then the past position is kept
}

//draws the player
function drawPlayer(){
	c.lineWidth=4;
	c.fillStyle="white"; // Without this line, the stuff can be seen through the player which is not very appealing to the eyes
	if (player == "l") {
		c.fillRect(65,500,70,70);
		c.strokeRect(65,500,70,70);
	} else if (player == "m") {
		c.fillRect(165,500,70,70);
		c.strokeRect(165,500,70,70);
	} else if (player == "r") {
		c.fillRect(265,500,70,70);
		c.strokeRect(265,500,70,70);
	} else if (player == "l2") {
		c.fillRect(83,500,35,70);
		c.fillRect(183,500,35,70);
		c.strokeRect(83,500,35,70);
		c.strokeRect(183,500,35,70);
	} else if (player == "r2") {
		c.fillRect(183,500,35,70);
		c.fillRect(283,500,35,70);
		c.strokeRect(183,500,35,70);
		c.strokeRect(283,500,35,70);
	} else if (player == "m2") {
		c.fillRect(83,500,35,70);
		c.fillRect(283,500,35,70);
		c.strokeRect(83,500,35,70);
		c.strokeRect(283,500,35,70);
	} else if (player == "m3") { //70/3 is ~23, not 18 but I did this so that the 1/3 square is visually different from the 1/2 square so that players see it easily
		c.fillRect(91,500,18,70);
		c.fillRect(191,500,18,70);
		c.fillRect(291,500,18,70);
		c.strokeRect(91,500,18,70);
		c.strokeRect(191,500,18,70);
		c.strokeRect(291,500,18,70);
	} else if (player == "l3"){
		c.fillRect(91,500,18,70);
		c.fillRect(177,500,46,70);
		c.strokeRect(91,500,18,70);
		c.strokeRect(177,500,46,70);
	} else if (player == "r3") {
		c.fillRect(291,500,18,70);
		c.fillRect(177,500,46,70);
		c.strokeRect(291,500,18,70);
		c.strokeRect(177,500,46,70);
	}
}



//draws filled rectangles/obstacles
function drawFilled(type, y){
	c.fillStyle="black";
	if (type == 0){ //for A
		c.fillRect(165,y,70,70);
		c.fillRect(265,y,70,70);
	} else if (type == 1) { //for nothing
		c.fillRect(65,y,70,70);
		c.fillRect(265,y,70,70);
	} else if (type == 2) { //for D
		c.fillRect(65,y,70,70);
		c.fillRect(165,y,70,70);
	} else if (type == 3) { //for S&A
		c.fillRect(265,y,70,70);
		c.fillRect(65,y,18,70);
		c.fillRect(118,y,18,70);
		c.fillRect(165,y,18,70);
		c.fillRect(218,y,18,70);
	} else if (type == 4) { //for S&D
		c.fillRect(65,y,70,70);
		c.fillRect(165,y,18,70);
		c.fillRect(218,y,18,70);
		c.fillRect(265,y,18,70);
		c.fillRect(318,y,18,70);
	} else if (type == 5) { //for S
		c.fillRect(165,y,70,70);
		c.fillRect(65,y,18,70);
		c.fillRect(118,y,18,70);
		c.fillRect(265,y,18,70);
		c.fillRect(318,y,18,70);
	} else if (type == 6) { //for W
		c.fillRect(65,y,26,70);
		c.fillRect(109,y,26,70);
		c.fillRect(165,y,26,70);
		c.fillRect(209,y,26,70);
		c.fillRect(265,y,26,70);
		c.fillRect(309,y,26,70);
	} else if (type == 7) { //for W&A
		c.fillRect(265,y,70,70);
		c.fillRect(65,y,26,70);
		c.fillRect(109,y,26,70);
		c.fillRect(165,y,12,70);
		c.fillRect(223,y,12,70);
		
	} else if (type == 8) { //for W&D
		c.fillRect(65,y,70,70);
		c.fillRect(265,y,26,70);
		c.fillRect(309,y,26,70);
		c.fillRect(165,y,12,70);
		c.fillRect(223,y,12,70);
	}
}

//draws the score
function drawScore(){
	c.fillStyle="black";
	c.font = "bold 15px Lucida Console";
	fontMac("bold 15px");
	c.textAlign = "left";
	c.fillText("Score",0,15);
	c.font = "15px Lucida Console";
	fontMac("15px");
	c.fillText(score,0,30);
	c.font = "bold 15px Lucida Console";
	fontMac("bold 15px");
	c.textAlign = "right";
	c.fillText("Best",400,15);
	c.font = "15px Lucida Console";
	fontMac("15px");
	c.fillText(hiScore,400,30);
}

//the function that defines the type of the filled rectangles (wave obstacles)
function rand() {
	if (score>=0 && score<=5 ){
		return Math.floor(Math.random() * 3); //only first types
	} else if (score>5 && score<=15) {
		return (Math.floor(Math.random() * 3)+3); //other 3 types
	} else if (score>15 && score<=30) {
		return Math.floor(Math.random() * 6); //all first 6 types
	} else if (score>30 && score<=40){
		return Math.floor(Math.random() * 7);
	} else if (score>40){
		return Math.floor(Math.random() * 9);
	}
}

//when you reach mutliples of 50, you get a little break and your score is shown in the game in BIG instead of a wave
function drawFifty(y) { 
	c.fillStyle="black";
	c.font = "65px Lucida Console";
	c.textAlign = "center";
	const temp= score+1-(score+1)%50; //So the score doesn't change in the middle of the screen
	c.drawImage(banner,10,y-113,380,170);
	c.fillText(temp,200,y);
}	

//each frame of the game is drawn
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
	if (fifty==true) {
		drawFifty(y3);
		y3=y3+dy/5;
	}
	if (y3>700) {
		fifty=false;
		y3=-125; //since it's height is slightly bigger than the waves is starts a little higher
	}
	if (y1>=sep && y2>y1) {
		y2=-72;
		type2= rand();
	} else if (y1>=sep && filled2 == false) {
		y2=-72;
		filled2=true;
		type2= rand();
	} 
	if (y2>=sep && y1>y2 && score%50!=49) {
		y1=-72;
		type= rand();
	} else if (score%50==49) {
		fifty= true;
	}
	if (y1>570 && count==true) {
		point.play();
		score = score+1;
		count= false;
	}
	if (y2>570 && count==false) {
		point.play();
		score = score+1;
		count= true;
		if (score%50==0){
			clap.play();
		}
	}
	if (hiScore<score){
		hiScore=hiScore+1;
	}
	//speed starts to go up from score=30 
	if(score>50){ //speeding up the waves after the player reach a score of 50
		dy=17+Math.floor(0.4*(Math.sqrt(score-50))); //using a squrt function made a lot of sense since you want the speed to increase 
		//quickly at the beginning so it's not boring but you want it to stop increasing so quickly towards the end since the difficulty increase between 15 and 20 is a lot lower than the difficulty increase between 30 and 35
	} 
	position(); //according to what keys are down/up this says which position the player has to be and this current funtion draws the player accordingly to the position
	drawPlayer(); //draws player on top of everyting else
	console.log("Speed:"+dy); //debugging

	//GameOver
	if (y1>432 && y1<570){ 
		if ((type==0 && player!="l") || (type==1 && player!="m") || (type==2 && player!="r") || (type==3 && player!="l2") || (type==4 && player!="r2") || (type==5 && player!="m2") || (type==6 && player!="m3") || (type==7 && player!="l3") || (type==8 && player!="r3")) {
			gameOver(); //stops animation
		}
	}
	if (y2>432 && y2<570) {
		if ((type2==0 && player!="l") || (type2==1 && player!="m") || (type2==2 && player!="r") || (type2==3 && player!="l2") || (type2==4 && player!="r2") || (type2==5 && player!="m2") || (type2==6 && player!="m3") || (type2==7 && player!="l3") || (type2==8 && player!="r3")) {
			gameOver(); //stops animation
		}
	}
}

function gameOver(){
	clearInterval(trito);
	track.pause(); //stopped the game soundtrack
	hit.play(); //hit sound
	setTimeout(function(){c.clearRect(0,0,400,600);},600); //erases previous frame after 0.6 seconds
	setTimeout(function(){ //displays Game Over and score after 0.6s
		c.fillStyle="black";
		c.font = "25px Lucida Console";
		fontMac("25px");
		c.textAlign = "center";
		c.fillText("Game Over",200,300);
		c.font = "15px Lucida Console";
		fontMac("15px");
		c.fillText("Score: "+score,200,315);
		c.font = "12px Lucida Console";
		fontMac("12px");
		c.fillText("Best: "+hiScore,200,330);}
		,600);
	setTimeout(function(){ //gameOver soundtrack
		go.play(); //to stop it, you have to go.pause(); and sounds/audio work only on myu browser if a key was pressed or if a mouse click happened on the page after it loaded
		go.loop=true;}
		,600);
	setTimeout(function(){
		if(alias == null){
			alias = prompt("Enter your name/alias for the leaderboard (one word)");
			if (alias==""){
				alias=null;
			}
		}
		highScore();}
		,1800); 
}

function highScore(){ //to display the highscores at the very end
	c.clearRect(0,0,400,600);
	c.fillStyle="black";
	c.font = "bold 25px Lucida Console";
	fontMac("bold 25px");
	c.textAlign = "center";
	c.fillText("High Scores",200,30);
	flashingText();
	game=false;
}

//flashing text at the bottom of the screen of highscores saying you can press any keys to go back to the start menu
function flashingText(){
	flashing=true; //if this is true, we can use clearInterval on the loop when the game starts once again
	let count=1; //
	loop= setInterval( function(){
		if (count%4!=0){ //this makes the flashing text/nothing time to 3/1, so there is text 3/4 of the time and nothing 1/4 of the time
			c.clearRect(0,570,400,25); // need here as well. not only in else{} since without this, it becomes bolder and bolder and looks weird
			c.fillStyle="black";
			c.textAlign = "center";
			c.font = "bold 13px Lucida Console";
			fontMac("bold 13px");
			c.fillText("Press Space to play again",200,585);
		} else {
			c.clearRect(0,570,400,25); //used the console and strokeRect() to find out these coordinates
		}
		count=count+1;
	},250);	
}	

/*
Conclusion: 

I learned doing this that javascript is a very special language. It is not like other languages where everything goes from top to bottom.
You can do asynchronous programming here which makes it weirder than other languages.
Also, you can do
-var=function()
which is very weird.
I still don't understand this lanugage inside and out, but this project helped me learn 
a lot about this very peculiar and useful language.
I also learned a lot about canvas and a bit about animation as well.

Big error1: 
I put 
-let trito;
inside the function gameStart.

Big error2:
I put 
-let key;
inside the function gameStart.

Big error3:
I did not make a boolean "game" which checks if game has started (spacebar has been pushed or not) or not to eliminate the 
possibility of one key to be used for two things (trisected square & gamestart) in the 
eventlistener direction.

Big error4: JS doesn't doesn't make an array of references when you define an array of variables it 
makes an array of the values of those variables. So if you change something in a position of the array
like array[0]=100, it won't change the variable that you assigned at position-0 to 100, it will just change
the array

*/

