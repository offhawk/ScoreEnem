let password = document.getElementById('password');
let email = document.getElementById('email');
let emailInvalido = document.getElementById('email-invalido');
let senhaInvalido = document.getElementById('senha-invalido');
let loginErro = document.getElementById('login-error');
let inputsEl = document.querySelectorAll('input');
let modal = document.getElementById('modal-full');

function alteraModal(e) {

    inputsEl.forEach(input => {
        input.value = "";
    });

    modal.classList.toggle('show');
}

let query = location.search.slice(1);
let partes = query.split('&');
let data = {};
partes.forEach(function (parte) {
    let chaveValor = parte.split('=');
    let chave = chaveValor[0];
    let valor = chaveValor[1];
    data[chave] = valor;
});

if (data.logado == 0) {
    loginErro.classList.toggle('hidden');
    loginErro.innerHTML = "Faça Login para acessar a página"
}

if (data.cad == 1) {
    alteraModal();
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
    if (validateEmail(email.value)) {
        emailInvalido.innerHTML = "";
        return true;
    } else {
        emailInvalido.innerHTML = "Email Inválido";
        return false;
    }

}

function isPasswordValid() {
    if (!password.value) {
        senhaInvalido.innerHTML = "Preencha o campo";
        return false;
    }
    if (validatePassword(password.value)) {
        senhaInvalido.innerHTML = "";
        return true;
    } else {
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
//se isEmailValid for verdadeiro executa resetPassword

function resetPassword() {
     
    if (isEmailValid()) {
        // Obtenha o endereço de e-mail do usuário.
        const email = document.querySelector("input[name='email']").value;

        // Use o SDK do Firebase para enviar um e-mail de redefinição de senha.
        firebase.auth().sendPasswordResetEmail(email);

        // Exiba uma mensagem de confirmação.
        document.querySelector("#mensagem-redefinicao-senha").innerHTML =
            "Email de Recuperação Enviado.";
    }
    else {
        document.querySelector("#mensagem-redefinicao-senha").innerHTML =
            "Tente Novamente";
        emailInvalido.innerHTML = "Email Inválido";
      }
    }
/*
function () {

    const firebaseConfig = {
        apiKey: "AIzaSyBAXcpJupzH0exgTEqTnhDFCbru1d1HkB0",
        authDomain: "scoreenem.firebaseapp.com",
        projectId: "scoreenem",
        storageBucket: "scoreenem.appspot.com",
        messagingSenderId: "486560487123",
        appId: "1:486560487123:web:78df947a9e83f44bc2a626",
        measurementId: "G-SEZDPZBZLW"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Get the Auth service
    const auth = getAuth(app);

    
})();
    function googleLogin() {
        // Inicie o processo de login com o Google.
        //const provider = new GoogleAuthProvider();
        const auth = getAuth();
        signInWithRedirect(auth, provider);
    }
*/
