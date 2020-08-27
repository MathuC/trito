var canvas = document.getElementById("trito");

var c = canvas.getContext('2d');

//THE ANTIHACK PARTS OF THIS Game
/*
id, pcRand, gmoRand, base
udi() //initially create id and record
ud() //update scores, velocity and highscore every 50 points and detects if there is hack and if there is updates hack to "1" which true
rst() //resets score and count(counts if php antihack scripts have been ran (pc, pc2, gmo/ not ud, udi or rst since if they don't run, this will automatically update hack to "1" anyways so messing with that through the source code is useless))
pc() //updates score in pointcheck field right before score is given
pc2() //checks after one frame is done after a point is given (and pc() is ran) if score has changed or not. If changed the hack is returned true. This is to stop players from adding score++ in random places inside the frame 
gmo() //check at random score if gameover is true
ud MySQL table with id, score, highscore, hack, count pointcheck fields
*/

//When score is a fifty multiple the score is displayed in big accompanied with this image
var banner = new Image();
banner.src = "img/banner.png";
var instructions = new Image();
var mobileInstructions = new Image();

//load audio fileSize
//unlike images where you need a ONLOAD method, for audio you dont need that since it loads it directly into the HTML not like canvas draw image where you need to define onload function THEN you can write img.source=***
let hit = new Audio();
hit.src="audio/hit.wav";
let go = new Audio();
go.volume=0.85;
go.src="audio/gameOver.wav"; //my browser doesn't loop well so I had to cut off a bit of the loop at the end on flstudio
let track = new Audio(); 
track.src= "audio/corona.wav"; //background music for during the game
track.volume=0.10; //it was too loud and drowned the point audio, so 15% of the original volume works
let point= new Audio();
point.src= "audio/point.wav";
let clap= new Audio();
clap.src="audio/clap.wav";


let touch=false; //so the startscreen only starts screen if player touches above the controls region
let mobile=false; //detects if mobile phone or not
let trial; //interval for the beginning to let players try out the keyboard controls 
let trialBool=true; //if the trial keyboard control is going to happen, happening, or just happened, this is true
let trito; //global variable that will store the interval (game loop)
let player; //global variable which stores the position of the player 
let a=false; //these are the keys and they are false since they are up.
let d=false;
let s=false;
let w=false;
let score=0; //game score
let hiScore=0; //highscore
let game= false;//if the game has started, need this since if not, everytime the trisected square command would be received, it would restart the whole game :/
let y1 = -72; //position of the first wave of filled rectangle, there will be sometimes two waves of rectangle at the same time on the screen so two sets of variables are necessary for some
let y2 = -72; //position of the second wave of filled rectangle
let y3 = -125; //since it's height is slightly bigger than the waves is starts a little higher
let filled1 = true; //boolean for the first wave of filled rectangles
let filled2 = false; //boolean for the second wave of filled rectangles
let startdy=17; //don't change this since it's in the server
let dy=startdy; //speed of the waves
let sep=350; //separation between the two waves
let type=1; //first wave is the easiest one (Answer: KeyS)
let type2; //since there will be two waves on the same screen type and type2 are distinct types
let count=true; //booleans for counting score
let fifty=false; //boolean for the function drawFfity(y) to be called
let flashing= false; //if flashing text at the end is flashing
let alias; //name of the player
let id; //id of the player in the update database for antihack
let pcRand; //at which score pc, pc2 and pc3 will be called
let gmoRand; //at which score gmo will be called
let gmoBool; //at which y, gmo will be called
let pcBool; //if you want pc3 to be called
let base; //variable that tracks the score for each wave of antihack php script to run. It goes 0,50,100,150...
let gameOverBool;
let winners=[]; //arrays with alias and scores of highscores
let scores=[]; 
let data; //object that stores the JSON file sent back by MySql (highscores)


