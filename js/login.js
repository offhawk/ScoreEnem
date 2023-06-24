let password = document.getElementById('password');
let email = document.getElementById('email');

function login() {
    
    firebase.auth().signInWithEmailAndPassword(email.value, password.value).then(response => {
        window.location.href = "../index.html";
        console.log('success', response);
    }).catch(error => {
        console.log("error", error);
    });
}

