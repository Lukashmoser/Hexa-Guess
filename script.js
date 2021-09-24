let colorSample = null; // the color sample element
let answers = []; // array of answer elements
let letters = ["a","b","c","d","e","f","g","h"]; // array of the id's for answers
let correctColorCode = null; // color code of actual color sample
let score = 0; // current score
let total = 10; // total questions
let questionsRun = 0; // questions run
let levelChosen = null; // level chosen
let modeChosen = null; // mode chosen
let numOptions = null; // number of color options
let questions = null; // number of current question

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

// initialize page
function initGame(){
    colorSample = document.getElementById("colorSample");
    if(modeChosen == "mode2"){
        document.getElementById("question").innerHTML = "What color does the code represent?";
    }
    // initialize array elements with all possible answers
    for(let i = 0; i < numOptions; i++){
        answers.push(document.getElementById(letters[i]));
        show(letters[i]);
    }
    // add onclick events to all possible answers
    for(let i = 0; i < numOptions; i++){
        answers[i].addEventListener('click', function(){
            markIt(this);
        });
    }
    // load a question
    loadNewQuestion();
};// window.onload

//mark current question
function markIt(elem){
    let gotItRight = false;
    questionsRun++;
    // check if answer is correct
    if(modeChosen == "mode1"){
        if(elem.innerHTML == correctColorCode){
            score++;
            gotItRight = true;
        }
    }
    if(modeChosen == "mode2"){
        console.log(elem.style.backgroundColor);
        correctColorCode = correctColorCode.replace('#','');
        if(elem.style.backgroundColor == correctColorCode.convertToRGB()){
            score++;
            gotItRight = true;
        }
    }
    
    if(questions < 10){
        questions = questionsRun + 1;    
    }
    
    document.getElementById("score").innerHTML = score + "/" + total;
    document.getElementById("questionsRun").innerHTML = questions + "/" + total;

    window.setTimeout(function(){
        document.getElementById("colorCode").innerHTML = "";
        if(gotItRight){
            document.getElementById("response").innerHTML = "Correct!";
        } else {
            document.getElementById("response").innerHTML = "Incorrect!";
        }
    }, 100);

    window.setTimeout(function(){
        if(questionsRun < 10){
            loadNewQuestion();
        } else {
            endGame();
        }
        
    } ,600);
}// markIt

String.prototype.convertToRGB = function(){
    if(this.length != 6){
        throw "Only six-digit hex colors are allowed.";
    }

    var aRgbHex = this.match(/.{1,2}/g);
    var aRgb = [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16)
    ];

    let code = "rgb(" + aRgb[0] + ", " + aRgb[1] + ", " + aRgb[2] + ")";
    
    return code;
}

// load a new question
function loadNewQuestion(){
    // set color or colorSample
    let colorCode = getRandomHexCode();
    document.getElementById("response").innerHTML = "";
    // mode1
    if(modeChosen == "mode1"){
        colorSample.style.backgroundColor = colorCode;
    }
    // mode2
    if(modeChosen == "mode2"){
        document.getElementById("colorCode").innerHTML = colorCode;
    }

    // pick a random location for correct answer
    let solution = Math.floor(Math.random() * numOptions);
    for(let i = 0; i < answers.length; i++){
        // mode1
        if(modeChosen == "mode1"){
            if(i == solution){
                answers[i].innerHTML = colorCode;
            } else {
                answers[i].innerHTML = getRandomHexCode();
            }
        }
        // mode2
        if(modeChosen == "mode2"){
            if(i == solution){
                answers[i].style.backgroundColor = colorCode;
            } else {
                answers[i].style.backgroundColor = getRandomHexCode();
            }
        }
    }

    // store correct answer
    correctColorCode = colorCode;
} // loadNewQuestion

function getRandomHexCode(){
    let result = []; // final codes
    let hexRef = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
    result.push("#");

    for(let n = 0; n < 6; n++){
        result.push(hexRef[Math.floor(Math.random() * 16)])
    }
    return result.join('') // #rrggbb
} // getRandomHexCode

function endGame(){
    hide("welcome");
    document.getElementById("message").innerHTML = "Your final score was " + score + "/" + total + ".";
    show("lightbox");
    show("endMessage");
}

// hide element
function hide(divId){
    document.getElementById(divId).style.display = "none";
}

// show element
function show(divId){
    document.getElementById(divId).style.display = "block";
}

function chooseLevel(choice){
    if(choice == "easy"){
        levelChosen = "easy";
        numOptions = 2;
    }
    if(choice == "normal"){
        levelChosen = "normal";
        numOptions = 4;
    }
    if(choice == "hard"){
        levelChosen = "hard";
        numOptions = 8;
    }
    hide("levelChoice");
    hide("lightbox");
    initGame();
}

function chooseMode(choice){
    if(choice == "mode1"){
        modeChosen = "mode1";
    }
    if(choice == "mode2"){
        modeChosen = "mode2";
    }
    hide("modeChoice");
    show("levelChoice");
}

function playAgain(){
    window.location.reload();
}

function rageQuit(){
    window.close();
}