//BEGINNING OF EVERYTHING, then addEventListener starts the whole game
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	mobile=true;
} else {
	mobile=false;
}
//fetch database information. We need this early and not right before drawing the leaderboard since if the player entered an alias,
//we need to check right after the player played if there is a duplicate alias and if that alias has a smaller score to see if we need to update/insert or do nothing
if (mobile==false){	
	instructions.onload= function(){ //if I don't do this and use function startscreen(); alone instead, then the canvas loads before the image (instructions.png) loads and the image is not here. Write "startScreen();" instead of this big block and see for yourself
		startScreen();
	};
	instructions.src = "img/instructions.png"; // It has to be in this order for the image to load and work: 1. var img = new Image() 2. img.onload = function(){ something you want to do} 3.img.src=img/img.png   
//It is like that since it is instructions.src that calls instructions.onload. Instructions is loading and will load only if the variable instructions is given a src. The function at the beginning defines what happens when instruction.png is finished loading. Obvious but it kinda confused me at the beginning
} else {
	instructions.onload= function(){ //if I don't do this and use function startscreen(); alone instead, then the canvas loads before the image (instructions.png) loads and the image is not here. Write "startScreen();" instead of this big block and see for yourself
		startScreen();
	};
	instructions.src = "img/mobileInstructions.png";
}

trial = setInterval(function(){
	c.clearRect(0,480,400,110);
	position();
	drawPlayer();
	if (mobile==true){
		drawMobile();
	}
},10);



//The start screen
function startScreen(){
	var y1=87;
	var y2=60;
	if (mobile==true) {
		y1=67;
		y2=0;
	}
	c.fillStyle="black";
	c.font = "bold 25px Lucida Console"; 
	fontMac("bold 25px");
	c.textAlign = "center";
	if (mobile==false) {
		c.fillText("Press  Space  to start",200,50+y1);
		c.lineWidth=3;
		c.strokeStyle="black";
		c.strokeRect(118,30+y1,120,26);		
	} else {
		c.fillText("Touch Here to start",200,50+y1);
	}
	c.font = "bold 13px Lucida Console";
	fontMac("bold 13px");
	c.textAlign = "left";
	c.fillText("INSTRUCTIONS",0,210+y2);
	c.font = "13px Lucida Console";
	fontMac("13px");
	c.textAlign = "center";
	c.fillText("Goal: Dodge the rectangles coming your way",200,230+y2);
	c.fillText("Controls:                                         ",200,250+y2);
	c.drawImage(instructions,97,240+y2,200,140); 
	if (mobile==false) {
		c.fillText("Try the controls on right now by using the 4 keys",200,385+y2);
		c.fillText("Hint: Try combinations of two/three keys ",200,405+y2);
	} else {
		c.fillText("Try the controls by touching the 4 regions or",200,385+y2);
		c.fillText("combine them by swiping through multiple regions",200,405+y2);
	}
}


function reset(){ //If the player wants to play the game again
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		mobile=true;
	} else {
		mobile=false;
	}
	gameOverBool=false;
	score=0;
	dy=startdy;
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
	base=0;
	pcRand=10+Math.floor(Math.random() * 10);
	gmoRand=30+Math.floor(Math.random() * 10); 
	gmoRand= gmoRand-(gmoRand%2); //so it's even and only gets y1's. Before I used 30+Math.floor(Math.random() * 10)-(30+Math.floor(Math.random() * 10))%2 which is dumb since rand() will generate new numbers both times so this will not be even all the time
	gmoBool=true;
	pcBool=false;
	if (flashing==true){
		clearInterval(loop);
	}
	winners=[]; //need to reset this since without this, there would be duplicate scores
	scores=[]; 
	updateScores();
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
		game=true; //is space is pressed during the game, do not trigger restart of game 
		if (trialBool==true){
			clearInterval(trial);
			trialBool=false;
			udi();
		} else {
			reset(); //If the player is playing multiple games
			go.pause();
			rst(); //start of the whole playable game
		}
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


window.addEventListener('keydown', space); 
function space(event) {
  if(event.code == "Space") {
    event.preventDefault();
  }
}



