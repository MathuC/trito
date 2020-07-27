<?php
$conn = mysqli_connect("localhost", "root", "", "trito");

//if connection to server/database has error 
if (!$conn){
	echo 'Connection error: ' . mysqli_connect_error();
}

//getting the variables passed in the js script into php variables
$alias = $_GET["alias"];
$score = $_GET["score"];
$update = $_GET["update"]; //the variable that says if we need to update or do nothing if there is already the same alias in the database

//getting into a variable if there is a duplicate variable
$prevScore=mysqli_query($conn, "SELECT score FROM highscores WHERE alias= '$alias'"); //find if a score with the same alias already exists 
//echo gettype($prevScore);  //debug

//if there is no duplicate, insert the score, if not and the score is higher than what it is in the database, update it
if($prevScore->num_rows == 0) {
	//sending data to mysql
	mysqli_query($conn, "INSERT INTO highscores(alias, score) VALUES ('$alias',  '$score')"); //the '' around $alias and $score is very important and got me stuck for a long time
} else {
	if ($update) {
		mysqli_query($conn, "UPDATE highscores SET score='$score' WHERE alias='$alias'");
	}
}
?>