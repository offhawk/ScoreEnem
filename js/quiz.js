//References
let timeLeft = document.querySelector(".time-left");
let quizContainer = document.getElementById("container");
let nextBtn = document.getElementById("next-button");
let countOfQuestion = document.querySelector(".number-of-question");
let displayContainer = document.getElementById("display-container");
let scoreContainer = document.querySelector(".score-container");
let restart = document.getElementById("restart");
let userScore = document.getElementById("user-score");
let startScreen = document.querySelector(".start-screen");
let startButton = document.getElementById("start-button");
let questionCount;
let scoreCount = 0;
let count = 11;
let countdown;
let addUser = [
    {
        marcado: 0,
        acerto: true

    }, 
    {
        marcado: 0,
        acerto: true
    }, 
    {
        marcado: 0,
        acerto: true
    }, 
    {
        marcado: 0,
        acerto: true
    }, 
    {
        marcado: 0,
        acerto: true
    }, 
    {
        marcado: 0,
        acerto: true
    }, 
    {
        marcado: 0,
        acerto: true
    }, 
    {
        marcado: 0,
        acerto: true
    }, 
    {
        marcado: 0,
        acerto: true
    }, 
    {
        marcado: 0,
        acerto: true
    }, 
    {
        marcado: 0,
        acerto: true
    }
];

firebase.auth().onAuthStateChanged(function(user){
    if(user) {
        preencheUser(user);
    }
    else{
        window.location.href = 'login.html?logado=0'
    }
});

let user = {}
let userRef

function preencheUser(u) {
    firebase.firestore().collection('usuario').doc(u.uid).get().then((snapshot => {
        user = snapshot.data();
    }));

    userRef = firebase.firestore().collection('usuario').doc(u.uid);
}

/* Questions and Options array
const quizArray = [
    {
        id: "0",
        question: "Which is the most widely spoken language in the world?",
        options: ["Spanish", "Mandarin", "English", "German"],
        correct: "Mandarin",
    },
    {
        id: "1",
        question: "Which is the only continent in the world without a desert?",
        options: ["North America", "Asia", "Africa", "Europe"],
        correct: "Europe",
    },
    {
        id: "2",
        question: "Who invented Computer?",
        options: ["Charles Babbage", "Henry Luce", "Henry Babbage", "Charles Luce"],
        correct: "Charles Babbage",
    },
    {
        id: "3",
        question: "What do you call a computer on a network that requests files from another computer?",
        options: ["A client", "A host", "A router", "A web server"],
        correct: "A client",
    },
    {
        id: "4",
        question: "Hardware devices that are not part of the main computer system and are often added later to the system.",
        options: ["Peripheral", "Clip art", "Highlight", "Execute"],
        correct: "Peripheral",
    },
    {
        id: "5",
        question: "The main computer that stores the files that can be sent to computers that are networked together is:",
        options: ["Clip art", "Mother board", "Peripheral", "File server"],
        correct: "File server",
    }, {
        id: "6",
        question: "How can you catch a computer virus?",
        options: ["Sending e-mail messages", "Using a laptop during the winter", "Opening e-mail attachments", "Shopping on-line"],
        correct: "Opening e-mail attachments",
    },
    {
        id: "7",
        question: "Google (www.google.com) is a:",
        options: ["Search Engine", "Number in Math", "Directory of images", "Chat service on the web"],
        correct: "Search Engine",
    },
    {
        id: "8",
        question: "Which is not an Internet protocol?",
        options: ["HTTP", "FTP", "STP", "IP"],
        correct: "STP",
    },
    {
        id: "9",
        question: "Which of the following is not a valid domain name?",
        options: ["www.yahoo.com", "www.yahoo.co.uk", "www.com.yahoo", "www.yahoo.co.in"],
        correct: "www.com.yahoo",
    },
]; */

let quizArray = []

firebase.firestore().collection('questoes').orderBy('ano').get().then((snapshot => {
    snapshot.forEach((doc) => {
        quizArray.push(doc.data());
    })
}));

