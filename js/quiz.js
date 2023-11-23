//References
let timeLeft = document.querySelector(".time-left");
let quizContainer = document.getElementById("container");
let nextBtn = document.getElementById("next-button");
let countOfQuestion = document.querySelector(".number-of-question");
let displayContainer = document.getElementById("display-container");
let scoreContainer = document.querySelector(".score-container");
let restart = document.getElementById("restart");
let challenge = document.getElementById("challenge");
let userScore = document.getElementById("user-score");
let startScreen = document.querySelector(".start-screen");
let startButton = document.getElementById("start-button");
let imgResult = document.querySelector('#img-result');
let modalAmigos = document.querySelector('#modal-amigos');
let searchEl = document.querySelector('#input-search-friends');
let searchIconEl = document.querySelector('#friends-icon-search');
let addIconEl = document.querySelector('#friends-icon-add');
let searchDivEl = document.querySelector('#search-list');
let friendsDivEl = document.querySelector('#friends-list');
let infoEl = document.querySelectorAll('.friends-info-p');
let infoDesEl = document.querySelectorAll('.desafios-info-p');
let searchListEl = document.querySelector('#search-ul');
let friendsListEl = document.querySelector('#friends-ul');
let desafiosListEl = document.querySelector('#desafios-list');
let historicoListEl = document.querySelector('#historico-list');
let questionCount;
let scoreCount = 0;
let count = 20;
let countdown;
let userPlayed = 0;
let userCorrect = 0;
let userWrong = 0;
let isDesafio = false;
let desafioArray = [];
let desafioRef;

