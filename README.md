# Trito

[Trito](https://mathusan.net/Trito/index.html) is a simple javascript canvas game where you dodge the rectangles coming your way (from top to bottom).

## Components
`canvas.js` has the whole game in a canvas that draws every 10 milliseconds (100 times per second) so that the animation is smooth.

`index.html` has the main structure of the page, the title of the page and few paragraphs below the canvas.

`style.css` has few informations about the background colour and the font of texts.

## Big Changes
1. I started coding this project on the 16th of July 2020. I need to finish this on the 19th of July 2020 at 11:59PM (challenge to myself).

2. I finished the game on the 18th at night but want to add more features, like the leaderboard, so I will still be working on this after the 19th (won the bet).

3. Completely changed the controls after a friend who tested my game told me about keyup events in Javascript, which made me go back to my original plan of using WASD as controls instead of 7 keys (A,S,D,J,K,L,Space) (since I first erroneously thought there was only a keydown event and that there was no way of knowing if a key was "being pressed")
	1. A and D are for the positions Left and Right
	1. S and W are for dividing the square into 2 parts or 3 parts.

4. Added few more combinations of keys to make the game harder.

5. Finished the server-side scripts (PHP) to interact with a database (MySQL). 

6. The Websites is online (26/07/2020).
`mathusan.net` forwards anyobdy to the website where the game is running.