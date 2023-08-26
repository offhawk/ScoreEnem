let namesEl = document.querySelectorAll('.header-name');
let usuario = [];

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


    if(namesEl.length == 1){
        namesEl[0].innerHTML = usuario[0].nome;
        namesEl[0].setAttribute('href', 'pages/profile.html')
    } else {
        namesEl[0].innerHTML = usuario[0].nome;
        namesEl[0].setAttribute('href', 'pages/profile.html')
        namesEl[1].innerHTML = 'Log Out';
        namesEl[1].addEventListener('click', logOut);
    }

}

function irParaMeuPerfil() {
    window.location.href = "../pages/profile.html";
}