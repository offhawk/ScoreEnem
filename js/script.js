let namesEl = document.querySelectorAll('.header-name');
let usuario = [];
let username = document.querySelector('.user-name')

let themeChangerEl = document.querySelector('#theme-changer');
let navigationEl = document.querySelector('.navigation');

let theme = "";

window.onload = function() {
    if(localStorage.getItem("theme") == null){
        localStorage.setItem("theme", "light");
    } else {
        theme = localStorage.getItem("theme");
        document.querySelector('body').setAttribute('data-theme', theme);
    }
}

themeChangerEl.addEventListener('click', function() {
    if(theme == "light"){
        localStorage.setItem("theme", "dark");
        theme = "dark";
        document.querySelector('body').setAttribute('data-theme', "dark");
    } else {
        localStorage.setItem("theme", "light");
        theme = "light";
        document.querySelector('body').setAttribute('data-theme', "light");
    }
})

firebase.auth().onAuthStateChanged(function(user){
    if(user) {
        salvaUsuario(user.uid);
    }
    else{
        namesEl[0].innerHTML = 'Login';
        namesEl[1].innerHTML = 'Cadastre-se';
    }
})

function salvaUsuario(user) {
    showLoading()
    let userTest = firebase.firestore().collection('usuario').where('uid', '==', user).get().then(snapshot => {
        usuario = snapshot.docs.map(doc => doc.data());
        preencheHeader(usuario);
        hideLoading()

    })   
}

function preencheHeader(usuario) {

    if(namesEl.length > 0){
        if(namesEl.length == 1){
            namesEl[0].innerHTML = usuario[0].nome;
            namesEl[0].setAttribute('href', 'pages/profile.html')
        } else {
            namesEl[0].innerHTML = usuario[0].nome;
            namesEl[0].setAttribute('href', 'pages/profile.html')
            namesEl[1].innerHTML = 'Log Out';
            namesEl[1].addEventListener('click', logOut);
        }
        if (username) {
            username.innerHTML = usuario[0].nome;
        }
    }
}

function irParaMeuPerfil() {
    window.location.href = "../pages/profile.html";
}

navigationEl.addEventListener('click', () => {
    window.history.back();
})