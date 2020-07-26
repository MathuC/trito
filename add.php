<?php
$conn = mysqli_connect("localhost", "root", "", "trito");

//if connection to server/database has error 
if (!$conn){
	echo 'Connection error: ' . mysqli_connect_error();
}

//getting data from employee table
$result = mysqli_query($conn, "SELECT alias,score FROM highscores");

//storing in array
$data =array();
while ($row = mysqli_fetch_assoc($result)){
	$data[] = $row;
}
//transform file into JSON and returning it to canvas.js

echo json_encode($data);

//print_r($data); //another way other than JSON encoding of echoing an array 
?>