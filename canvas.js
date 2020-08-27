var canvas = document.getElementById("trito");

var c = canvas.getContext('2d');


var banner = new Image();
banner.src = "img/banner.png";
var instructions = new Image();
var mobileInstructions = new Image();

let hit = new Audio();
hit.src="audio/hit.wav";
let go = new Audio();
go.volume=0.85;
go.src="audio/gameOver.wav"; 
let track = new Audio(); 
track.src= "audio/corona.wav"; 
track.volume=0.10; 
let point= new Audio();
point.src= "audio/point.wav";
let clap= new Audio();
clap.src="audio/clap.wav";


let touch=false; 
let mobile=false; 
let trial; 
let trialBool=true; 
let trito; 
let player; 
let a=false; 
let d=false;
let s=false;
let w=false;
let score=0; 
let hiScore=0; 
let game= false;
let y1 = -72; 
let y2 = -72; 
let y3 = -125; 
let filled1 = true; 
let filled2 = false; 
let startdy=17; 
let dy=startdy; 
let sep=350; 
let type=1; 
let type2; 
let count=true; 
let fifty=false; 
let flashing= false; 
let alias; 
let id; 
let pcRand; 
let gmoRand; 
let gmoBool; 
let pcBool; 
let base; 
let gameOverBool;
let winners=[]; 
let scores=[]; 
let data; 


if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	mobile=true;
} else {
	mobile=false;
}
if (mobile==false){	
	instructions.onload= function(){ 
		startScreen();
	};
	instructions.src = "img/instructions.png"; 
} else {
	instructions.onload= function(){ 
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


function reset(){ 
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
	gmoRand= gmoRand-(gmoRand%2); 
	gmoBool=true;
	pcBool=false;
	if (flashing==true){
		clearInterval(loop);
	}
	winners=[]; 
	scores=[]; 
	updateScores();
}



document.addEventListener("keydown", down); 
function down(event){ 
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
		game=true; 
		if (trialBool==true){
			clearInterval(trial);
			trialBool=false;
			udi();
		} else {
			reset(); 
			go.pause();
			rst(); 
		}
	}
}

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



if (mobile==true) { 
	document.addEventListener("touchstart", touchDown); 
	function touchDown(event){
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
		} else if (game==false) {
			touch=true;
		}
	}

	document.addEventListener("touchend", touchUp);
	function touchUp(event){
		a=false;
		s=false;
		d=false;
		w=false;
		if (game==false && touch==true) { 
			
			game=true; 
			touch=false;
			if (trialBool==true){
				clearInterval(trial);
				trialBool=false;
				udi();
			} else {
				reset(); 
				go.pause();
				rst(); 
			}
		}
	}

	
	document.addEventListener("touchmove", touchMove); 
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
		} else if (touch==true) { 
			touch=false;
		}
	}
	function drawMobile(){
		c.strokeStyle = "rgba(0,0,0,0.15)";
		c.strokeRect(50,485,300,100);
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

function fontMac(size){ 
	if (navigator.platform!="Win32"){
		c.font = size+" Courier";
	}
}


function gameStart(){
	a=false; 
	d=false;
	s=false;
	w=false; 
	track.play();
	track.loop=true;
	trito = setInterval(draw,10); 
}


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
	} else if (a==true && d==true && s==false && w==false){ 
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
	} else if (a==false && d==false && s==false && w==false){ 
		player="m";
	} 
}