if (mobile==true) { //mobile controls //for mobiles touch controls and keyboards work
	//for one key at a time
	document.addEventListener("touchstart", touchDown); //the event is sent (returned) to the function down
	function touchDown(event){
		if (window.innerWidth<410) {
			clientX= (event.touches[0].clientX-canvas.offsetLeft-5)*(400/(window.innerWidth-10)); //First you get rid of the offset length and the border length which is included in the client touch length but not in the canvas length. Then You have this thing that has to be on 400 but is now on window.width-10(border x 2, since there is no offset (max-width of window=100%)) so to convert this length to the canvas size you do that times (400/(windows.width-10)). It finally works. This annoyed me alot because of the 97% of before and I didn't know how CSS displayed that, but now it's 100% and everything wors fine.
			clientY= (event.touches[0].clientY-canvas.offsetTop-5)*(400/(window.innerWidth-10));
		} else {
			clientX= event.touches[0].clientX-canvas.offsetLeft-5;
			clientY= event.touches[0].clientY-canvas.offsetTop-5;
		}
		if (clientX<=150 && clientY>485) {
			a=true;
		} else if (clientX>150 && clientX<=250 && clientY>485) {
			s=true;
		} else if (clientX>250 && clientY>=485){
			d=true;
		} else if (clientY>385 && clientY<485){
			w=true;
		} else if (game==false) {
			touch=true;
		}
	}

	document.addEventListener("touchend", touchUp); //the event is sent (returned) to the function down
	function touchUp(event){
		a=false;
		s=false;
		d=false;
		w=false;
		if (game==false && touch==true) { //wanted to use swipe at first but a swipe is not considered as an interaction with the document so the music isn't started. This is kind of like at the beginning of this game dev, when the music didn't start when I didn't have astart screen and force to press space for people to start to force the document interaction
			//even touchmove and touchend together one after the other aren't considered interaction with the document, it has to be a touchstart (might not be registered) and a touchend together one after the other to be considered an interaction. Even a touchstart alone isn't considered an interaction.
			game=true; //is screen is pressed during the game, do not trigger restart of game 
			touch=false;
			if (trialBool==true){
				clearInterval(trial);
				trialBool=false;
				udi();
			} else {
				reset(); //If the player is playing multiple games
				go.pause();
				rst(); //start of the whole playable game
			}
		}
	}

	//for combinations of keys
	document.addEventListener("touchmove", touchMove); //the event is sent (returned) to the function down
	function touchMove(event){
		if (window.innerWidth<410) {
			clientX= (event.touches[0].clientX-canvas.offsetLeft-5)*(400/(window.innerWidth-10));
			clientY= (event.touches[0].clientY-canvas.offsetTop-5)*(400/(window.innerWidth-10));
		} else {
			clientX= event.touches[0].clientX-canvas.offsetLeft-5;
			clientY= event.touches[0].clientY-canvas.offsetTop-5;
		}
		if (clientX<=150 && clientY>485) {
			a=true;
		} else if (clientX>150 && clientX<=250 && clientY>485) {
			s=true;
		} else if (clientX>250 && clientY>=485){
			d=true;
		} else if (clientY>385 && clientY<485){
			w=true;
		} else if (touch==true) { //if touchstart==true and you move the finger and then you release it it's not considered as an interaction with the document
			touch=false;
		}
	}
	function drawMobile(){
		c.strokeStyle = "rgba(0,0,0,0.15)";
		c.strokeRect(50,485,300,100);
		//W //looks ugly
		//c.beginPath();
		//c.moveTo(50, 387);
		//c.lineTo(50, 483);
		//c.stroke();
		//c.beginPath();
		//c.moveTo(350, 387);
		//c.lineTo(350, 483);
		//c.stroke();
		//c.beginPath();
		//c.moveTo(48, 385);
		//c.lineTo(352, 385);
		//c.stroke()
		//two lines that make A,S,D
		c.beginPath();
		c.moveTo(150, 487);
		c.lineTo(150, 583);
		c.stroke();
		c.beginPath();
		c.moveTo(250, 487);
		c.lineTo(250, 583);
		c.stroke();
	}
}

//Apparently macs and pcs dont have the same font compatibilities smh, so this function changes the font to a more pretty font than Times New Roman for macs
function fontMac(size){ 
	if (navigator.platform!="Win32"){
		c.font = size+" Courier";
	}
}


//This is the nearly the whole game and its animation has an image drawn every 10 milliseconds
function gameStart(){
	a=false; 
	d=false;
	s=false;
	w=false; //player's square starts in the middle by default
	track.play();
	track.loop=true;
	trito = setInterval(draw,10); //game animation
}

