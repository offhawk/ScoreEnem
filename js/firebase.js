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




  /*function addQuestao(){
    const db = firebase.firestore();

    // Dados da questão
    const questaoData = {
        alternativas: ["6", "8", "9", "15", "20"],
        ano: "2021",
        correta: "9",
        descricao: "Álgebra, Problemas",
        teste: "teste",
        prova: "ENEM",
        questao: "Um lava-rápido oferece",
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
  addQuestao();*/