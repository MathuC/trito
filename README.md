# Trito

## Introduction
Trito is a simple javascript canvas game. I thought of the idea and design for this simple game to start learning Javascript and I made it exculsively using documentation online (mostly pdf's).
All audio and image files used were made (drawn and made with liscensed software) by made by me.

The game: Dodge the rectangles coming your way (from top to bottom).

Go to 
```
mathusan.net/Trito/index.html
``` 
to play the game.


## Components
`canvas.js` has the whole game in a canvas that draws every 10 milliseconds (100 times per second) so that the animation is smooth.

`index.html` has the main structure of the page, the title of the page and few paragraphs below the canvas.

`style.css` has few informations about the background colour and the font of texts.


## Terminology
`score` is the number of waves of rectangles the player has dodged.

`draw()` is the function that draws one frame of the game. It draws the ennemi rectangles, the player's rectangle(s), the score, the highscore...

`rand()` is a function that uses `Math.random()` to decide which ennemi rectangles will come in the next wave. The pool of possible rectangles go up as the scores go up so the difficulty increases.

`drawFifity()` is a function that draws a congratulatory banner with the current score when the player reaches multiples of 50 in their score.

`trito` is a var that has the interval of `draw` (repeats `draw` every 10 milliseconds).

`winners` is an array with the top scorers that got his data from the database.

`scores` is an array with the corresponding scores of the `winners` (same index).

`dy` is the speed of the incoming rectangles (that the player has to dodge). This increases with the score. 

`sep` is the amount of pixels separating the waves of rectangles (that the player has to dodge). I first planned in this sep going down as the score went up, but that was way too difficult.

*I didn't explain everything here since the files have an extensive amount of comments and are very easy to understand.*


## Big Changes

#### 16/07/2020
I started coding this project on the 16th of July 2020. I need to finish this on the 19th of July 2020 at 11:59PM (challenge to myself).

#### 18/07/2020
I finished the game on the 18th at night but want to add more features, like the leaderboard, so I will still be working on this after the 19th (won the bet).

#### 20/07/2020
Completely changed the controls after a friend who tested my game told me about keyup events in Javascript, which made me go back to my original plan of using WASD as controls instead of 7 keys (A,S,D,J,K,L,Space) (since I first erroneously thought there was only a keydown event and that there was no way of knowing if a key was "being pressed")
	1. A and D are for the positions Left and Right
	1. S and W are for dividing the square into 2 parts or 3 parts.

#### 22/07/2020
Added few more combinations of keys to make the game harder.

#### 24/07/2020
Finished the server-side scripts (PHP) to interact with a database (MySQL). 

#### 26/07/2020
The Websites is online.
`mathusan.net` forwards anybody to the website where the game is running.

#### 30/07/2020
I added server side scripts to check if there were simple manipulations of the javascript in the browser and to disqualify them as leaderboard candidates.


## Conclusion
I never used `javascript`, `PHP` or `MySQL` before so this project made me learn all those in about 10 days which was stressful at times, but these are used extensively in web developpement, something that might be in my carreer path.
This whole ongoing process was and is for the most part extremely fun since I love designing, making and playing videogames.