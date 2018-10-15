var alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
var gameBoard = [];
var guesses = [];
var lives = 5;
var wins = 0;
var loses = 0;

var characters = {
  charNames: ["ZOMBIEMAN", "SHOTGUN GUY", "HEAVY WEAPON DUDE", "IMP", "DEMON", "LOST SOUL", "CACODEMON", "HELL KNIGHT", 
  "BARON OF HELL", "ARACHNOTRON", "PAIN ELEMENTAL", "REVENANT", "MANCUBUS", "ARCH-VILE", "SPIDER MASTERMIND",
  "CYBERDEMON", "OUR HERO"],
  damageImages: ["doomguy0.gif","doomguy20.gif","doomguy40.gif","doomguy60.gif","doomguy80.gif"],
  charIndex: 16,     // index of current character
  charFile: "our_hero.gif",
  charFileDeath: "our_hero_death.gif",

  setCharAt: function(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
  },

  newChar: function() {
    guesses = [];
    gameBoard = [];
    this.charIndex = [Math.floor(Math.random()*this.charNames.length)]; // selects random char 
    var fileName = this.charNames[this.charIndex];
    for (i = 0; i < this.charNames[this.charIndex].length; i++) {
      gameBoard[i] = " "; // adds spaces to gameboard
      if ((fileName.charAt(i)) == " ") { // detects spaces in names
        fileName = fileName.substr(0,i) + "_" + fileName.substr(i+1); // adds underscores to filenames
      }
      else {
        if ((fileName.charAt(i)) == "-") {
          gameBoard[i] = "-"; // adds dashes to gameboard
        }
        else {
          gameBoard[i] = "_"; // adds underscores to gameboard
        }          
      }
    }
    this.charFile = fileName.toLowerCase() + ".png";
    this.charFileDeath = fileName.toLowerCase() + "_death.gif"
    document.getElementById("currentWord").innerHTML = gameBoard;
    document.getElementById("damage").innerHTML = "<img src=\"assets/images/doomguy100.gif\" id=\"doomGuy\" alt=\"Statusbar\">";
    document.getElementById("charImageBox").innerHTML = "<img src=\"assets/images/" + this.charFile + "\" id=\"charImage\" alt=\"charImage\">";
    document.getElementById("doomConsole").innerHTML = "> begining game...<br>" + "> " + wins + " wins, " + loses + " loses"
    document.getElementById("lettersGuessed").innerHTML = guesses;
  },
}

var playGame = {
  startGame: 1,
  music: new Audio("assets/audio/title_music.mp2"),
  audio: new Audio("assets/audio/our_hero_death.wav"),
  
  drawGameBoard: function() {
    document.getElementById("currentWord").innerHTML = gameBoard;
    document.getElementById("lettersGuessed").innerHTML = guesses;
    // document.getElementById("doomConsole").innerHTML = "Lives: " + lives;
  },

  newGame: function() {
    if ((this.startGame) == 1) {
      console.log("initgame") 
      document.getElementById("welcome").innerHTML = "Hopefully you know how to play Hangman. Your life depends on it!";
      document.getElementById("charImageBox").innerHTML = "<img src=\"assets/images/our_hero_death.gif\" id=\"charImage\" width=\"50%\">";
      // var music = new Audio("assets/audio/title_music.mp2");
      this.music.play();
      this.audio.play();
      this.startGame = 2;    
    }
    else {
      document.getElementById("welcome").innerHTML = "";
      this.startGame = 0;
      characters.newChar();
      this.music.pause();
      this.music = new Audio("assets/audio/running_from_evil.mp2");
      this.music.play();
    }
    if ((this.startGame) == 3) {
      this.startGame = 0;
      document.getElementById("welcome").innerHTML = "The last word was " + characters.charNames[charIndex];
      characters.newChar();
    }
  },

  letterInput: function(guess) { // processes validated keypress                                      
    var minusLife = true;
    for (j = 0; j < characters.charNames[characters.charIndex].length; j++) {
      if (guess == characters.charNames[characters.charIndex].charAt(j)) {
      minusLife = false;
      gameBoard[j] = guess;
      this.drawGameBoard();
      }
    }
    if (minusLife == true) {
      lives --;
      document.getElementById("damage").innerHTML = "<img src=\"assets/images/" + characters.damageImages[lives] + "\" id=\"doomGuy\" alt=\"Statusbar\">";
      document.getElementById("doomConsole").innerHTML = "> incorrect letter<br>> " + wins + " wins, " + loses + " loses";
    }
    if (lives == 0) {
      loses ++;
      console.log("losses++:" + loses);
      document.getElementById("doomConsole").innerHTML = "> you lose<br>> " + wins + " wins, " + loses + " loses";
      this.startGame = 3;
    }
    if (gameBoard.indexOf("_") == "-1") {
      wins ++;
      console.log("wins++:" + wins); 
      document.getElementById("doomConsole").innerHTML = "> you win<br>> " + wins + " wins, " + loses + " loses";
      this.startGame =3;
    }
  },

  validateLetter: function(keyPress) {
    if (this.startGame != 0) {
      this.newGame(keyPress);
    }
    else {      
      var minusLife = true;
      console.log("lives != 0: " + (lives != 0));
      console.log("gameBoard.indexOf(_)) != -1: " + (gameBoard.indexOf("_")!= "-1"));
      if ((lives != 0) && (gameBoard.indexOf("_") != "-1")) {       // checks if game is over
        var sameKey = false;
        if (typeof(guesses[0]) != "undefined") {                    // doesn't run on first guess
          for (i = 0; i < alphabet.length; i++) {
            if (keyPress.toUpperCase() == alphabet[i]) {
              if (guesses.indexOf(keyPress.toUpperCase()) != "-1") {   // checks guess has not already been selected
                document.getElementById("doomConsole").innerHTML = "> duplicate key<br>> " + wins + " wins, " + loses + " loses";
                sameKey = true;
              }
              if (sameKey == false) {                                   // if guess has not already been selected
                // if (keyPress.toUpperCase() == alphabet[i]) {
                guesses[guesses.length] = keyPress.toUpperCase();      // adds to array of guesses
                this.drawGameBoard ();
                // document.getElementById("lettersGuessed").innerHTML = "Letters Guessed: " + guesses;
                this.letterInput(keyPress.toUpperCase());                   // sends valid guess
                }
              }
            }
          }
          else {                                                      // runs on first guess only
              for (i = 0; i < alphabet.length; i++) {
                if (keyPress.toUpperCase() == alphabet[i]) {
                  guesses[guesses.length] = keyPress.toUpperCase();
                  this.drawGameBoard ();
                  // document.getElementById("lettersGuessed").innerHTML = "lettersGuessed: " + guesses;
                  this.letterInput(keyPress.toUpperCase());                 // sends valid guess
                }
              }
        }  
      }
    }
  }
}

document.addEventListener('keypress', (event) => {playGame.validateLetter(event.key)});