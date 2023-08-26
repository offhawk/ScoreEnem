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
let paginas = 1;
let btnFiltro = document.querySelector('#btn-filtro');

showLoading();

firebase.firestore().collection('questoes').orderBy('ano').limit(10).get().then((snapshot => {
    snapshot.forEach((doc) => {
        quizArray.push(doc.data());
    })

    lastVisible = snapshot.docs[snapshot.docs.length-1];
    console.log("last", lastVisible);

    // Construct a new query starting at this document,
    // get the next 25 cities.
    next = firebase.firestore().collection("questoes")
            .orderBy("ano")
            .startAfter(lastVisible)
            .limit(10);

    next.get().then((document => {
        document.forEach((doc) => {
            quizArray.push(doc.data());
        })
    }))

    if(quizArray){
        preenchePaginas()
        hideLoading()
        initial()
    }
}));




function preenchePaginas() {
    if(quizArray.length > 10){
        paginas = Math.round(quizArray / 10)
    }
}

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

        let img = document.createElement("div");
        img.classList.add("correct-answer", "display-none");
        img.innerHTML = '<?xml version="1.0" ?><svg height="48px" version="1.1" viewBox="0 0 48 48" width="48px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title/><desc/><g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"><g id="Artboard-Copy" transform="translate(-407.000000, -489.000000)"><path d="M424.125092,520.374775 L419.548425,515.869775 C418.815925,515.148942 418.815925,513.978108 419.548425,513.258942 L421.537592,511.301442 C422.266758,510.581442 423.454258,510.581442 424.183425,511.301442 L427.562592,514.626442 L438.814258,503.542275 C439.546758,502.821442 440.733425,502.821442 441.464258,503.542275 L443.450925,505.498942 C444.181758,506.219775 444.181758,507.386442 443.450925,508.108108 L428.879258,522.459775 C428.148425,523.180608 426.961758,523.180608 426.229258,522.459775 L424.244258,520.503942 L424.125092,520.374775 L424.125092,520.374775 Z" fill="#000000" id="check2"/><g id="slices" transform="translate(47.000000, 9.000000)"/></g></g></svg>'
        div.appendChild(img)

        let img2 = document.createElement("div");
        img2.classList.add("wrong-answer", "display-none");
        img2.innerHTML = `<?xml version="1.0" ?><!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 1.1//EN'  'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'><svg height="512px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M437.5,386.6L306.9,256l130.6-130.6c14.1-14.1,14.1-36.8,0-50.9c-14.1-14.1-36.8-14.1-50.9,0L256,205.1L125.4,74.5  c-14.1-14.1-36.8-14.1-50.9,0c-14.1,14.1-14.1,36.8,0,50.9L205.1,256L74.5,386.6c-14.1,14.1-14.1,36.8,0,50.9  c14.1,14.1,36.8,14.1,50.9,0L256,306.9l130.6,130.6c14.1,14.1,36.8,14.1,50.9,0C451.5,423.4,451.5,400.6,437.5,386.6z"/></svg>`
        div.appendChild(img2)

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
    hideLoading()
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
        question.querySelector('.correct-answer').classList.remove('display-none')
        scoreCount++;
    } else {
        userOption.classList.add("incorrect");
        //For marking the correct option
        question.querySelector('.wrong-answer').classList.remove('display-none')
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

btnFiltro.addEventListener('click', filtrarQuestoes);

function filtrarQuestoes() {
    showLoading()

    let materiaVal = document.querySelector('#sel-mat').value;

    quizArray = []
    
    if(materiaVal == 'Qualquer'){
        firebase.firestore().collection('questoes').orderBy('ano').limit().get().then((snapshot => {
            snapshot.forEach((doc) => {
                quizArray.push(doc.data());
            })
            initial()
        }))
    } else {
        firebase.firestore().collection('questoes').orderBy('ano').where('mat', '==', materiaVal).limit().get().then((snapshot => {
            snapshot.forEach((doc) => {
                quizArray.push(doc.data());
            })
            initial()
        }))
    }
    
}