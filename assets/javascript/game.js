var words = ["ZOMBIEMAN", "SHOTGUN GUY", "HEAVY WEAPON DUDE", "IMP", "DEMON", "LOST SOUL", "CACODEMON", "HELL KNIGHT", 
              "BARON OF HELL", "ARACHNOTRON", "PAIN ELEMENTAL", "REVENANT", "MANCUBUS", "ARCH-VILE", "SPIDER MASTERMIND",
              "CYBERDEMON", "OUR HERO"];
var wordIndex;                                                  // index of current word
var alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
var gameBoard = [];                                             // current game
var guesses = [];                                               // letters that have been guessed
var lives;

function refreshScreen () {
  document.getElementById("currentWord").innerHTML = "Current Word: " + gameBoard;
  document.getElementById("lettersGuessed").innerHTML = "Letters Guessed: " + guesses;
  document.getElementById("lives").innerHTML = "Lives: " + lives;
}

document.addEventListener('keypress', (event) => {
  console.log("lives != 0: " + (lives != 0));
  console.log("gameBoard.indexOf(_)) != -1: " + (gameBoard.indexOf("_")!= "-1"));
  if ((lives != 0) && (gameBoard.indexOf("_") != "-1")) {       // checks if game is over
    var sameKey = false;
    if (typeof(guesses[0]) != "undefined") {                    // doesn't run on first guess
      if (guesses.indexOf(event.key.toUpperCase()) != "-1") {   // checks guess has not already been selected
        document.getElementById("test").innerHTML = "SAME KEY ENTERED";
        sameKey = true;
      }
      if (sameKey == false) {                                   // if guess has not already been selected
        guesses[guesses.length] = event.key.toUpperCase();      // adds to array of guesses
        refreshScreen ();
        // document.getElementById("lettersGuessed").innerHTML = "Letters Guessed: " + guesses;
        letterInput(event.key.toUpperCase());                   // sends valid guess
      }
    }
    else {                                                      // runs on first guess only
      for (i = 0; i < alphabet.length; i++) {
        if (event.key.toUpperCase() == alphabet[i]) {
          guesses[guesses.length] = event.key.toUpperCase();
          refreshScreen ();
          // document.getElementById("lettersGuessed").innerHTML = "lettersGuessed: " + guesses;
          letterInput(event.key.toUpperCase());                 // sends valid guess
        }
      }
    }  
  }
});

function letterInput (guess) {
  var minusLife = true;                                         
  for (j = 0; j < words[wordIndex].length; j++) {
    if (guess == words[wordIndex].charAt(j)) {
    minusLife = false;
    gameBoard[j] = guess;
    refreshScreen ();
    // document.getElementById("currentWord").innerHTML = "Current Word: " + gameBoard;
    }
  }
  if (minusLife == true) {
    lives --;
    document.getElementById("lives").innerHTML = "Lives: " + lives;
  }
  if (lives == 0) {
    document.getElementById("test").innerHTML = "GAME OVER";
  }
  if (gameBoard.indexOf("_") == "-1") {
     document.getElementById("test").innerHTML = "YOU WIN!";
  }
}

function GetWord () {
  lives = 5;
  document.getElementById("lives").innerHTML = "Lives: 5";
  document.getElementById("lettersGuessed").innerHTML = "Letters Guessed:";
  gameBoard = [];
  guesses = [];
  guessesIndex = 0;
  var sameKey = false;
  wordIndex = [Math.floor(Math.random()*words.length)];
  for (i = 0; i < words[wordIndex].length; i++) {                               // draws gameboard
    if ((words[wordIndex].charAt(i)) == " ") {
      gameBoard[i] = " ";
    }
    else {
      if ((words[wordIndex].charAt(i)) == "-") {
        gameBoard[i] = "-";
      }
      else {
      gameBoard[i] = "_";
      }
    }
  }
  document.getElementById("currentWord").innerHTML = "Current Word: " + gameBoard;
  console.log("current word: " + words[wordIndex]);  
}