//I started this game with 7 controls ASD for the square position and JKL for the half-square position and space for the trisected squares
//After a friend told me that keyup is a thing in JS, something I overlooked I decided to go back to my original plan when starting this game and to only use 4 controls A,S,D,W like the typical games which will make the learning curve more shallow
//the reason why every option has all the keys in them with tru or false is because
//if a non existant combination happens, for example 
function position(){
	if (a==false && d==false && s==false && w==true){
		player="m3";
	} else if (a==true && d==true  && s==true && w==false){
		player="m3";
	} else if (a==true && d==false  && s==false && w==true){
		player="l3";
	} else if (a==false && d==true && s==false && w==true){
		player="r3";
	} else if (a==true && d==false && s==true && w==false){
		player="l2";
	} else if (a==false && d==true && s==true && w==false){
		player="r2";
	} else if (a==true && d==true && s==false && w==false){ //If you click a and d it is the same as clicking the middle of them.
		player="m2";
	} else if (a==false && d==false && s==true && w==false){ 
		player="m2";
	} else if (a==true && d==false && s==false && w==false){
		player="l";
	} else if (a==false && d==true && s==false && w==false){
		player="r";
	} else if (a==false && d==false && s==true && w==true){ 
		player="mo";
	} else if (a==true && d==false && s==true && w==true){ 
		player="lo";
	} else if (a==false && d==true && s==true && w==true){ 
		player="ro";
	} else if (a==false && d==false && s==false && w==false){ //This returning central position when all keys are false is necessary because without this when you do combinations of keys and let go of that combination, it doesn't stay as the combination it changed as the last left key which can be confusing and aesthetically annoying
		player="m";
	} 
}

//draws the player
function drawPlayer(){
	c.lineWidth=4;
	c.fillStyle="white"; // Without this line, the stuff can be seen through the player which is not very appealing to the eyes
	c.strokeStyle="black";
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
	} else if (player == "mo") { //opposite
		c.fillStyle="black"
		c.fillRect(165,500,70,70);
		c.strokeRect(165,500,70,70);
	} else if (player == "lo") {
		c.fillStyle="black"
		c.fillRect(65,500,70,70);
		c.strokeRect(65,500,70,70);
	} else if (player == "ro"){
		c.fillStyle="black"
		c.fillRect(265,500,70,70);
		c.strokeRect(265,500,70,70);
	} else if (player == "n") { 
		c.strokeStyle = "rgba(0,0,0,0.15)";
		c.fillRect(65,500,70,70);
		c.fillRect(165,500,70,70);
		c.fillRect(265,500,70,70);
		c.strokeRect(65,500,70,70);
		c.strokeRect(165,500,70,70);
		c.strokeRect(265,500,70,70);
	} 
}



//draws filled rectangles/obstacles
function drawFilled(type, y){
	c.fillStyle="black";
	c.strokeStyle="black";
	c.lineWidth=4;
	if (type == 0){ //for A
		c.fillRect(165,y,70,70);
		c.fillRect(265,y,70,70);
		c.strokeRect(165,y,70,70);
		c.strokeRect(265,y,70,70);
	} else if (type == 1) { //for S
		c.fillRect(65,y,70,70);
		c.fillRect(265,y,70,70);
		c.strokeRect(65,y,70,70);
		c.strokeRect(265,y,70,70);
	} else if (type == 2) { //for D
		c.fillRect(65,y,70,70);
		c.fillRect(165,y,70,70);
		c.strokeRect(65,y,70,70);
		c.strokeRect(165,y,70,70);
	} else if (type == 3) { //for S&A
		c.fillRect(265,y,70,70);
		c.fillRect(65,y,18,70);
		c.fillRect(117,y,18,70);
		c.fillRect(165,y,18,70);
		c.fillRect(217,y,18,70);
		c.strokeRect(265,y,70,70);
		c.strokeRect(65,y,18,70);
		c.strokeRect(117,y,18,70);
		c.strokeRect(165,y,18,70);
		c.strokeRect(217,y,18,70);
	} else if (type == 4) { //for S&D
		c.fillRect(65,y,70,70);
		c.fillRect(165,y,18,70);
		c.fillRect(217,y,18,70);
		c.fillRect(265,y,18,70);
		c.fillRect(317,y,18,70);
		c.strokeRect(65,y,70,70);
		c.strokeRect(165,y,18,70);
		c.strokeRect(217,y,18,70);
		c.strokeRect(265,y,18,70);
		c.strokeRect(317,y,18,70);
	} else if (type == 5) { //for S
		c.fillRect(165,y,70,70);
		c.fillRect(65,y,18,70);
		c.fillRect(118,y,18,70);
		c.fillRect(265,y,18,70);
		c.fillRect(318,y,18,70);
		c.strokeRect(165,y,70,70);
		c.strokeRect(65,y,18,70);
		c.strokeRect(118,y,18,70);
		c.strokeRect(265,y,18,70);
		c.strokeRect(318,y,18,70);
	} else if (type == 6) { //for W
		c.fillRect(65,y,26,70);
		c.fillRect(109,y,26,70);
		c.fillRect(165,y,26,70);
		c.fillRect(209,y,26,70);
		c.fillRect(265,y,26,70);
		c.fillRect(309,y,26,70);
		c.strokeRect(65,y,26,70);
		c.strokeRect(109,y,26,70);
		c.strokeRect(165,y,26,70);
		c.strokeRect(209,y,26,70);
		c.strokeRect(265,y,26,70);
		c.strokeRect(309,y,26,70);
	} else if (type == 7) { //for W&A
		c.fillRect(265,y,70,70);
		c.fillRect(65,y,26,70);
		c.fillRect(109,y,26,70);
		c.fillRect(165,y,12,70);
		c.fillRect(223,y,12,70);
		c.strokeRect(265,y,70,70);
		c.strokeRect(65,y,26,70);
		c.strokeRect(109,y,26,70);
		c.strokeRect(165,y,12,70);
		c.strokeRect(223,y,12,70);
	} else if (type == 8) { //for W&D
		c.fillRect(65,y,70,70);
		c.fillRect(265,y,26,70);
		c.fillRect(309,y,26,70);
		c.fillRect(165,y,12,70);
		c.fillRect(223,y,12,70);
		c.strokeRect(65,y,70,70);
		c.strokeRect(265,y,26,70);
		c.strokeRect(309,y,26,70);
		c.strokeRect(165,y,12,70);
		c.strokeRect(223,y,12,70);
	} else if (type == 9) {  //opposite
		c.fillStyle="white";
		c.fillRect(65,y,70,70);
		c.fillRect(265,y,70,70);
		c.strokeRect(65,y,70,70);
		c.strokeRect(265,y,70,70);
	} else if (type == 10) { 
		c.fillStyle="white";
		c.fillRect(165,y,70,70);
		c.fillRect(265,y,70,70);
		c.strokeRect(165,y,70,70);
		c.strokeRect(265,y,70,70);
	} else if (type == 11) { 
		c.fillStyle="white";
		c.fillRect(65,y,70,70);
		c.fillRect(165,y,70,70);
		c.strokeRect(65,y,70,70);
		c.strokeRect(165,y,70,70);
	}
}

