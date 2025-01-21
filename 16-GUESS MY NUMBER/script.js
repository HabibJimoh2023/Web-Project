/* WHAT IS DOM AND DOM MANIPULATION
DOM is an acronym that stand for Document Object Model: It is a Structured representation of HTML Document Allows JavaScript to access HTML Element and styles to manipulate them.  

//REFACTORING OUR CODE SIMPLY MEAN RESTRUCTURING THE CODE IN OTHER TO AVOID DUPLICATE CODE...

COMMON PRINCIPLE IN CODING
// DRY - THE PRINCIPLE OF DONT REPEAT YOUR SELF I.E DRY PRINCIPLE.
// KISS - KEEP IT SIMPLE STUPID 
// YAGNI - YOU AREN'T GONNA NEED IT.




console.log(document.querySelector(".message").textContent);

document.querySelector(".message").textContent = "Correct Number!";

console.log(document.querySelector(".message").textContent);

document.querySelector(".number").textContent = 13;

document.querySelector(".score").textContent = 10;

document.querySelector(".guess").value = 23;

console.log(document.querySelector(".guess").value);
*/
//Math.random()// for random number in our code!

"use strict";

let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;

const displayMessage = function (message) {
  document.querySelector(".message").textContent = message;
};

document.querySelector(".check").addEventListener("click", function () {
  const guess = Number(document.querySelector(".guess").value);

  // When there is no input!
  if (!guess) {
    // document.querySelector(".message").textContent = "No Number";
    displayMessage("No number!");

    // When Player Wins
  } else if (guess === secretNumber) {
    document.querySelector(".message").textContent = "Correct Number!";
    document.querySelector(".number").textContent = secretNumber;

    document.querySelector("body").style.backgroundColor = "#60b347";
    document.querySelector(".number").style.width = "30rem";

    if (score > highscore) {
      highscore = score;
      document.querySelector(".highscore").textContent = highscore;
    }

    //WHEN GUESS IS WRONG
  } else if (guess !== secretNumber) {
    if (score > 1) {
      document.querySelector(".message").textContent =
        guess > secretNumber ? "Too High!" : "Too Low";
      score--;
      document.querySelector(".score").textContent = score;
    } else {
      document.querySelector(".message").textContent = "You Lost The Game!";
      document.querySelector(".score").textContent = 0;
      document.querySelector("body").style.backgroundColor = "red";
    }
  }

  //     //When Guess is too high
  //   } else if (guess > secretNumber) {
  //     if (score > 1) {
  //       document.querySelector(".message").textContent = "Too High!";
  //       score--;
  //       document.querySelector(".score").textContent = score;
  //     } else {
  //       document.querySelector(".message").textContent = "You Lost The Game!";
  //       document.querySelector(".score").textContent = 0;
  //     }

  //     //When Guess is too low
  //   } else if (guess < secretNumber) {
  //     if (score > 1) {
  //       document.querySelector(".message").textContent = "Too Low!";
  //       score--;
  //       document.querySelector(".score").textContent = score;
  //     } else {
  //       document.querySelector(".message").textContent = "You Lost The Game!";
  //       document.querySelector(".score").textContent = 0;
  //     }
  //   }
});

//PLAY AGAIN

document.querySelector(". btn again").addEventListener("click", function () {
  document.querySelector(".message").textContent = "Start Guessing...";
  score = 20;
  secretNumber = Math.trunc(Math.random() * 20) + 1;

  document.querySelector(".score").textContent = score;
  document.querySelector(".number").textContent = "?";
  document.querySelector(".guess").value = "";
  document.querySelector("body").style.backgroundColor = "#222";
  document.querySelector(".number").style.width = "15rem";
});
