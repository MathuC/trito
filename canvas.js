var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

c.clearRect(0,0,400,600);

c.fillRect(65,400,70,70);
c.fillRect(165,400,70,70);
c.fillRect(265,400,70,70);


//key that player presses
let key="None"; 

//game score
let score=0;

//which key the player presses. Everytime a key is pressed, the "key" var is updated with that value e.g: KeyS
document.addEventListener("keydown", direction);
function direction(event){
	key = event.code;
	alert(key);
}

//draw the player
function player(){
	if (key == "KeyS") {
	}
	
}

//the function that defines the opponent
function bad() {
	let type = Math.floor(Math.random() * 6);
	alert(type);
}		


function draw(){
		
}
