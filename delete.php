<?php
$conn = mysqli_connect("localhost", "root", "", "trito");

//if connection to server/database has error 
if (!$conn){
	echo 'Connection error: ' . mysqli_connect_error();
}

//getting the variables passed in the js script into php variables
$alias = $_GET["alias"];

//delete the extra value which has the 11th highest score
mysqli_query($conn, "DELETE FROM highscores WHERE alias='$alias'"); //the '' around $alias and $score is very important and got me stuck for a long time

?>