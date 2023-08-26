let password = document.getElementById('password');
let email = document.getElementById('email');
let emailInvalido = document.getElementById('email-invalido');
let senhaInvalido = document.getElementById('senha-invalido');
let loginErro = document.getElementById('login-error');

let query = location.search.slice(1);
let partes = query.split('&');
let data = {};
partes.forEach(function (parte) {
    let chaveValor = parte.split('=');
    let chave = chaveValor[0];
    let valor = chaveValor[1];
    data[chave] = valor;
});

if(data.logado == 0){
    loginErro.classList.toggle('hidden');
    loginErro.innerHTML = "Faça Login para acessar a página"
}

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
    
    showLoading()

    firebase.auth().signInWithEmailAndPassword(email.value, password.value).then(response => {
        window.location.href = "../index.html";
        hideLoading()
        console.log('success', response);
    }).catch(error => {
        hideLoading()
        loginErro.classList.toggle('hidden');
        loginErro.innerHTML = "Usuário ou senha incorretos."
    });
}

function logOut() {
    showLoading()
    firebase.auth().signOut().then(() => {
        hideLoading()
        window.location.href = "../index.html"
    }).catch(() => {
        hideLoading()
        alert("Erro ao fazer logout");
    })
}