//draws the player
function drawPlayer(){
	c.lineWidth=4;
	c.fillStyle="white"; 
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
	} else if (player == "m3") { 
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
	} else if (player == "mo") { 
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



function drawFilled(type, y){
	c.fillStyle="black";
	c.strokeStyle="black";
	c.lineWidth=4;
	if (type == 0){ 
		c.fillRect(165,y,70,70);
		c.fillRect(265,y,70,70);
		c.strokeRect(165,y,70,70);
		c.strokeRect(265,y,70,70);
	} else if (type == 1) { 
		c.fillRect(65,y,70,70);
		c.fillRect(265,y,70,70);
		c.strokeRect(65,y,70,70);
		c.strokeRect(265,y,70,70);
	} else if (type == 2) { 
		c.fillRect(65,y,70,70);
		c.fillRect(165,y,70,70);
		c.strokeRect(65,y,70,70);
		c.strokeRect(165,y,70,70);
	} else if (type == 3) { 
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
	} else if (type == 4) { 
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
	} else if (type == 5) { 
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
	} else if (type == 6) { 
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
	} else if (type == 7) { 
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
	} else if (type == 8) { 
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
	} else if (type == 9) {  
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

function drawScore(){
	c.fillStyle="black";
	c.font = "bold 15px Lucida Console";
	fontMac("bold 15px");
	c.textAlign = "right";
	c.fillText("Score",400,15);
	c.font = "15px Lucida Console";
	fontMac("15px");
	c.fillText(score,400,30);
	c.font = "bold 15px Lucida Console";
	fontMac("bold 15px");
	c.textAlign = "left";
	c.fillText("Best",0,15);
	c.font = "15px Lucida Console";
	fontMac("15px");
	c.fillText(hiScore,0,30);
}

function rand() {
	if (score>=0 && score<=5 ){
		return Math.floor(Math.random() * 3); 
	} else if (score>5 && score<=20) {
		return Math.floor(Math.random() * 6); 
	} else if (score>20 && score<=35){
		return Math.floor(Math.random() * 7);
	} else if (score>35 && score<=60){
		return Math.floor(Math.random() * 9);
	} else if (score>60 && score<=250) {
		return Math.floor(Math.random() * 10);
	} else if (score>250) { 
		return Math.floor(Math.random() * 12);
	}
}

function drawFifty(y) { 
	c.fillStyle="black";
	c.font = "65px Lucida Console";
	c.textAlign = "center";
	const temp= score+1-(score+1)%50; 
	c.drawImage(banner,10,y-113,380,170);
	c.fillText(temp,200,y);
}	

function draw(){
	c.clearRect(0,0,400,600); 
	drawScore(); 

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
	if(mobile==true){ 
		drawMobile();
	}
	if (y3>700) {
		fifty=false;
		y3=-125; 
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
		pc2(); 
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
		hiScore=hiScore+1; 
	}
	 
	if(score>30){ 
		dy=startdy+Math.floor(0.80*(Math.sqrt(score-30))); 
	} 
	
	position(); 
	drawPlayer(); 
	if (y1>432 && y1<570){ 
		if ((type==0 && player!="l") || (type==1 && player!="m") || (type==2 && player!="r") || (type==3 && player!="l2") || (type==4 && player!="r2") || (type==5 && player!="m2") || (type==6 && player!="m3") || (type==7 && player!="l3") || (type==8 && player!="r3") || (type==9 && player!="mo") || (type==10 && player!="lo") || (type==11 && player!="ro")) {
			gameOverBool=true; 
			gameOver(); 
		}
	}
	if (y2>432 && y2<570) {
		if ((type2==0 && player!="l") || (type2==1 && player!="m") || (type2==2 && player!="r") || (type2==3 && player!="l2") || (type2==4 && player!="r2") || (type2==5 && player!="m2") || (type2==6 && player!="m3") || (type2==7 && player!="l3") || (type2==8 && player!="r3") ||(type2==9 && player!="mo") || (type2==10 && player!="lo") || (type2==11 && player!="ro")) {
			gameOverBool=true; 
			gameOver(); 
		}
	}
	
	if (gameOverBool==false && gmoBool==true && score==gmoRand && (y1>432)) {
		gmo();
		gmoBool=false;
	}
}

function gameOver(){
	clearInterval(trito);
	track.pause(); 
	hit.play(); 
	setTimeout(function(){c.clearRect(0,0,400,600);},600); 
	setTimeout(function(){ 
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
	setTimeout(function(){ 
		go.play(); 
		go.loop=true;}
		,600);
	setTimeout(function(){
		if(alias == null){
			alias = prompt("Enter your name/alias for the leaderboard (one word)");
			if (alias == null){ 
				sendData(alias, hiScore);
			} else {
				if (alias!=null && alias.trim()==""){ 
					alias=null;
					sendData(alias, hiScore);
				} else if (alias!=null) { 
					alias=alias.trim(); 
					let temp=alias.split(" ");
					alias=temp[0];
					alias= alias.substring(0, 15);
					alias=alias.toLowerCase(); 
					sendData(alias, hiScore);
				}
			}
		} else {
			sendData(alias, hiScore);
		}
	},1800); 
}

function highScore(){ 
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
	getData(); 
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


function updateScores() {
	var ajax = new XMLHttpRequest();
	ajax.open("GET", "data.php", true);
	ajax.send();
	ajax.onload= function(){
		data=JSON.parse(this.responseText); 
		for (var i=0; i<data.length; i++){
			winners.push(data[i].alias);
			scores.push(parseInt(data[i].score));
		}
	}
}

function udi(){
	var ajax= new XMLHttpRequest();
	ajax.open("GET", "udi.php", true); 
	ajax.send();
	ajax.onload= function(){
		id = parseInt(this.response);
		reset(); 
		go.pause();
		rst();
	}
}

function rst(){
	var ajax= new XMLHttpRequest();
	ajax.open("GET", "rst.php?id="+id, true); 
	ajax.send();
	ajax.onload=function(){
		gameStart();
	}
}

function ud(){
	base=base+50;
	pcRand=base+10+Math.floor(Math.random() * 10); 
	gmoRand=base+30+Math.floor(Math.random() * 10); 
	gmoRand= gmoRand-gmoRand%2; 
	gmoBool=true; 
	var ajax= new XMLHttpRequest();
	ajax.open("GET", "ud.php?id="+id+"&score="+score+"&hi="+hiScore+"&vel="+dy, true); 
	ajax.send();
	ajax.onload= function(){
	}
}

function pc() {
	var ajax= new XMLHttpRequest();
	ajax.open("GET", "pc.php?id="+id+"&score="+score, true); 
	ajax.send();
	ajax.onload = function() {
		pcBool=true; 
	}
}

function pc2() {
	var ajax= new XMLHttpRequest();
	ajax.open("GET", "pc2.php?id="+id+"&score="+score, true); 
	ajax.send();
	ajax.onload = function() {
	}
}

function gmo(){
	var ajax= new XMLHttpRequest();
	ajax.open("GET", "gmo.php?id="+id+"&type="+type+"&player="+player+"&y1="+y1, true); 
	ajax.send();
	ajax.onload = function() {
	}
}

 function sendData(aliasArg, scoreArg) {
	 if (alias == null) { 
		highScore(); 
	 } else {
		 var ajax= new XMLHttpRequest();
		 ajax.open("GET", "add.php?alias="+aliasArg+"&id="+id+"&hiscore="+scoreArg+"&score="+score, true); 
		 ajax.send();
		 ajax.onload= function() {
			highScore();
		}
	}
}

function deleteData(){
	var ajax= new XMLHttpRequest();
	ajax.open("GET", "delete.php", true); 
	ajax.send();
	ajax.onload= function() {
		getData();
	}
} 

function getData(){ 
	var ajax = new XMLHttpRequest();
	ajax.open("GET", "data.php", true);
	ajax.send();
	winners=[]; 
	scores=[];
	ajax.onload= function(){
		data=JSON.parse(this.responseText); 
		for (var i=0; i<data.length; i++){
			winners.push(data[i].alias);
			scores.push(parseInt(data[i].score));
		}
		bubbleSortScores();
		leaderboard();
	}
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
				if (i<9){ 
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
				if (i<9){ 
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

function flashingText(){
	flashing=true; 
	let count=1; 
	if (mobile == false) {
		loop= setInterval( function() {
			if (count%4!=0){ 
				c.clearRect(0,570,400,25); 
				c.fillStyle="black";
				c.textAlign = "center";
				c.font = "bold 13px Lucida Console";
				fontMac("bold 13px");
				c.fillText("Press Space to play again",200,585);
			} else {
				c.clearRect(0,570,400,25); 
			}
			count=count+1;
		},250);
	} else {
		loop= setInterval( function(){
			if (count%4!=0){ 
				c.clearRect(0,15,400,25); 
				c.fillStyle="black";
				c.textAlign = "center";
				c.font = "bold 13px Lucida Console";
				fontMac("bold 13px");
				c.fillText("Touch Here to play again",200,30);
			} else {
				c.clearRect(0,15,400,25); 
			}
			count=count+1;
		},250);	
	}
}	