//draws the score
function drawScore(){
	c.fillStyle="black";
	c.font = "bold 15px Lucida Console";
	fontMac("bold 15px");
	c.textAlign = "right";
	c.fillText("Score",399,15);
	c.font = "15px Lucida Console";
	fontMac("15px");
	c.fillText(score,399,30);
	c.font = "bold 15px Lucida Console";
	fontMac("bold 15px");
	c.textAlign = "left";
	c.fillText("Best",2,15);
	c.font = "15px Lucida Console";
	fontMac("15px");
	c.fillText(hiScore,2,30);
}

//the function that defines the type of the filled rectangles (wave obstacles) since we want to gradually increase difficulty
function rand() {
	if (score>=0 && score<=5 ){
		return Math.floor(Math.random() * 3); 
	} else if (score>5 && score<=20) {
		return Math.floor(Math.random() * 6); 
	} else if (score>20 && score<=35){
		return Math.floor(Math.random() * 7);
	} else if (score>35 && score<=60){
		return Math.floor(Math.random() * 9);
	} else if (score>60 && score<=150) {
		return Math.floor(Math.random() * 10);
	} else if (score>150) { //from 150 here since recently found out that most keyboards (unlike gaming keyboards) don't register 3 keys pressed together at once. By putting it at 250, which nearly no one will reach except really good gamers so it makes it fair.
		return Math.floor(Math.random() * 12);
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
	if(mobile==true){ //has to be under everything
		drawMobile();
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
	if (pcBool==true && gameOverBool==false) {
		pc2(); //has to check if score that was updated with pc() is exactly only one above, if not hack-"1"
		pcBool=false;
	}
	if (y1>570 && count==true) {
		point.play();
		if (pcRand==score+1) {
			pc();
		}
		score = score+1;
		count= false;
	}
	if (y2>570 && count==false) {
		point.play();
		if (pcRand==score+1) {
			pc();
		}
		score = score+1;
		count= true;
		if (score%50==0){
			clap.play();
			ud();
		}
	}
	if (hiScore<score){
		hiScore=hiScore+1; //to discourage any breakpoints hacks to change scores
	}
	//speed starts to go up 
	if(score>30){ //speeding up the waves 
		dy=startdy+Math.floor(0.80*(Math.sqrt(score-30))); //using a squrt function made a lot of sense since you want the speed to increase 
		//quickly at the beginning so it's not boring but you want it to stop increasing so quickly towards the end since the difficulty increase between 15 and 20 is a lot lower than the difficulty increase between 30 and 35
	} 
	
	position(); //according to what keys are down/up this says which position the player has to be and this current funtion draws the player accordingly to the position
	drawPlayer(); //draws player on top of everyting else
	//console.log("Speed:"+dy); //debugging
	//GameOver
	if (y1>432 && y1<570){ 
		if ((type==0 && player!="l") || (type==1 && player!="m") || (type==2 && player!="r") || (type==3 && player!="l2") || (type==4 && player!="r2") || (type==5 && player!="m2") || (type==6 && player!="m3") || (type==7 && player!="l3") || (type==8 && player!="r3") || (type==9 && player!="mo") || (type==10 && player!="lo") || (type==11 && player!="ro")) {
			gameOverBool=true; //so that if you loose exactly on gmoRand, it doesn't call gmorand the same time and then say you hacked even if you didn't
			gameOver(); //stops animation
		}
	}
	if (y2>432 && y2<570) {
		if ((type2==0 && player!="l") || (type2==1 && player!="m") || (type2==2 && player!="r") || (type2==3 && player!="l2") || (type2==4 && player!="r2") || (type2==5 && player!="m2") || (type2==6 && player!="m3") || (type2==7 && player!="l3") || (type2==8 && player!="r3") ||(type2==9 && player!="mo") || (type2==10 && player!="lo") || (type2==11 && player!="ro")) {
			gameOverBool=true; //technically don't need but still in case I decide to put gameover for y2 as well
			gameOver(); //stops animation
		}
	}
	
	//this gameover tester has to be after the real gameover testers since if the real gameover testers don't work, then we have this as last resort
	//This happens according to what gmoRand is which is calculated everytime ud() is ran, so every 50 score, so gmo() happens a random score every 50 points
	if (gameOverBool==false && gmoBool==true && score==gmoRand && (y1>432)) {
		gmo();
		gmoBool=false;
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
			if (alias == null){ //if the player responds null again
				sendData(alias, hiScore);
			} else {
				if (alias!=null && alias.trim()==""){ //if the player responds with ""
					alias=null;
					sendData(alias, hiScore);
				} else if (alias!=null) { //if the player responds with ""
					alias=alias.trim(); //erase space before and after
					let temp=alias.split(" ");
					alias=temp[0];
					alias= alias.substring(0, 15);
					alias=alias.toLowerCase(); //i want lowercase one word aliases for the leaderboard which look organic and like normal aliases
					sendData(alias, hiScore);
				}
			}
		} else {
			sendData(alias, hiScore);
		}
	},1800); 
}

