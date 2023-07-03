let password = document.getElementById('password');
let email = document.getElementById('email');
let emailInvalido = document.getElementById('email-invalido');
let senhaInvalido = document.getElementById('senha-invalido');
let loginErro = document.getElementById('login-error');

function validateFields() {

    const emailValid = isEmailValid();
    const passwordValid = isPasswordValid();
    document.getElementById('input-login').disabled = !emailValid || !passwordValid;

}

function isEmailValid() {
    if (!email.value) {
        emailInvalido.innerHTML = "Preencha o Campo";
        return false;
    }
    if(validateEmail(email.value)){
        emailInvalido.innerHTML = "";
        return true;
    } else{
        emailInvalido.innerHTML = "Email Inválido";
        return false;
    }

}

function isPasswordValid() {
    if (!password.value) {
        senhaInvalido.innerHTML = "Preencha o campo";
        return false;
    }
    if(validatePassword(password.value)){
        senhaInvalido.innerHTML = "";
        return true;
    } else{
        return false;
    }

}

function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function login() {
    
    firebase.auth().signInWithEmailAndPassword(email.value, password.value).then(response => {
        window.location.href = "../index.html";
        console.log('success', response);
    }).catch(error => {
        loginErro.classList.toggle('hidden');
    });
}

function logOut() {
    firebase.auth().signOut().then(() => {
        window.location.href = "index.html"
    }).catch(() => {
        alert("Erro ao fazer logout");
    })
}