firebase.auth().onAuthStateChanged(function(user){
    if(user) {
        preencheUser(user);
        preencheClassificacao('#table-class')
        fetchUserData(firebase.auth().currentUser)
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
            if(isDesafio){
                if(scoreCount > desafioArray.acertos){
                    imgResult.src = '../imgs/Correto.png';
                    document.querySelector('#score-result').classList.add('correct')
                    userScore.innerHTML = "Parabéns! Você venceu.";
                    desafioRef.update({
                        vencedor: desafioArray.desafiado,
                        status: true
                    })
                } else if (scoreCount == desafioArray.acertos) {
                    imgResult.src = '../imgs/Errado.png';
                    document.querySelector('#score-result');
                    userScore.innerHTML = "Vocês empataram.";
                    desafioRef.update({
                        vencedor: 'empate',
                        status: true
                    })
                } else if (scoreCount < desafioArray.acertos) {
                    imgResult.src = '../imgs/Errado.png';
                    document.querySelector('#score-result').classList.add('incorrect')
                    userScore.innerHTML = "Não foi dessa vez. Você perdeu.";
                    desafioRef.update({
                        vencedor: desafioArray.enviado,
                        status: true
                    })
                }

                document.querySelector('#result-class').style.display = 'none';
                document.querySelector('#comparacao').classList.remove('hidden');

                firebase.firestore().collection('usuario').doc(desafioArray.enviado).get().then((doc) => {
                    let userEnviado = doc.data();
                    document.querySelector('#comparacao').innerHTML = `<p>${userEnviado.nome} acertou ${desafioArray.acertos} de ${questionCount} questões.</p>
                                                                            <p>Você acertou ${scoreCount} de ${questionCount} questões.</p>`;
                })
                document.querySelector('#comparacao').innerHTML = "";

            } else {
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

                userScore.innerHTML = `<p>Você acertou ${scoreCount} de ${questionCount} questões.</p>`;
                
            }

            
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
function quizCreator(desafio) {

    console.log('creator')

    if(!desafio){
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
    } else {
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
function initial(desafio) {

    userPlayed = 0;
    userCorrect = 0;
    userWrong = 0;

    quizContainer.innerHTML = "";
    questionCount = 0;
    scoreCount = 0;
    // count = 11;
    clearInterval(countdown);
    // timerDisplay();
    quizCreator(desafio);
    quizDisplay(questionCount);
    nextBtn.setAttribute('disabled', "");
}
//when user click on start button
startButton.addEventListener("click", () => {

    let materiaVal = document.querySelector('#sel-mat').value;
    let qtdeVal = document.querySelector('#sel-qtde').value;

    console.log(materiaVal + " " + qtdeVal)

    if(materiaVal == "Qualquer"){
        firebase.firestore().collection('questoes').limit(qtdeVal).get().then((snapshot => {
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
            fetchUserData(firebase.auth().currentUser)
            initial();
        }));
    }

});
//hide quiz and display start screen
window.onload = () => {

    if(localStorage.getItem("theme") == null){
        localStorage.setItem("theme", "light");
    } else {
        theme = localStorage.getItem("theme");
        document.querySelector('body').setAttribute('data-theme', theme);
    }

    startScreen.classList.remove("hide");
    displayContainer.classList.add("hide");
};

function atualizaUser() {

    setTimeout(() => {
        preencheClassificacao('#table-class-2')
        fetchUserData(firebase.auth().currentUser)
    }, 300);

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

function fetchUserData(user) {
    firebase.firestore()
      .collection("usuario")
      .where("uid", "==", user.uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var userData = doc.data();
            amigos = userData.amigos;
            desafios = userData.desafios;
            console.log(amigos)
            let amigosEl = "<p>Nenhum amigo encontrado.</p>";
            if(amigos != null){
                friendsListEl.innerHTML = "";
                amigos.forEach((friend) => {
                    firebase.firestore().collection('usuario').doc(friend).get().then((doc) => {

                        let amigoDoc = doc.data()

                        friendsListEl.innerHTML += `<li>
                                                <div class="friends-box" data-username="${amigoDoc.username}">
                                                    <div class="img-wrapper">
                                                        <img src="${amigoDoc.imgURL}">
                                                    </div>
                                                    <div class="friends-info">
                                                        <p class="friends-name">${amigoDoc.nome}</p>
                                                        <p class="friends-username">${amigoDoc.username}</p>
                                                    </div>
                                                    <div class="svg-wrapper" onclick="desafiarAmigo(this.parentElement)">
                                                        <?xml version="1.0"?><svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"/><path d="M7.05 13.406l3.534 3.536-1.413 1.414 1.415 1.415-1.414 1.414-2.475-2.475-2.829 2.829-1.414-1.414 2.829-2.83-2.475-2.474 1.414-1.414 1.414 1.413 1.413-1.414zM3 3l3.546.003 11.817 11.818 1.415-1.414 1.414 1.414-2.474 2.475 2.828 2.829-1.414 1.414-2.829-2.829-2.475 2.475-1.414-1.414 1.414-1.415L3.003 6.531 3 3zm14.457 0L21 3.003l.002 3.523-4.053 4.052-3.536-3.535L17.457 3z" fill-rule="nonzero"/></g></svg>
                                                    </div>
                                                </div></li>`
                    })
                })
            } else friendsListEl.innerHTML = "<p>Nenhum amigo encontrado.</p>";

            let desafiosUser = 0;

            if(desafios != null){
                desafiosListEl.innerHTML = "<p>Nenhum Desafio encontrado. Jogue agora mesmo!</p>";
                desafios.forEach((desafio) => {
                    firebase.firestore().collection('desafio').doc(desafio).get().then((doc) => {

                        let desafioDoc = doc.data();

                        if(desafioDoc.desafiado == userData.uid){
                            if(!desafioDoc.status){
                                desafiosListEl.innerHTML = ""
                                firebase.firestore().collection('usuario').doc(desafioDoc.enviado).get().then((doc2) => {

                                    let amigoDoc = doc2.data()
            
                                    desafiosListEl.innerHTML += `<li>
                                                                    <div class="friends-box" data-desafioId="${doc.ref.id}">
                                                                        <div class="img-wrapper">
                                                                            <img src="${amigoDoc.imgURL}">
                                                                        </div>
                                                                        <div class="friends-info">
                                                                            <p class="friends-name">${amigoDoc.nome}</p>
                                                                            <p class="friends-username">${desafioDoc.quiz.length} Questões</p>
                                                                            <p class="friends-username">${desafioDoc.acertos} Acertos</p>
                                                                        </div>
                                                                        <div class="svg-wrapper">
                                                                            <?xml version="1.0" ?><!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 1.1//EN'  'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'><svg class="accept" data-id="${doc.ref.id}" onclick="aceitarDesafio(this)" enable-background="new 0 0 32 32" height="32px" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M30.171,6.131l-0.858-0.858c-0.944-0.945-2.489-0.945-3.433,0L11.294,19.859l-5.175-5.174  c-0.943-0.944-2.489-0.944-3.432,0.001l-0.858,0.857c-0.943,0.944-0.943,2.489,0,3.433l7.744,7.75c0.944,0.945,2.489,0.945,3.433,0  L30.171,9.564C31.112,8.62,31.112,7.075,30.171,6.131z"/></svg>
                                                                            <?xml version="1.0" ?><!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 1.1//EN'  'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'><svg class="decline" data-id="${doc.ref.id}" onclick="recusarDesafio(this)"  enable-background="new 0 0 32 32" height="32px" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M20.377,16.519l6.567-6.566c0.962-0.963,0.962-2.539,0-3.502l-0.876-0.875c-0.963-0.964-2.539-0.964-3.501,0  L16,12.142L9.433,5.575c-0.962-0.963-2.538-0.963-3.501,0L5.056,6.45c-0.962,0.963-0.962,2.539,0,3.502l6.566,6.566l-6.566,6.567  c-0.962,0.963-0.962,2.538,0,3.501l0.876,0.876c0.963,0.963,2.539,0.963,3.501,0L16,20.896l6.567,6.566  c0.962,0.963,2.538,0.963,3.501,0l0.876-0.876c0.962-0.963,0.962-2.538,0-3.501L20.377,16.519z" /></svg>
                                                                        </div>
                                                                    </div>
                                                                </li>`;
    
    
                                })
                            } else {
                                firebase.firestore().collection('usuario').doc(desafioDoc.enviado).get().then((doc2) => {

                                    let amigoDoc = doc2.data()
                                    let vencedor;

                                    if(desafioDoc.vencedor == userData.uid){
                                        vencedor = userData.nome
                                    } else if(desafioDoc.vencedor == amigoDoc.uid){
                                        vencedor = amigoDoc.nome
                                    } else vencedor = "Empate";

                                    historicoListEl.innerHTML += `<li>
                                                                    <div class="friends-box" data-desafioId="${doc.ref.id}">
                                                                        <div class="img-wrapper">
                                                                            <img src="${userData.imgURL}">
                                                                        </div>
                                                                        <div class="friends-info">
                                                                            <p class="friends-name">${vencedor}</p>
                                                                            <p class="friends-username">Vencedor</p>
                                                                        </div>
                                                                        <div class="img-wrapper">
                                                                            <img src="${amigoDoc.imgURL}">
                                                                        </div>
                                                                    </div>
                                                                </li>`;
    
    
                                })
                            }
                        } else {
                            desafiosUser++;
                        }
                       
                    })
                })
            }


            hideLoading()
        });
      })
      .catch(function (error) {
        console.log("Erro ao buscar informações do usuário:", error);
        hideLoading()
      });
}


let modoPesquisa = 0;

infoEl.forEach((info) => {
    info.addEventListener('click', alteraPesquisa);
})

infoDesEl.forEach((info) => {
    info.addEventListener('click', alteraDesafio);
})

infoDesEl[0].style.setProperty('--width', '100%');
infoEl[0].style.setProperty('--width', '100%');

searchEl.addEventListener('change', pesquisaAmigo);
searchIconEl.addEventListener('click', pesquisaAmigo);

function alteraPesquisa(e) {

    if(e.target.innerHTML == "Adicionar Amigo"){
        modoPesquisa = 1;
        let style = infoEl[1].style;
        style.setProperty('--width', '100%');
        style = infoEl[0].style;
        style.setProperty('--width', '0');
        searchDivEl.classList.remove('hidden');
        friendsDivEl.classList.add('hidden');
        addIconEl.innerHTML = `<?xml version="1.0" ?><svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M11.0004 17.5003C11.0004 16.2113 11.3755 15.01 12.0226 13.9996L4.25278 14.0002C3.01076 14.0002 2.00391 15.007 2.00391 16.2491V17.169C2.00391 17.7411 2.18231 18.2989 2.51427 18.7648C4.05643 20.9292 6.5794 22.0013 10.0004 22.0013C10.9317 22.0013 11.7966 21.9219 12.5921 21.7618C11.6006 20.6207 11.0004 19.1306 11.0004 17.5003Z"></path><path d="M15.0004 7.00488C15.0004 4.24346 12.7618 2.00488 10.0004 2.00488C7.23894 2.00488 5.00036 4.24346 5.00036 7.00488C5.00036 9.76631 7.23894 12.0049 10.0004 12.0049C12.7618 12.0049 15.0004 9.76631 15.0004 7.00488Z"></path><path d="M23.0004 17.5002C23.0004 14.4627 20.5379 12.0002 17.5004 12.0002C14.4628 12.0002 12.0004 14.4627 12.0004 17.5002C12.0004 20.5378 14.4628 23.0002 17.5004 23.0002C20.5379 23.0002 23.0004 20.5378 23.0004 17.5002ZM17.4105 14.0083L17.5004 14.0002L17.5902 14.0083C17.7943 14.0453 17.9553 14.2063 17.9923 14.4104L18.0004 14.5002L17.9994 17.0002H20.5043L20.5942 17.0083C20.7982 17.0453 20.9592 17.2063 20.9962 17.4104L21.0043 17.5002L20.9962 17.5901C20.9592 17.7942 20.7982 17.9551 20.5942 17.9922L20.5043 18.0002H17.9994L18.0004 20.5002L17.9923 20.5901C17.9553 20.7942 17.7943 20.9551 17.5902 20.9922L17.5004 21.0002L17.4105 20.9922C17.2064 20.9551 17.0455 20.7942 17.0084 20.5901L17.0004 20.5002L16.9994 18.0002H14.5043L14.4144 17.9922C14.2103 17.9551 14.0494 17.7942 14.0123 17.5901L14.0043 17.5002L14.0123 17.4104C14.0494 17.2063 14.2103 17.0453 14.4144 17.0083L14.5043 17.0002H16.9994L17.0004 14.5002L17.0084 14.4104C17.0455 14.2063 17.2064 14.0453 17.4105 14.0083Z"></path></svg>`
    } else {
        modoPesquisa = 0;
        let style = infoEl[0].style;
        style.setProperty('--width', '100%');
        style = infoEl[1].style;
        style.setProperty('--width', '0');
        fetchUserData(firebase.auth().currentUser)
        searchDivEl.classList.add('hidden');
        friendsDivEl.classList.remove('hidden');
        addIconEl.innerHTML = `<?xml version="1.0" ?><svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 14L13.5 14.001C14.2793 14.001 14.9204 14.5963 14.9931 15.3566L15 15.501V17.5C14.999 21 11.284 22 8.5 22C5.77787 22 2.1647 21.044 2.00545 17.7296L2 17.5V15.5C2 14.7207 2.59527 14.0796 3.35561 14.0069L3.5 14ZM15.488 14H20.5C21.2793 14 21.9204 14.5944 21.9931 15.3555L22 15.5V17C21.999 20.062 19.142 21 17 21C16.32 21 15.569 20.904 14.86 20.678C15.5128 19.9277 15.9362 18.9748 15.9934 17.78L16 17.5V15.5C16 15.0056 15.8507 14.5488 15.601 14.1616L15.488 14H20.5H15.488ZM8.5 3C10.985 3 13 5.015 13 7.5C13 9.985 10.985 12 8.5 12C6.015 12 4 9.985 4 7.5C4 5.015 6.015 3 8.5 3ZM17.5 5C19.433 5 21 6.567 21 8.5C21 10.433 19.433 12 17.5 12C15.567 12 14 10.433 14 8.5C14 6.567 15.567 5 17.5 5Z"></path></svg>`
    } 

}

function alteraDesafio(e) {

    if(e.target.innerHTML == "Desafios"){
        let style = infoDesEl[1].style;
        style.setProperty('--width', '0');
        style = infoDesEl[0].style;
        style.setProperty('--width', '100%');
        desafiosListEl.classList.remove('hidden');
        historicoListEl.classList.add('hidden');
    } else {
        let style = infoDesEl[0].style;
        style.setProperty('--width', '0');
        style = infoDesEl[1].style;
        style.setProperty('--width', '100%');
        desafiosListEl.classList.add('hidden');
        historicoListEl.classList.remove('hidden');
    } 

}

function pesquisaAmigo() {

    if(searchEl.value === ""){
        searchListEl.innerHTML = "";
        fetchUserData(firebase.auth().currentUser)
        return;
    }

    let amigos = [];

    firebase.firestore().collection('usuario').doc(firebase.auth().currentUser.uid).get().then((doc => {
        user = doc.data();
        let amigosArr = user.amigos;
        amigosArr.forEach((amigo) => {
            amigos.push(amigo);
        })
    }));

    // Pesquisa entre os amigos
    if(modoPesquisa == 0){

        if(amigos != null){
            amigos.forEach((friend) => {
                friendsListEl.innerHTML += `<div class="friends-box">
                                                <div class="img-wrapper">
                                                    <img src="../imgs/Nuvem.png">
                                                </div>
                                                <div class="friends-info">
                                                    <p class="friends-name">Gustavo</p>
                                                    <p class="friends-username">@offhawk</p>
                                                </div>
                                                <div class="svg-wrapper">
                                                    <?xml version="1.0" ?><svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M17.5001 11.9998C20.5377 11.9998 23.0001 14.4622 23.0001 17.4998C23.0001 20.5373 20.5377 22.9998 17.5001 22.9998C14.4626 22.9998 12.0001 20.5373 12.0001 17.4998C12.0001 14.4622 14.4626 11.9998 17.5001 11.9998ZM12.0227 13.9986C11.3754 15.0091 11.0001 16.2106 11.0001 17.4998C11.0001 19.1435 11.6102 20.6447 12.6164 21.7893C11.815 21.9311 10.9421 22.0008 10.0001 22.0008C7.11062 22.0008 4.87181 21.3442 3.30894 20.0006C2.48032 19.2882 2.00366 18.2498 2.00366 17.157V16.2497C2.00366 15.0071 3.01102 13.9997 4.25366 13.9997L12.0227 13.9986ZM20.8093 15.252L15.2524 20.809C15.893 21.2449 16.6668 21.4998 17.5001 21.4998C19.7093 21.4998 21.5001 19.7089 21.5001 17.4998C21.5001 16.6665 21.2453 15.8927 20.8093 15.252ZM17.5001 13.4998C15.291 13.4998 13.5001 15.2906 13.5001 17.4998C13.5001 18.3331 13.7549 19.1069 14.1909 19.7475L19.7479 14.1906C19.1072 13.7546 18.3334 13.4998 17.5001 13.4998ZM10.0001 2.00439C12.7615 2.00439 15.0001 4.24297 15.0001 7.00439C15.0001 9.76582 12.7615 12.0044 10.0001 12.0044C7.2387 12.0044 5.00012 9.76582 5.00012 7.00439C5.00012 4.24297 7.2387 2.00439 10.0001 2.00439Z"/></svg>
                                                </div>
                                            </div>`
            })
        }

        friendsListEl.innerHTML = amigos == null? "Nenhum amigo encontrado.": friendsListEl.innerHTML;

    } else {
        let pesquisa = searchEl.value;
        console.log(pesquisa);
        searchListEl.innerHTML = "Pesquisando...";
        let user;

        firebase.firestore().collection('usuario').orderBy('nomeSearch').startAt(pesquisa.toUpperCase()).endAt(pesquisa.toUpperCase() + "\uf8ff").get().then((snapshot => {
            if(!snapshot.empty){
                searchListEl.innerHTML = "";
            } else searchListEl.innerHTML = "Nenhum usuário encontrado.";
            snapshot.forEach((doc) => {
                user = doc.data()
                console.log(user)

                searchListEl.innerHTML += `<li>
                                                <div class="friends-box" id="search-box" data-username="${user.username}">
                                                    <div class="img-wrapper">
                                                        <img src="${user.imgURL}">
                                                    </div>
                                                    <div class="friends-info">
                                                        <p class="friends-name">${user.nome}</p>
                                                        <p class="friends-username">@${user.username}</p>
                                                    </div>
                                                    <div class="svg-wrapper" ${amigos.includes(user.uid)?``:`onclick="addAmigo(this.parentElement)"`}>
                                                        ${amigos.includes(user.uid)?`
                                                            <?xml version="1.0" ?><svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M17.5001 11.9998C20.5377 11.9998 23.0001 14.4622 23.0001 17.4998C23.0001 20.5373 20.5377 22.9998 17.5001 22.9998C14.4626 22.9998 12.0001 20.5373 12.0001 17.4998C12.0001 14.4622 14.4626 11.9998 17.5001 11.9998ZM12.0224 13.9991C11.3753 15.0095 11.0001 16.2108 11.0001 17.4998C11.0001 19.1301 11.6003 20.6202 12.5919 21.7613C11.7963 21.9214 10.9314 22.0008 10.0001 22.0008C6.57915 22.0008 4.05619 20.9287 2.51403 18.7643C2.18207 18.2984 2.00366 17.7406 2.00366 17.1685V16.2486C2.00366 15.0065 3.01052 13.9997 4.25254 13.9997L12.0224 13.9991ZM14.8537 17.1462C14.6584 16.951 14.3418 16.951 14.1466 17.1462C13.9513 17.3415 13.9513 17.6581 14.1466 17.8533L16.1466 19.8533C16.3418 20.0486 16.6584 20.0486 16.8537 19.8533L20.8537 15.8533C21.0489 15.6581 21.0489 15.3415 20.8537 15.1462C20.6584 14.951 20.3418 14.951 20.1466 15.1462L16.5001 18.7927L14.8537 17.1462ZM10.0001 2.00439C12.7615 2.00439 15.0001 4.24297 15.0001 7.00439C15.0001 9.76582 12.7615 12.0044 10.0001 12.0044C7.2387 12.0044 5.00012 9.76582 5.00012 7.00439C5.00012 4.24297 7.2387 2.00439 10.0001 2.00439Z" fill="#14EBB1"/></svg>`:`
                                                            <?xml version="1.0" ?><svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M11.0004 17.5003C11.0004 16.2113 11.3755 15.01 12.0226 13.9996L4.25278 14.0002C3.01076 14.0002 2.00391 15.007 2.00391 16.2491V17.169C2.00391 17.7411 2.18231 18.2989 2.51427 18.7648C4.05643 20.9292 6.5794 22.0013 10.0004 22.0013C10.9317 22.0013 11.7966 21.9219 12.5921 21.7618C11.6006 20.6207 11.0004 19.1306 11.0004 17.5003Z"/><path d="M15.0004 7.00488C15.0004 4.24346 12.7618 2.00488 10.0004 2.00488C7.23894 2.00488 5.00036 4.24346 5.00036 7.00488C5.00036 9.76631 7.23894 12.0049 10.0004 12.0049C12.7618 12.0049 15.0004 9.76631 15.0004 7.00488Z"/><path d="M23.0004 17.5002C23.0004 14.4627 20.5379 12.0002 17.5004 12.0002C14.4628 12.0002 12.0004 14.4627 12.0004 17.5002C12.0004 20.5378 14.4628 23.0002 17.5004 23.0002C20.5379 23.0002 23.0004 20.5378 23.0004 17.5002ZM17.4105 14.0083L17.5004 14.0002L17.5902 14.0083C17.7943 14.0453 17.9553 14.2063 17.9923 14.4104L18.0004 14.5002L17.9994 17.0002H20.5043L20.5942 17.0083C20.7982 17.0453 20.9592 17.2063 20.9962 17.4104L21.0043 17.5002L20.9962 17.5901C20.9592 17.7942 20.7982 17.9551 20.5942 17.9922L20.5043 18.0002H17.9994L18.0004 20.5002L17.9923 20.5901C17.9553 20.7942 17.7943 20.9551 17.5902 20.9922L17.5004 21.0002L17.4105 20.9922C17.2064 20.9551 17.0455 20.7942 17.0084 20.5901L17.0004 20.5002L16.9994 18.0002H14.5043L14.4144 17.9922C14.2103 17.9551 14.0494 17.7942 14.0123 17.5901L14.0043 17.5002L14.0123 17.4104C14.0494 17.2063 14.2103 17.0453 14.4144 17.0083L14.5043 17.0002H16.9994L17.0004 14.5002L17.0084 14.4104C17.0455 14.2063 17.2064 14.0453 17.4105 14.0083Z"/></svg>`
                                                        }
                                                    </div>
                                                </div>
                                            </li>`
            })
        }));
    }
}

function desafiarAmigo(parent) {
    let amigoId;

    const userRef = firebase.firestore().collection('usuario').doc(firebase.auth().currentUser.uid);

    const amigoRef = firebase.firestore().collection('usuario').where("username", "==", parent.dataset.username).get().then((snapshot => {
        snapshot.forEach((doc) => {
            let data = doc.data();
            firebase.firestore().collection('desafio').add({
                quiz: quizArray, 
                user: firebase.auth().currentUser.uid, 
                acertos: scoreCount,
                enviado: firebase.auth().currentUser.uid,
                desafiado: data.uid,
                status: false
            }).then((docRef) => {
                doc.ref.update({
                    desafios: firebase.firestore.FieldValue.arrayUnion(docRef.id)
                })
                userRef.update({
                    desafios: firebase.firestore.FieldValue.arrayUnion(docRef.id)
                })
            });

            
        })
    }))

    parent.innerHTML = `<?xml version="1.0" ?><!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 1.1//EN'  'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'><svg enable-background="new 0 0 32 32" height="32px" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M30.171,6.131l-0.858-0.858c-0.944-0.945-2.489-0.945-3.433,0L11.294,19.859l-5.175-5.174  c-0.943-0.944-2.489-0.944-3.432,0.001l-0.858,0.857c-0.943,0.944-0.943,2.489,0,3.433l7.744,7.75c0.944,0.945,2.489,0.945,3.433,0  L30.171,9.564C31.112,8.62,31.112,7.075,30.171,6.131z" fill="#14EBB1"/></svg>`
}

document.querySelector('#modal-amigos-backdrop').addEventListener('click', modalAmigo);

function modalAmigo() {
    let modal = document.querySelector('#modal-amigos');
    modal.classList.toggle('hidden');
    document.querySelector('#modal-amigos-backdrop').classList.toggle('hidden');
}

function addAmigo(parent) {

    const userRef = firebase.firestore().collection('usuario').doc(firebase.auth().currentUser.uid);
    const amigoRef = firebase.firestore().collection('usuario').where("username", "==", parent.dataset.username).get().then((snapshot => {
            snapshot.forEach((doc) => {
                userRef.update({
                    amigos: firebase.firestore.FieldValue.arrayUnion(doc.data().uid)
                })
                let divSvgEl = parent.querySelector('.svg-wrapper');
                divSvgEl.innerHTML = `<?xml version="1.0" ?><svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M17.5001 11.9998C20.5377 11.9998 23.0001 14.4622 23.0001 17.4998C23.0001 20.5373 20.5377 22.9998 17.5001 22.9998C14.4626 22.9998 12.0001 20.5373 12.0001 17.4998C12.0001 14.4622 14.4626 11.9998 17.5001 11.9998ZM12.0224 13.9991C11.3753 15.0095 11.0001 16.2108 11.0001 17.4998C11.0001 19.1301 11.6003 20.6202 12.5919 21.7613C11.7963 21.9214 10.9314 22.0008 10.0001 22.0008C6.57915 22.0008 4.05619 20.9287 2.51403 18.7643C2.18207 18.2984 2.00366 17.7406 2.00366 17.1685V16.2486C2.00366 15.0065 3.01052 13.9997 4.25254 13.9997L12.0224 13.9991ZM14.8537 17.1462C14.6584 16.951 14.3418 16.951 14.1466 17.1462C13.9513 17.3415 13.9513 17.6581 14.1466 17.8533L16.1466 19.8533C16.3418 20.0486 16.6584 20.0486 16.8537 19.8533L20.8537 15.8533C21.0489 15.6581 21.0489 15.3415 20.8537 15.1462C20.6584 14.951 20.3418 14.951 20.1466 15.1462L16.5001 18.7927L14.8537 17.1462ZM10.0001 2.00439C12.7615 2.00439 15.0001 4.24297 15.0001 7.00439C15.0001 9.76582 12.7615 12.0044 10.0001 12.0044C7.2387 12.0044 5.00012 9.76582 5.00012 7.00439C5.00012 4.24297 7.2387 2.00439 10.0001 2.00439Z" fill="#14EBB1"/></svg>`
            })
    }))

}

function aceitarDesafio(id) {

    id = id.dataset.id;
    quizArray = [];

    const desafioDoc = firebase.firestore().collection('desafio').doc(id).get().then((doc) => {
        let data = doc.data();
        quizArray = data.quiz;
        startScreen.classList.add("hide");
        displayContainer.classList.remove("hide");
        initial(true);
        isDesafio = true;
        desafioArray = data;
        desafioRef = doc.ref;
    });

   


}

function recusarDesafio(id) {
    console.log(id)
}
