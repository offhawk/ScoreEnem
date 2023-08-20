//References
let timeLeft = document.querySelector(".time-left");
let quizContainer = document.getElementById("container");
let nextBtn = document.getElementById("next-button");
let countOfQuestion = document.querySelector(".desc");
let displayContainer = document.getElementById("display-container");
let scoreContainer = document.querySelector(".score-container");
let userScore = document.getElementById("user-score");
let questionCount;
let scoreCount = 0;
let count = 11;
let countdown;
//Questions and Options array
let quizArray = []

firebase.firestore().collection('questoes').orderBy('ano').get().then((snapshot => {
    snapshot.forEach((doc) => {
        quizArray.push(doc.data());
    })
    if(quizArray){
        hideLoading()
        initial()
    }
}));

//Next Button

//Display quiz
const quizDisplay = (questionCount) => {
    let quizCards = document.querySelectorAll(".container-mid");
    //Hide other cards
    quizCards.forEach((card) => {
        card.classList.remove("hide");
    });
    //display current question card
    quizCards[questionCount].classList.remove("hide");
};
//Quiz Creation
function quizCreator() {
    //randomly sort questions
    quizArray.sort(() => Math.random() - 0.5);
    //generate quiz
    let id = 0;
    for (let i of quizArray) {
        //randomly sort options
        i.alternativas.sort(() => Math.random() - 0.5);
        //quiz card creation
        let div = document.createElement("div");
        div.classList.add("container-mid");

        let divHeader = document.createElement("div");
        divHeader.classList.add('header')
        div.appendChild(divHeader);

        let divDescQuestion = document.createElement("div");
        divDescQuestion.classList.add('desc-question')
        divHeader.appendChild(divDescQuestion);

        let divDesc = document.createElement("span");
        divDesc.classList.add('desc')
        divDescQuestion.appendChild(divDesc);

        //question number
        divDesc.innerHTML = "<span>" + i.prova + "</span><span>" +  i.mat + "</span><span>" + i.descricao + "</span>";
        //question
        let question_DIV = document.createElement("p");
        question_DIV.classList.add("question");
        question_DIV.innerHTML = i.questao;
        div.appendChild(question_DIV);
        //options
        div.innerHTML += `
        <button class="option-div" onclick="marcado(this)">${i.alternativas[0]}</button>
        <button class="option-div" onclick="marcado(this)">${i.alternativas[1]}</button>
        <button class="option-div" onclick="marcado(this)">${i.alternativas[2]}</button>
        <button class="option-div" onclick="marcado(this)">${i.alternativas[3]}</button>
        <button class="option-div" onclick="marcado(this)">${i.alternativas[4]}</button>
    `;
        
        div.innerHTML += `<button class="responder-button" onclick="checaOpcao(this, `+ "'" + i.questao + "'" +`)">Responder</button>`
        quizContainer.appendChild(div);
    }
}

let responderBtn = document.querySelectorAll('.responder-button')

let opcaoMarcada;

function marcado(opcao) {
    let options = document.querySelectorAll(".option-div");
    options.forEach((opc) => {
        opc.classList.remove("marcado");
    })
    opcao.classList.add("marcado");
    opcaoMarcada = opcao;
}


function checaOpcao(btn, id) {

    let div = btn.parentNode
    opcaoMarcada = div.querySelector(".marcado")

    if (opcaoMarcada) {
        checker(opcaoMarcada, div, id)
    }
}


//Checker Function to check if option is correct or not
function checker(userOption, question, questionCount) {
    let userSolution = userOption.innerText;
    let options = question.querySelectorAll(".option-div");
    let quiz = quizArray.find((quizz) => quizz.questao == questionCount)
    //if user clicked answer == correct option stored in object
    if (userSolution === quiz.correta) {
        userOption.classList.add("correct");
        scoreCount++;
    } else {
        userOption.classList.add("incorrect");
        //For marking the correct option
        options.forEach((element) => {
            if (element.innerText == quiz.correta) {
                element.classList.add("correct");
            }
        });
    }
    //clear interval(stop timer)
    clearInterval(countdown);
    //disable all options
    options.forEach((element) => {
        element.disabled = true;
    });
}
//initial setup
function initial() {
    quizContainer.innerHTML = "";
    questionCount = 0;
    scoreCount = 0;
    clearInterval(countdown);
    quizCreator();
    quizDisplay(questionCount);
}
//when user click on start button
//hide quiz and display start screen
