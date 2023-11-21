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
    // Verifica se a página atual é a página "index"
    const isIndexPage = window.location.pathname.endsWith('/index.html');

    if (namesEl.length > 0) {
        if (namesEl.length == 1) {
            namesEl[0].innerHTML = usuario[0].nome;

            // Redireciona para diferentes páginas com base na condição
            namesEl[0].setAttribute('href', isIndexPage ? 'pages/profile.html' : '../pages/profile.html');
        } else {
            namesEl[0].innerHTML = usuario[0].nome;
            namesEl[0].setAttribute('href', isIndexPage ? 'pages/profile.html' : '../pages/profile.html');
            namesEl[1].innerHTML = 'Log Out';
            namesEl[1].addEventListener('click', logOut);
        }

        if (username) {
            username.innerHTML = usuario[0].nome;
        }
    }
}

navigationEl.addEventListener('click', () => {
    window.history.back();
})

function voltaPaginaAnterior() {
    window.history.back();
  }