function highScore(){ //to display the highscores at the very end
	c.clearRect(0,0,400,600);
	c.fillStyle="black";
	c.font = "bold 25px Lucida Console";
	fontMac("bold 25px");
	c.textAlign = "center";
	c.fillStyle="Black";
	if (mobile == false) {
		c.fillText("High Scores",200,30);
	} else {
		c.fillText("High Scores",200,85);
	}
	getData(); // then bubblesort() data, then display leaderboard()
	c.textAlign = "center";
	flashingText();
	game=false;
}


function bubbleSortScores(){
	subL=scores.length-1;
	for (var i=0; subL!=0; i++) {
		for (var j=0; j<subL; j++){
			if (scores[j]<scores[j+1]) {
				temp1=scores[j];
				temp2=winners[j];
				scores[j]=scores[j+1];
				winners[j]=winners[j+1];
				scores[j+1]=temp1;
				winners[j+1]=temp2;
			}
		}
		subL=subL-1;
	}
}


//Calls a php script that gets data from mysql table
//function getData() but this version doesn't call other functions when it's done. It is only used to update the lists scores and winners
//It will be used at the beginning to pull data since getData will be used just before showing the leaderbord and you need to know before that
//if the alias that the player entered was already in it and his hiscore is better than the score in it, it should be updated and not entered as another record which will
//cause duplicate aliases with different scores which is FINE but looks messy and might discourage showing 10 different people in the leaderboard which is the endgoal
function updateScores() {
	var ajax = new XMLHttpRequest();
	ajax.open("GET", "data.php", true);
	ajax.onload= function(){
		//console.log(this.responseText); //debug: to get any error messages from data.php as alerts
		data=JSON.parse(this.responseText); //convert data from MySQL table from JSON string to javascript object
		for (var i=0; i<data.length; i++){
			winners.push(data[i].alias);
			scores.push(parseInt(data[i].score));
		}
	}
	ajax.send();
}

