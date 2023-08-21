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
    let userTest = firebase.firestore().collection('usuario').where('uid', '==', user).get().then(snapshot => {
        usuario = snapshot.docs.map(doc => doc.data());
        preencheHeader(usuario);
    })   
}


function preencheHeader(usuario) {
    
    namesEl[0].innerHTML = usuario[0].nome;
    namesEl[1].innerHTML = 'Log Out';
    namesEl[1].addEventListener('click', logOut);
    namesEl[0].href= "../pages/profile.html";
    namesEl[0].addEventListener('click', irParaMeuPerfil);
}

function irParaMeuPerfil() {
    window.location.href = "../pages/profile.html";
}

