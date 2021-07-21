//The find your hat game! This javascript file is a terminal game that allows the user to move through a path (array) while avoiding
//holes or going out of bounds of the array. Once you make it to the hat (^) character you win! The main goal of this game was to work
//on utalising class methods as well as the 'require' and 'prompt-sync' methods to get used to user input.


//Variable declerations
const prompt = require('prompt-sync')({sigint: true});
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
let i = 0;
let j = 0;
let gameOn = true;
var hardMode;
var move;

class Field {
  constructor(newField) {
    this.field = newField;
    this.length = newField.length;
    this.width = newField[0].length;
  }

  playGame() {
  	//Greeting message, asking if the user wants to play in hard mode, and setting up initial starting point.
  	console.log('Hello there! Lets get back your hat! Your current position is shown by the "x" symbol.');
  	console.log('The places you have been are marked by the "*" symbol!');
  	hardMode = prompt('\nWould you like to play in hard mode? ("y" for yes, "n" for no)');
  	if (hardMode.toUpperCase() == 'Y') {
  		hardMode = true;
  		console.log('We will be playing in hard mode! A new hole will be added after every move you make!\n\n');
  	}
  	else {
  		hardMode = false;
  	}

  	//Setting up starting point. We use a while loop to keep generating a new spot that is not where the Hat is located
  	i = Math.floor(Math.random() * this.length);
  	j = Math.floor(Math.random() * this.width);
  	while(this.field[i][j] == hat) {
	  	i = Math.floor(Math.random() * this.length);
	  	j = Math.floor(Math.random() * this.width);
	  }
  	this.field[i][j] = 'X';

  	while(gameOn) {
  		//Printing the map, changing the current patch marker to a the pathCharachter, running the makeMove method
  		this.print();
  		this.field[i][j] = pathCharacter;
  		this.makeMove();

  		//Series of if/if else statements to make sure the move is not out of bounds, into a hole, or the locaiton of the hat! If none of those,
  		//then we make the current spot reperesent the 'X' charachter and we move on to the hardmode block if on, if not we start the loop over again.
  		if (this.outOfBounds()) {
  			this.undoMove();
  		}
  		else if (this.isHole()) {
  			console.log('Oh no! You fell into a hole!');
  			gameOn = false;
  		}
  		else if (this.isHat()) {
  			console.log('Congradulations, you found your hat!');
  			break;
  			}
  		else {
  			this.field[i][j] = 'X';
  		};

  		//If we are in hard mode, this if statement will run after each move. Inside, we use a while loop to pick a random spot on the
  		//playing field and as long as it is the spot of the hat, current spot, pathCharachter, or another hole, it will choose another 
  		//random spot to add a hole.
  		if(hardMode) {
		  	let x = Math.floor(Math.random() * this.length);
		  	let y = Math.floor(Math.random() * this.width);
  			while(this.field[x][y] == hat || this.field[x][y] == 'X' || this.field[x][y] == pathCharacter || this.field[x][y] == hole) {
			  	x = Math.floor(Math.random() * this.length);
			  	y = Math.floor(Math.random() * this.width);
   				}
   			this.field[x][y] = hole;
  		}
  	}
  }

  //Prints out the current playing field. Shows each 'i' index line by line and joined together to make it look more like a game instead of 
  //multiple items seperated by commas
  print() {
  	for (var i = 0; i < this.length; i++) {
  		console.log(this.field[i].join(''));
  	};
  }

  //Checks to see if the current spot/move is within the area of the field. i/j can not be less than zero and also can not be more than
  //the width/length of each way, which is the width minus one index spot.
  outOfBounds() {
  	if (i < 0 || j < 0 || j > this.width - 1 || i > this.length - 1) {
  		console.log('That is out of bounds! Pick another way!');
  		return true;
  	};
  }

  //Checks to see if the current spot/move is a hole
  isHole() {
  	if (this.field[i][j] == hole) {
  		return true;
  	};
  }

  //Checks to see if the current spot/move is the location of the hat
  isHat() {
  	if (this.field[i][j] == hat) {
  		return true;
  	};
  }

  //Prompts the user to enter a move per instruction. We then use a switch statement to see which variable to incriment. We also have
  //a confirmation statement to assure the user the correct input was accepted. A default statement is added incase the user enters a
  //command other than what was specified. We convert the input to upper case to avoid any upper/lower case issues.
  makeMove() {
  	move = prompt('Which direction would you like to go? (r = right, l = left, d = down)');
  	move = move.toUpperCase();
  	switch (move) {
  		case 'R':
  		j++;
  		console.log('Moving right!');
  		break;
  		case 'L':
  		j--;
  		console.log('Moving left!');
  		break;
  		case 'D':
  		i++;
  		console.log('Moving down!');
  		break;
  		case 'U':
  		i--;
  		console.log('Moving up!');
  		break;
  		default:
  		console.log('That was not a valid entry, please try again!');
  		break;
  	};

  }

  //If we made a move out of bounds, we will use this method to see wich variable was out of bounds, and then move it back to its limit
  undoMove() {
  	if (i < 0) {
  		i = 0;
  	}
  	else if (i == this.length ) {
  		i = this.length-1;
  	}
  	else if (j < 0) {
  		j = 0;
  	}
  	else if (j == this.width) {
  		j = this.width-1;
  	};
  }
}

function generateField(height = Math.floor(Math.random() * 10), width = Math.floor(Math.random() * 10), holePercentage = .1) {
	//We generate a 1 dimentional array with the user given length and fill it with the field charachter. If not given, we use random number generators for a max width/length of 10.
	//Then, we use the map method to go through each spot in the array and add an array in each spot with the user given width, also filling it with the field charachter
	//Next, we iterate through each spot of the two dimentional array using two for loops (one for each i spot, the next for each j).
	//Through each spot, we use the Math.Random method to see if it is within the holePercentage given by the user. The even distribution should
	//give and percentage of holes on the map.
	let field = Array(height).fill(fieldCharacter);
	field = field.map(item => Array(width).fill(fieldCharacter));
	for (i = 0; i < height; i++) {
		for (j = 0; j < width; j++) {
			if (Math.random() < holePercentage) {
				field[i][j] = hole;
				};
			};
		};

	//Declaring random spots for i/j variables to have a spot to place the hat. We use a while loop that will keep setting the hat untill
	//it is not at the starting point ([0][0]). We reset i and j to 0 so it will initiate the loop that sets the hat location.
	i = 0;
	j = 0;
	while (i == 0 && j == 0) {
		i = Math.floor(Math.random() * height);
		j = Math.floor(Math.random() * width);
		}
	field[i][j] = hat;
	return field;
};


let practiceField = new Field(generateField());
practiceField.playGame();