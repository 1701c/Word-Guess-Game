var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var gameBoard = [];
var guesses = [];
var lives = 5;
var wins = 0;
var loses = 0;
var kbState = false;

var characters = {
  charNames: ["ZOMBIEMAN", "SHOTGUN GUY", "HEAVY WEAPON DUDE", "IMP", "DEMON", "LOST SOUL", "CACODEMON", "HELL KNIGHT", "BARON OF HELL", "ARACHNOTRON", "PAIN ELEMENTAL", "REVENANT", "MANCUBUS", "ARCH-VILE", "SPIDER MASTERMIND", "CYBERDEMON", "OUR HERO"],
	damageImages: ["our_hero_death2.gif", "doomguy20.gif", "doomguy40.gif", "doomguy60.gif", "doomguy80.gif"],
	charIndex: 16,                // index of current character
  current: "OUR HERO",          // current word
  charFile: "our_hero",         // converted for filenames
  charSound: new Audio("assets/audio/our_hero_death.wav"),

	newChar: function () {
		guesses = [];
		gameBoard = [];
		lives = 5;
		// this.charIndex = [Math.floor(Math.random()*this.charNames.length)];        // selects random char
		if (this.charIndex == 16) {                                                   // cycles characters
			this.charIndex = 0;
		} else {
			this.charIndex++;
		}
		this.current = this.charNames[this.charIndex]; // copys character name to variable
		var fileName = this.current;
		for (i = 0; i < this.current.length; i++) {
			gameBoard[i] = " "; // adds spaces to gameboard
			if ((fileName.charAt(i)) == " ") {
				fileName = fileName.substr(0, i) + "_" + fileName.substr(i + 1); // adds underscores to filenames
			} else {
				if ((fileName.charAt(i)) == "-") {
					gameBoard[i] = "-"; // adds dashes to gameboard
				} else {
					gameBoard[i] = "_"; // adds underscores to gameboard
				}
			}
		}
    this.charFile = fileName.toLowerCase();
    this.charSound = new Audio("assets/audio/" + this.charFile + "_death.wav");
	}
}

var playGame = {
	startGame: 'new',
	music: new Audio("assets/audio/title_music.mp2"),
  audio: new Audio("assets/audio/our_hero_death.wav"),
  gunShot: new Audio("assets/audio/pistol.wav"),
  grunt: new Audio("assets/audio/grunt.wav"),
  playerDeath: new Audio("assets/audio/our_hero_death.wav"),

  drawGameBoard: function () {
    document.getElementById("currentWord").innerHTML = "";
    gameBoard.forEach(function(i) {
      document.getElementById("currentWord").append(i);
    });
		document.getElementById("lettersGuessed").innerHTML = guesses;
	},
  
  drawNewChar: function () {
    this.drawGameBoard();
    document.getElementById("damage").innerHTML = "<img src=\"assets/images/doomguy100.gif\" id=\"doomGuy\" alt=\"Statusbar\">";
    document.getElementById("charImage").src=("assets/images/" + characters.charFile + ".gif");
		document.getElementById("doomConsole").innerHTML = "> begining game...<br>" + "> " + wins + " wins, " + loses + " loses"
		document.getElementById("lettersGuessed").innerHTML = guesses;
		document.getElementById("welcome").innerHTML = "";
	},

	newGame: function () {
		switch (this.startGame) {
			case 'new':
				document.getElementById("welcome").innerHTML = "<h2>Hopefully you know how to play Hangman.<br>Your life depends on it!<br>Press any key to continue</h2>";
				document.getElementById("charImage").src=("assets/images/our_hero_death2.gif");
				this.music.play(); // welcome screen for first game
				this.audio.play();
				this.startGame = 'music';
				break;

			case 'music':
				this.music.pause(); // loads game music, continues to next case
				this.music = new Audio("assets/audio/running_from_evil.mp2");

			case 'next':
				this.music.play(); // load next character, starts music
				characters.newChar();
				this.drawNewChar();
				this.startGame = 'no';
				break;
		}
	},

	letterInput: function (guess) { // processes validated keypress                                      
    var minusLife = true;
		for (j = 0; j < characters.current.length; j++) {
			if (guess == characters.current.charAt(j)) {
        this.gunShot.currentTime = 0;
        this.gunShot.play();
        minusLife = false; // flags as incorrect letter
				gameBoard[j] = guess;
				document.getElementById("doomConsole").innerHTML = "> correct letter<br>> " + wins + " wins, " + loses + " loses";
				this.drawGameBoard();
			}
		}
		if (minusLife == true) { // if letter is incorrect
      this.grunt.currentTime = 0;
      this.grunt.play();
      lives--;
      document.getElementById("doomGuy").src=("assets/images/" + characters.damageImages[lives]);
      console.log(characters.damageImages[lives]);
			document.getElementById("doomConsole").innerHTML = "> incorrect letter<br>> " + wins + " wins, " + loses + " loses";
		}
		if (lives == 0) { // if 0 lives remaining
      this.grunt.currentTime = 0;
      this.playerDeath.play();
      loses++;
			document.getElementById("doomConsole").innerHTML = "> you lose<br>> " + wins + " wins, " + loses + " loses";
			document.getElementById("welcome").innerHTML = "The word was <br>" + characters.current + "<br>press any key to continue";
			this.startGame = 'next';
		}
		if (gameBoard.indexOf("_") == "-1") { // if puzzle solved
			wins++;
      document.getElementById("doomConsole").innerHTML = "> you win<br>> " + wins + " wins, " + loses + " loses";
      document.getElementById("charImage").src=("assets/images/" + characters.charFile + "_death.gif");
      characters.charSound.play();
			document.getElementById("welcome").innerHTML = "The word was <br>" + characters.current + "<br>press any key to continue";
			this.startGame = 'next';
		}
	},

	validateLetter: function (keyPress) {
		keyPress = keyPress.toUpperCase();
		if (this.startGame != 'no') { // checks if new game
			this.newGame();
		} else {
			for (i = 0; i < alphabet.length; i++) {
				if (keyPress == alphabet[i]) {
					if (guesses.indexOf(keyPress) != "-1") { // check for duplicate letter
						document.getElementById("doomConsole").innerHTML = "> duplicate letter<br>> " + wins + " wins, " + loses + " loses";
					} else {
						guesses[guesses.length] = keyPress; // adds to array of guesses
						this.drawGameBoard();
						this.letterInput(keyPress); // sends valid guess
					}
				}
			}
		}
  },
  
  mobileKeyboard: function () {
    kbState = !kbState;
    document.getElementById("keyboard").innerHTML = "";
    if (kbState == true) {
      var newButton = "";
      for (i = 0; i < alphabet.length; i++){
        newButton = newButton + "<button class=\"button letterBtn\" onclick=\"playGame.validateLetter(alphabet[" +i +"])\">" + alphabet[i] + "</button>";  
      }
      document.getElementById("keyboard").innerHTML = newButton;                                       
    }
    else {
      document.getElementById("keyboard").innerHTML = "";
    }
  }
}

// function zoom(scale) {
//   document.body.style.transform = "scale(" + scale + ")";
//   document.body.style.transformOrigin = "top left";
//   document.body.style.width = (100 / scale) + "%";
//   document.body.style.height = (100 / scale) + "%";
// };
// zoom(2.25);

document.addEventListener('keypress', (event) => {
  playGame.validateLetter(event.key);
});