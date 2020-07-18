var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
c.lineWidth=3;

c.clearRect(0,0,400,600);

c.fillRect(91,500,18,70);
c.fillRect(191,500,18,70);
c.fillRect(291,500,18,70);


c.strokeRect(83,500,35,70);
c.strokeRect(183,500,35,70);
c.strokeRect(283,500,35,70);


c.strokeRect(65,500,70,70);
c.strokeRect(165,500,70,70);
c.strokeRect(265,500,70,70);
//template trials 
/*
c.font = "15px Lucida Console";
c.textAlign = "right";
c.fillText("Score",400,15);
c.fillText(33,400,30);
*/

//key that player presses
let key="None"; 

//game score
let score=0;

//which key the player presses. Everytime a key is pressed, the "key" var is updated with that value e.g: KeyS
document.addEventListener("keydown", direction);
function direction(event){
	if (event.code== "KeyA" || event.code== "KeyS" || event.code== "KeyD" || event.code== "KeyQ" || event.code== "KeyW" || event.code== "KeyE"){
		key = event.code;
		alert(key); //debugging
	}
}

//draw the player
function drawPlayer(){
	if (key == "KeyA") {
		c.fillRect(65,500,70,70);
	} else if (key == "KeyS") {
		c.fillRect(165,500,70,70);
	} else if (key == "KeyD") {
		c.fillRect(265,500,70,70);
	} else if (key == "KeyQ") {
		c.fillRect(83,500,36,70);
		c.fillRect(183,500,36,70);
	} else if (key == "KeyE") {
		c.fillRect(183,500,36,70);
		c.fillRect(283,500,36,70);
	} else if (key == "KeyW") {
		c.fillRect(91,500,18,70);
		c.fillRect(191,500,18,70);
		c.fillRect(291,500,18,70);
	}
}

//the function that defines the opponent
function bad() {
	let type = Math.floor(Math.random() * 6);
	alert(type);
}		


function draw(){
		
}
