const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
't', 'u', 'v', 'w', 'x', 'y', 'z'];
var correctlyGuessedLetters = [];
var numLives = 6;
var currentFile = window.location.pathname.split("/").pop();
var guessedLetters = [];
var answer;
const wordBank = {"Sports": ["tom brady", "celtics", "lebron james"], 
"Recondite Knowledge": ["jennifer lopez", "blue whale", "ostrich"], 
"Places": ["mongolia", "vatican city", "machu picchu"]};
const categories = ["Sports", "Recondite Knowledge", "Places"];
const hintBank = {"tom brady" : "Quarterback that has won the most SuperBowls", 
"celtics" : "Franchise that has won the most NBA championships",
"lebron james" : "The NBA's all-time leading scorer", 
"jennifer lopez" : "The inspiration behind the creation of Google Images",
"blue whale" : "The animal whose heart weight over 400 pounds",
"ostrich" : "This animal has eyes bigger than its brain",
"mongolia" : "The world's sparsest population",
"vatican city" : "This country is 120 times smaller than Manhattan",
"machu picchu" : "This place very well-preserved and is 75% its original"};

// generates a new word
function generateWord() {
    numLives = 6;
    document.getElementById("lives").innerHTML = "Lives Left: " + numLives; 
    drawHangman();
    guessedLetters = [];
    document.getElementById("guessedBox").innerHTML = "Guessed Letters: " + guessedLetters;
    correctlyGuessedLetters = [];
    document.getElementById("hint").innerHTML = "";
    if (currentFile === "sports.html") {
        answer = wordBank["Sports"][Math.floor(Math.random() * categories.length)];
    } else if (currentFile === "recondite.html") {
        answer = wordBank["Recondite Knowledge"][Math.floor(Math.random() * categories.length)];
    } else if (currentFile === "places.html") {
        answer = wordBank["Places"][Math.floor(Math.random() * categories.length)];
    }
    var formattedAnswer = answer.split(" ");
    var append = "";
    for (var i = 0; i < formattedAnswer.length; ++i) {
        append += "_\u00A0".repeat(formattedAnswer[i].length) + "\u00A0\u00A0\u00A0\u00A0";
    }
    document.getElementById("setup").innerText = append; 
}

// prints a hint for the according answer
function getHint() {
    document.getElementById("hint").innerHTML = "Hint: " + hintBank[answer];
}

// handles valid/invalid guesses
function guess() {
    var count = document.getElementById("setup").innerText;
    var formattedAnswer = answer.split(" ");
    var currentGuess = document.getElementById("letterGuess").value.toLowerCase();
    if (!alphabet.includes(currentGuess)) {
        alert("Invalid input - please enter one letter at a time!");
    } else if (guessedLetters.includes(currentGuess)) {
        alert("You've already guessed this letter. Try Again!")
    } else {
        guessedLetters.push(currentGuess);
    
        document.getElementById("letterGuess").value = "";
        document.getElementById("guessedBox").innerHTML = "Guessed Letters: " + guessedLetters;
        var oldLength = correctlyGuessedLetters.length;
        for (var i = 0; i < formattedAnswer.length; ++i) {
            for (var j = 0; j < formattedAnswer[i].length; ++j) {
                if (formattedAnswer[i][j] === currentGuess) {
                    if (i === 0) {
                        var firstPart = count.substring(0, j * 2);
                        var secondPart = count.substring((j * 2) + 1);
                        count = firstPart + currentGuess + secondPart;
                    } else if (i === 1) {
                        var firstPart = count.substring(0, (j * 2) + 4 + (formattedAnswer[0].length * 2));
                        var secondPart = count.substring((j * 2) + 4 + (formattedAnswer[0].length * 2) + 1);
                        count = firstPart + currentGuess + secondPart;
                    }
                    correctlyGuessedLetters.push(currentGuess);
                }
            }
        }
        if (correctlyGuessedLetters.length === oldLength) {
            numLives--;
            drawHangman();
            document.getElementById("lives").innerHTML = "Lives Left: " + numLives;
        } 
        oldLength = correctlyGuessedLetters.length;
        document.getElementById("setup").innerText = count;
        endGame();
    }
}

function endGame() {
    var formattedAnswer = answer.split(" ").join("");
    if (numLives === 0) {
        document.getElementById("endCard").innerHTML = "You ran out of lives :( Click Home to Play Again!";
        document.getElementById("endCard").style.fontSize = "x-large";
        document.getElementById("endCard").style.marginTop = "50px";
        document.getElementById("endCard").style.backgroundColor = "red";
    } else if (correctlyGuessedLetters.length === formattedAnswer.length) {
        document.getElementById("endCard").innerHTML = "Congratulations, you have successfully avoided being hung!";
        document.getElementById("endCard").style.fontSize = "x-large";
        document.getElementById("endCard").style.marginTop = "50px";
        document.getElementById("endCard").style.backgroundColor = "green";
    }
}

// draw hangman in iterations proportional to the number of lives remaining
function drawHangman() {
    const canvas = document.getElementById("hangmanDrawing");
    const drawObject = canvas.getContext("2d");
    drawObject.fillStyle = "black";
    if (numLives === 6) {
        drawObject.clearRect(0, 0, 600, 400);
        drawObject.beginPath();
        drawObject.fillRect(20, 132, 200, 10);
        drawObject.fillRect(40, 132, 10, -125);
        drawObject.fillRect(50, 7, 110, 10);
        drawObject.fillRect(130, 17, 5, 15);
        drawObject.stroke();
    }
    //draw array starts
    drawObject.fillStyle = "#48CAE4";
    drawObject.beginPath();
    if (numLives === 5) {
        drawObject.arc(133, 47, 15, 0, 2 * Math.PI);
        drawObject.fill();
    } else if (numLives === 4) {
        drawObject.fillRect(130, 62, 5, 32);
    } else if (numLives === 3) {
        drawObject.rotate((45 * Math.PI) / 180);
        drawObject.fillRect(145, -60, 5, 22);
    } else if (numLives === 2) {
        drawObject.rotate((-90 * Math.PI) / 180);
        drawObject.fillRect(37, 127, 5, 22);
    } else if (numLives === 1) {
        drawObject.rotate((-90 * Math.PI) / 180);
        drawObject.fillRect(-159, 9, 5, 22);
    }
    drawObject.stroke();
}

function initializePage() {
    generateWord();
    drawHangman();
}

function openForm() {
    document.getElementById("myForm").style.display = "block";
}
  
function closeForm() {
    document.getElementById("myForm").style.display = "none";
}