//Restart Quiz
restart.addEventListener("click", () => {
    initial();
    displayContainer.classList.remove("hide");
    scoreContainer.classList.add("hide");
});

let responderBtn = document.querySelector('#responder-button')

responderBtn.addEventListener('click', checaOpcao)

function checaOpcao() {
    if (opcaoMarcada) {
        checker(opcaoMarcada)
        console.log("1")
    }
}



//Next Button
nextBtn.addEventListener(
    "click",
    (displayNext = () => {
        //increment questionCount
        questionCount += 1;
        //if last question
        if (questionCount == quizArray.length) {
            //hide question container and display score
            displayContainer.classList.add("hide");
            scoreContainer.classList.remove("hide");
            //user score
            userScore.innerHTML =
                "Você acertou " + scoreCount + " de " + questionCount + " questões.";
            atualizaUser();
        } else {
            //display questionCount
            countOfQuestion.innerHTML =
                questionCount + 1 + " de " + quizArray.length + " Questões";
            //display quiz
            quizDisplay(questionCount);
            // count = 90;
            clearInterval(countdown);
            nextBtn.toggleAttribute('disabled');
            // timerDisplay();
        }
    })
);
/* Timer
const timerDisplay = () => {
    countdown = setInterval(() => {
        count--;
        timeLeft.innerHTML = `${count}s`;
        if (count == 0) {
            clearInterval(countdown);
            displayNext();
        }
    }, 1000);
}; */

//Display quiz
const quizDisplay = (questionCount) => {
    let quizCards = document.querySelectorAll(".container-mid");
    //Hide other cards
    quizCards.forEach((card) => {
        card.classList.add("hide");
    });
    //display current question card
    quizCards[questionCount].classList.remove("hide");
};

//Quiz Creation
function quizCreator() {
    //randomly sort questions
    quizArray.sort(() => Math.random() - 0.5);
    //generate quiz
    for (let i of quizArray) {
        //randomly sort options
        i.alternativas.sort(() => Math.random() - 0.5);
        //quiz card creation
        let div = document.createElement("div");
        div.classList.add("container-mid", "hide");
        //question number
        countOfQuestion.innerHTML = 1 + " de " + quizArray.length + " Questões";
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
        quizContainer.appendChild(div);
    }

    questoes = quizArray;

}

let opcaoMarcada;

function marcado(opcao) {
    let options = document.querySelectorAll(".option-div");
    options.forEach((opc) => {
        opc.classList.remove("marcado");
    })
    opcao.classList.add("marcado");
    opcaoMarcada = opcao;
}

//Checker Function to check if option is correct or not
function checker(userOption) {
    let userSolution = userOption.innerText;
    let question =
        document.getElementsByClassName("container-mid")[questionCount];
    let options = question.querySelectorAll(".option-div");
    addUser[questionCount].marcado = userSolution;
    //if user clicked answer == correct option stored in object
    if (userSolution === quizArray[questionCount].correta) {
        userOption.classList.add("correct");
        scoreCount++;
        addUser[questionCount].acerto = true;
    } else {
        userOption.classList.add("incorrect");
        addUser[questionCount].acerto = false;
        //For marking the correct option
        options.forEach((element) => {
            if (element.innerText == quizArray[questionCount].correta) {
                element.classList.add("correct");
            }
        });
    }
    nextBtn.toggleAttribute('disabled');
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
    // count = 11;
    clearInterval(countdown);
    // timerDisplay();
    quizCreator();
    quizDisplay(questionCount);
    nextBtn.setAttribute('disabled', "");
}
//when user click on start button
startButton.addEventListener("click", () => {
    startScreen.classList.add("hide");
    displayContainer.classList.remove("hide");
    initial();
});
//hide quiz and display start screen
window.onload = () => {
    startScreen.classList.remove("hide");
    displayContainer.classList.add("hide");
};

function atualizaUser() {

    let addUser2 = [{...addUser, quizArray}]

    userRef.update({
        historico: firebase.firestore.FieldValue.arrayUnion(...addUser2)
    }); 

}