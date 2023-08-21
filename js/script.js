let namesEl = document.querySelectorAll('.header-name');
let usuario = [];

showLoading();

firebase.auth().onAuthStateChanged(function(user){
    if(user) {
        salvaUsuario(user);
    }
    else{
        if(namesEl.length > 0){
            namesEl[0].innerHTML = 'Login';
            namesEl[1].innerHTML = 'Cadastre-se';
            hideLoading()
        }
        else hideLoading()
    }
})

function salvaUsuario(user) {
    let userTest = firebase.firestore().collection('usuario').where('uid', '==', user.uid).get().then(snapshot => {
        usuario = snapshot.docs.map(doc => doc.data());
        preencheHeader(usuario);
    })   
}

function preencheHeader(usuario) {

    namesEl[0].innerHTML = usuario[0].nome;
    namesEl[0].setAttribute('href', 'profile.html')
    namesEl[1].innerHTML = 'Log Out';
    namesEl[1].addEventListener('click', logOut);

    hideLoading()

}

