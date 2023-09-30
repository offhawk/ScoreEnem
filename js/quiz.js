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
let imgResult = document.querySelector('#img-result');
let questionCount;
let scoreCount = 0;
let count = 20;
let countdown;
let userPlayed = 0;
let userCorrect = 0;
let userWrong = 0;

firebase.auth().onAuthStateChanged(function(user){
    if(user) {
        preencheUser(user);
        preencheClassificacao('#table-class')
    }
    else{
        window.location.href = 'login.html?logado=0'
    }
});

let user = {}
let userRef

function preencheUser(u) {
    firebase.firestore().collection('usuario').where('uid', '==', u.uid).get().then((snapshot => {
        snapshot.forEach((doc) => {
            user = doc.data();
        })
    }));

    userRef = firebase.firestore().collection('usuario').where('uid', '==', u.uid).get();
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

//Restart Quiz
restart.addEventListener("click", () => {
    startScreen.classList.remove("hide");
    displayContainer.classList.add("hide");
    scoreContainer.classList.add("hide")

    quizArray = []
});

let responderBtn = document.querySelector('#responder-button')

responderBtn.addEventListener('click', checaOpcao)

function checaOpcao() {
    if (opcaoMarcada) {
        checker(opcaoMarcada)
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
            let media = (scoreCount * 100) / questionCount;
            if(media >= 60 && scoreCount > 0){
                imgResult.src = '../imgs/Correto.png';
                document.querySelector('#score-result').classList.add('correct')
                
            } else{
                imgResult.src = '../imgs/Errado.png';
                document.querySelector('#score-result').classList.add('incorrect')
            }

            firebase.firestore().collection('classificacao').where('usuario.id', '==', user.uid).get().then((snapshot => {
        
                if(snapshot.empty){
                    console.log('vazio')

                    firebase.firestore().collection("classificacao").add({
                        correto: userCorrect,
                        incorreto: userWrong,
                        jogado: userPlayed,
                        rating: 0,
                        usuario: { id: user.uid, nome: user.nome}
                    })
                    .then((docRef) => {
    
    
                        docRef.get().then((shot => {
                            let b = shot.data();
    
                            
                            docRef.update({
                                rating: Math.round((b.correto * 100) / b.jogado)
                            })
                        }))
    
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });
                } else {
                    snapshot.forEach((doc) => {
                        doc.ref.update({
                             correto: firebase.firestore.FieldValue.increment(userCorrect),
                             incorreto: firebase.firestore.FieldValue.increment(userWrong),
                             jogado: firebase.firestore.FieldValue.increment(userPlayed),
                        })
     
                        let a = doc.data();
     
                         doc.ref.update({
                             rating: Math.round((a.correto * 100) / a.jogado)
                         })
                     })
                }

            }));

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
    let question = document.getElementsByClassName("container-mid")[questionCount];
    let options = question.querySelectorAll(".option-div");
    userPlayed++;
    //if user clicked answer == correct option stored in object
    if (userSolution === quizArray[questionCount].correta) {
        userOption.classList.add("correct");
        scoreCount++;
        userCorrect++;
    } else {
        userOption.classList.add("incorrect");
        //For marking the correct option
        options.forEach((element) => {
            if (element.innerText == quizArray[questionCount].correta) {
                element.classList.add("correct");
            }
        });
        userWrong++
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

    userPlayed = 0;
    userCorrect = 0;
    userWrong = 0;

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

    let materiaVal = document.querySelector('#sel-mat').value;
    let qtdeVal = document.querySelector('#sel-qtde').value;

    console.log(materiaVal + " " + qtdeVal)

    if(materiaVal == "Qualquer"){
        firebase.firestore().collection('questoes').orderBy('ano').limit(qtdeVal).get().then((snapshot => {
            snapshot.forEach((doc) => {
                quizArray.push(doc.data());
            })
            startScreen.classList.add("hide");
            displayContainer.classList.remove("hide");
            initial();
        }));
    } else {
        firebase.firestore().collection('questoes').orderBy('ano').where('mat', '==', materiaVal).limit(qtdeVal).get().then((snapshot => {
            snapshot.forEach((doc) => {
                quizArray.push(doc.data());
            })
            startScreen.classList.add("hide");
            displayContainer.classList.remove("hide");
            initial();
        }));
    }

});
//hide quiz and display start screen
window.onload = () => {
    startScreen.classList.remove("hide");
    displayContainer.classList.add("hide");
};

function atualizaUser() {

    preencheClassificacao('#table-class-2')

}

function preencheClassificacao(table) {
    
    let classArray = []
    let tableEl = document.querySelector(table);
    firebase.firestore().collection('classificacao').orderBy('rating', 'desc').get().then((snapshot => {
        let index = 0;

        snapshot.forEach((doc) => {
            let user = doc.data();
            index++;
            tableEl.innerHTML +=    `<tr>
                                        <th scope="row">${index}</th>
                                        <td>${user.usuario.nome.split(' ')[0]}</td>
                                        <td>${user.jogado}</td>
                                        <td>${user.incorreto}</td>
                                        <td>${user.correto}</td>
                                        <td>${user.rating}</td>
                                    </tr>`
        })
    }));


}