//antivirus functions to communicate with php. that is the reason why they are are functions which are hard to understand
//initialization and of the player in the database, when he starts game for the first time
function udi(){
	var ajax= new XMLHttpRequest();
	ajax.open("GET", "udi.php", true); //sending score, hiscore and dy to database
	ajax.onload= function(){
		//console.log(this.response); //debug
		id = parseInt(this.response);
		reset(); //If the player is playing multiple games
		go.pause();
		rst();
	}
	ajax.send();
}

//resets count and score when the player plays again
function rst(){
	var ajax= new XMLHttpRequest();
	ajax.open("GET", "rst.php?id="+id, true); //sending score, hiscore and dy to database
	ajax.onload=function(){
		gameStart();
	}
	ajax.send();
}

//update score, highscore data every 50 score to prevent hack and checks if vel is the right value 
//you also need to check score data as well, since if their highscore is very high, they could maybe juste update the score to the same amount in another play (count value in table from pc and gmo would f that up but still), so we'll leave it. Maybe in the next iteration of the antihack software it would be more useful.
function ud(){
	base=base+50;
	pcRand=base+10+Math.floor(Math.random() * 10); //base+(10 to 20)
	gmoRand=base+30+Math.floor(Math.random() * 10); //base+(30 to 40)
	gmoRand= gmoRand-gmoRand%2; //to make it even, sinc we only want it to calculate for y1 and y1 is in between 432 and 570 only when the score is even
	gmoBool=true; //gmo happens once per 50 scores
	var ajax= new XMLHttpRequest();
	ajax.open("GET", "ud.php?id="+id+"&score="+score+"&hi="+hiScore+"&vel="+dy, true); //sending score, hiscore and dy to database
	ajax.onload= function(){
		//console.log(this.response);
		//console.log("pcRand:"+pcRand+"gmoRand"+gmoRand);
	}
	ajax.send();
}

//point checker to see if they are increasing points at a higher rate than 1 per scoring
function pc() {
	var ajax= new XMLHttpRequest();
	ajax.open("GET", "pc.php?id="+id+"&score="+score, true); //sending score, hiscore and dy to database
	ajax.onload = function() {
		pcBool=true; //I put inside the draw function before and draw (one frame) was too quick for pc() to update the database and pc2 to be accurate. Sometimes javascript can be too quick for php and mysql to change so take that in account. You didn't use onload for other xmlhttp functions as well but they are spaced out just because of that ( I got scared things like this could happen, and THEY INDEED DO)
		//console.log(this.response);
	}
	ajax.send();
}

function pc2() {
	var ajax= new XMLHttpRequest();
	ajax.open("GET", "pc2.php?id="+id+"&score="+score, true); //sending score, hiscore and dy to database
	ajax.onload = function() {
		//console.log(this.response);
	}
	ajax.send();
}

//check if gameOver at a random score to check if they are cheating
function gmo(){
	//console.log("gmoRand"+gmoRand+"score"+score+"y1"+y1+"y2"+y2)
	var ajax= new XMLHttpRequest();
	ajax.open("GET", "gmo.php?id="+id+"&type="+type+"&player="+player+"&y1="+y1, true); //sending score, hiscore and dy to database
	ajax.onload = function() {
		//console.log(this.response);
	}
	ajax.send();
}

//Update or add record to the highscore database.
 function sendData(aliasArg, scoreArg) {
	 if (alias == null) { //|| score<hiScore is not a correct code to add here since if the score is smaller than hiscore but the user didn't enter the alias in the past game it is possible that his hiscore would never be entered into the database, so the current code is correct 
		highScore(); 
	 } else {
		 var ajax= new XMLHttpRequest();
		 ajax.open("GET", "add.php?alias="+aliasArg+"&id="+id+"&hiscore="+scoreArg+"&score="+score, true); //sending data to php script
		 ajax.onload= function() {
			//console.log(this.responseText); //debug
			highScore();
		}
		ajax.send();
	}
}

