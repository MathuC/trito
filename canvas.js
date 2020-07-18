var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

c.clearRect(0,0,400,600);
c.fillRect(165,470,70,70);

//key that player presses
let key="None"; //keyt that player pressed

//which key the player presses
document.addEventListener("keydown", function(event) {
	key = event.code;
	alert(key);
});

//draw the player

//the function that defines the opponent
function bad() {
	let type = Math.floor(Math.random() * 6);
	alert(type);
}		


function draw(){
		
}
