let rpassword = document.getElementById('r-password');
let remail = document.getElementById('r-email');
let rnome = document.getElementById('nome');
let rtelefone = document.getElementById('telefone');

function validateFieldsReg(e) {

    const emailValid = isEmailValid();
    const passwordValid = isPasswordValid();
    const telValid = isTelValid();
    const nameValid = isNameValid();
    document.getElementById('input-cadastro').disabled = !emailValid || !passwordValid || !telValid || !nameValid;

}


function isTelValid(e) {
    if (!rtelefone.value) {
        return false;
    }
    return true;
}

function isNameValid(e) {
    if (!rnome.value) {
        return false;
    }
    return true;
}


function cadastro(e) {
    showLoading()
    firebase.auth().createUserWithEmailAndPassword(remail.value, rpassword.value).then(response => {

        // Registra as informações do usuário no banco de dados
       if(salvaUsuario()){
            hideLoading()
            window.location.href = "../index.html";
       }
       hideLoading()
    }).catch(error => {
        alert('error 2', error);
    });
}

function salvaUsuario() {

    const usuario = {
        nome: rnome.value,
        email: remail.value,
        telefone: rtelefone.value,
        uid: firebase.auth().currentUser.uid
    }

    firebase.firestore().collection('usuario').add(usuario).then(() => {
        return true;
    }).catch(() => {
        return false;
    })
}


firebase.auth().onAuthStateChanged(user => {
    if(user){
        let uid = user.uid;
    }
})