//IMPORTANT
//I used to use this to delete data but I made it more secure by not sending data from here to the php, but this is useless now that I understand event scheduelers and cron jobs (in shared servers without super privileges hence no event schedueler)
//NOW THIS FUNCTION IS USELESS BUT I LEFT IT IN CASE I USE IT FOR SOME REASON IN THE FUTURE
//function deleteData(){
	//var ajax= new XMLHttpRequest();
	//ajax.open("GET", "delete.php", true); 
	//ajax.send();
	//ajax.onload= function() {
		//getData();
	//}
//} 

//like updatesScores() but also calls to other functions towards the end
//We need to pull data every game since, every game there might be updates to the scoreboard, like if the player surpasses his hiScore, this is being sent to the database, but not inside this program so we need to read the databse after each game before drawing the highscore on the canvas
function getData(){ 
	var ajax = new XMLHttpRequest();
	ajax.open("GET", "data.php", true);
	winners=[]; //need to reset this so it doesn't interfere with updateScores() which is called in reset(), without this: duplicates in leaderboard
	scores=[];
	ajax.onload= function(){
		//console.log(this.responseText); //debug: to get any error messages from data.php as alerts
		data=JSON.parse(this.responseText); //convert data from MySQL table from JSON string to javascript object
		for (var i=0; i<data.length; i++){
			winners.push(data[i].alias);
			scores.push(parseInt(data[i].score));
		}
		bubbleSortScores();
		leaderboard();
	}
	ajax.send();
}


function leaderboard(){
	if (mobile==false) {
		let y;
		c.font = "bold 19px Lucida Console";
		fontMac("bold 19px");
		c.textAlign = "left";
		for (var i=0; i < 10; i++){
			y=50*i+85;
			if (scores[i]!=null){
				if (i<9){ //so all the aliases are lined up properly
				c.textAlign = "left";
				c.fillText((i+1)+". "+winners[i], 15, y);
				c.textAlign = "right";
				c.fillText(scores[i], 385 , y);
				} else {
				c.textAlign = "left";
				c.fillText((i+1)+"."+winners[i], 15, y);	
				c.textAlign = "right";
				c.fillText(scores[i], 385, y);
				}
			}
		}
	} else {
		let y;
		c.font = "bold 19px Lucida Console";
		fontMac("bold 19px");
		c.textAlign = "left";
		for (var i=0; i < 10; i++){
			y=50*i+125;
			if (scores[i]!=null){
				if (i<9){ //so all the aliases are lined up properly
				c.textAlign = "left";
				c.fillText((i+1)+". "+winners[i], 15, y);
				c.textAlign = "right";
				c.fillText(scores[i], 385 , y);
				} else {
				c.textAlign = "left";
				c.fillText((i+1)+"."+winners[i], 15, y);	
				c.textAlign = "right";
				c.fillText(scores[i], 385, y);
				}
			}
		}

	}
}

//flashing text at the bottom of the screen of highscores saying you can press any keys to go back to the start menu
function flashingText(){
	flashing=true; //if this is true, we can use clearInterval on the loop when the game starts once again
	let count=1; //
	if (mobile == false) {
		loop= setInterval( function() {
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
	} else {
		loop= setInterval( function(){
			if (count%4!=0){ //this makes the flashing text/nothing time to 3/1, so there is text 3/4 of the time and nothing 1/4 of the time
				c.clearRect(0,15,400,25); // need here as well. not only in else{} since without this, it becomes bolder and bolder and looks weird
				c.fillStyle="black";
				c.textAlign = "center";
				c.font = "bold 13px Lucida Console";
				fontMac("bold 13px");
				c.fillText("Touch Here to play again",200,30);
			} else {
				c.clearRect(0,15,400,25); //used the console and strokeRect() to find out these coordinates
			}
			count=count+1;
		},250);	
	}
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
makes an array of the values of those variables. So if you change one of the variables, it won't change
what is in the array.

Big error5:
I made a function getData that used ajax to get data from PHP. I used the onload method in there
This getData function assigned the data to various arrays defined at the beginning and sorted the 
data at the end using another function called bubblesort which was a perfect function (bubble...)
I made another function called leaderboard that drew the leaderboard according to those sorted
arrays.
I called both of them one after the other
getData();
leaderboard();
near the bottom in the function highscore (which drew highscore title and had the flashing text
What happened, is that getData() started but since it is asynchronous, while it's not done
(onload) the other one started and the other one draws the scores so they were undefined.
FIX: Call getData() in highscore. Call leaderboard() in the onload function inside getData
and now leaderboard will only run when getData is loaded.
Rule of thumb: When something is asynchronous (eventlisteners, onload...), always make one function call the other function when it is done.

*/