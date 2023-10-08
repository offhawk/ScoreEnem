//import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";

(function () {

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
    const app = firebase.initializeApp(firebaseConfig);

    //const provider = new GoogleAuthProvider(app);
    //const auth = getAuth(app);

    
})();

function resetPassword() {
    // Obtenha o endereço de e-mail do usuário.
    const email = document.querySelector("input[name='email']").value;
  
    // Use o SDK do Firebase para enviar um e-mail de redefinição de senha.
    firebase.auth().sendPasswordResetEmail(email);
  
    // Exiba uma mensagem de confirmação.
    document.querySelector("#mensagem-redefinicao-senha").innerHTML =
        "Um e-mail de redefinição de senha foi enviado para você.";
  }

  function googleLogin() {
    // Inicie o processo de login com o Google.
    //const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithRedirect(auth, provider);
  }
  function addQuestao(){
    const db = firebase.firestore();

    // Dados da questão
    const questaoData = {
        alternativas: ["6", "8", "9", "15", "20"],
        ano: "2021",
        correta: "9",
        descricao: "Álgebra, Problemas",
        teste: "teste",
        prova: "ENEM",
        questao: "Um lava-rápido oferece dois tipos de lavagem de veículos: lavagem simples, ao preço de R$ 20,00, e lavagem completa, ao preço de R$ 35,00. Para cobrir as despesas com produtos e funcionários, e não ter prejuízos, o lava-rápido deve ter uma receita diária de, pelo menos, R$ 300,00. Para não ter prejuízo, o menor número de lavagens diárias que o lava-rápido deve efetuar é",
    };

    // Referência à coleção "questões"
    const questoesCollection = db.collection("questões");

    // Adicionar a questão ao Firestore com um ID automático
    questoesCollection.add(questaoData)
        .then((docRef) => {
            console.log("Questão adicionada com sucesso com o ID:", docRef.id);
        })
        .catch((error) => {
            console.error("Erro ao adicionar a questão:", error);
        });
  }
  addQuestao();