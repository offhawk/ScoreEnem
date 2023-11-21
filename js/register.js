let rpassword = document.getElementById('r-password');
let remail = document.getElementById('r-email');
let rnome = document.getElementById('nome');
let rusuario = document.getElementById('usuario');


function validateFieldsReg(e) {

    const emailValid = isEmailValid();
    const passwordValid = isPasswordValid();
    const nameValid = isNameValid();
    //document.getElementById('input-cadastro').disabled = !emailValid || !passwordValid || !telValid || !nameValid;

}

function isNameValid(e) {
    if (!rnome.value) {
        return false;
    }
    return true;
}

document.getElementById('input-cadastro').addEventListener('click', cadastro)

function cadastro() {
    showLoading()
    firebase.auth().createUserWithEmailAndPassword(remail.value, rpassword.value).then(response => {

        // Registra as informações do usuário no banco de dados
       if(salvaUsuario()){
            hideLoading()
            window.location.href = "../index.html";
       }
       hideLoading()
    }).catch(error => {
        alert(error);
        console.log(error);
    });
}

function salvaUsuario() {

    const usuario = {
        nome: rnome.value,
        email: remail.value,
        username: rusuario.value.toLowerCase(),
        uid: firebase.auth().currentUser.uid,
        nomeSearch: rnome.value.toUpperCase(),
        imgURL: "https://firebasestorage.googleapis.com/v0/b/scoreenem.appspot.com/o/profilePictures%2FNovo%20Projeto.jpg?alt=media&token=8f325fe3-b5a1-4501-a6aa-c45df71362f1"
    }

    firebase.firestore().collection('usuario').doc(firebase.auth().currentUser.uid).set(usuario).then(() => {
        window.location.href = "../index.html";
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