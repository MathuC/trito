var canvas = document.getElementById("trito");
var c = canvas.getContext('2d');

 
//game score
let score=0;

//When score is a hundred multiple the score is displayed in big accompanied with this image
var banner = new Image();
banner.src = "img/banner1.png";

let game= false;//if the game has started 

let load=false;//when the game is done this will be set to true so that the player can refresh the page and be able to replay more easily

//which key the player presses. Everytime a key is pressed, the "key" var is updated with that value e.g: KeyS
document.addEventListener("keydown", direction);
function direction(event){
	if (event.code== "KeyA" || event.code== "KeyS" || event.code== "KeyD" || event.code== "KeyJ" || event.code== "KeyK" || event.code== "KeyL" || event.code=="Space"){
		key = event.code;
		if (event.code=="Space" && game==false) {
			game = true;
			gameStart();
		} else if (event.code=="Space" && load==true){
			location.reload(); //go back to start menu
		}
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
let go = new Audio();
go.src="audio/gameOver.wav"; //my browser doesn't loop well so I had to cut off a bit of the loop at the end on flstudio
let track = new Audio();
track.src= "audio/where.wav";


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
let y3 = -125; //since it's height is slightly bigger than the waves is starts a little higher
let filled1 = true; //boolean for the first wave of filled rectangles
let filled2 = false; //boolean for the second wave of filled rectangles
let dy=18; //speed of the waves
let ddy=8; //after a score of 50, the speed will increase, so this var is the acceleration of the waves till they reach a maximum speed
let sep=350; //separation between the two waves
let type=1; //first wave is the easiest one (Answer: KeyS)
let type2; //since there will be two waves on the same screen type and type2 are distinct types
let count=true;//booleans for counting score
let hundred=false;//boolean for the function drawHundred(y) to be called

function gameOver(){
	clearInterval(trito);
	track.pause(); //stopped the game soundtrack
	hit.play(); //hit sound
	setTimeout(function(){c.clearRect(0,0,400,600);},600); //erases previous frame after 0.6 seconds
	setTimeout(function(){ //displays Game Over and score after 0.6s
		c.fillStyle="black";
		c.font = "25px Lucida Console";
		c.textAlign = "center";
		c.fillText("Game Over",200,300);
		c.font = "15px Lucida Console";
		c.fillText("Score: "+score,200,315);}
		,600);
	setTimeout(function(){ //gameOver soundtrack
		go.play(); //to stop it, you have to go.pause(); and sounds/audio work only on myu browser if a key was pressed or if a mouse click happened on the page after it loaded
		go.loop=true;}
		,800);
	
	setTimeout(function(){highScore();},5000); //Instead of this I should do an alert to ask the player a second later if they want to register their score. 
}//If they accept, I take their username and then show them the highscore board
//If they refuse, I just switch to the highscore board
//On the highscore board there will be a saying: Press space if you want to go back to the start menu.
										

function highScore(){ //to display the highscores at the very end
	load=true;
	c.clearRect(0,0,400,600);
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
		dy=18+Math.floor(0.4*(Math.sqrt(score-30))); //using a squrt function made a lot of sense since you want the speed to increase 
		//quickly at the beginning so it's not boring but you want it to stop increasing so quickly towards the end since the difficulty increase between 15 and 20 is a lot lower than the difficulty increase between 30 and 35
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

//The start screen
function startScreen(){
	c.fillStyle="black";
	c.font = "25px Lucida Console";
	c.textAlign = "center";
	c.fillText("Press  Space  to start",200,300);
	c.font = "10px Lucida Console";
	c.fillText("Read the instructions below if it's your first time.",200,330);
	c.lineWidth=3;
	c.strokeRect(118,280,120,26);
}

function gameStart(){
	key="KeyS"; //player's square starts in the middle by default
	//This is the game and it has an image drawn every 10 milliseconds
	track.play()
	track.loop=true;
	trito = setInterval(draw,10);
}

let key;
let trito;

startScreen();

/*
Big error1: 
I put 
let trito;
inside the function gameStart.

Big error2:
I put 
let key;
inside the function gameStart.

Big error3:
I did not make a boolean "game" which checks if game has started (spacebar has been pushed or not) or not to eliminate the 
possibility of one key to be used for two things (trisected square & gamestart) in the 
eventlistener direction.

*/

