showLoading()

firebase.auth().onAuthStateChanged(function(user){
    if (user == null || user == "") {
        hideLoading()
        alert("Você não está logado!");
        window.location.href = "../pages/login.html";
      } else {
        fetchUserData(user);
    }
})

// Configurar o Firebase

// Obter referência ao formulário e campos
var form = document.querySelector("form");
var inputNome = document.getElementById("inputNome");
var inputEmail = document.getElementById("inputEmail");
var inputIdade = document.getElementById("inputIdade");
var inputTelefone = document.getElementById("inputTelefone");
var inputLoc = document.getElementById("inputLoc");
var btnSaveChanges = document.querySelector(".btn-primary");

// Função para buscar informações do usuário no banco de dados
function fetchUserData(user) {
  var userId = user; // Substitua pelo ID do usuário no banco de dados
  console.log("chegou aq");
  console.log(user.uid);
  firebase.firestore()
    .collection("usuario")
    .where("uid", "==", user.uid)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var userData = doc.data();
        document.getElementById("profile-pic").src = userData.imgURL;
        inputNome.value = userData.nome;
        console.log(userData.nome);
        inputEmail.value = userData.email;
        //inputIdade.value = userData.idade;
        inputTelefone.value = userData.telefone;
        //inputLoc.value = userData.loc;
        hideLoading()
      });
    })
    .catch(function (error) {
      console.log("Erro ao buscar informações do usuário:", error);
      hideLoading()

    });
}
/*

// Ouvinte para habilitar o botão "Salvar alterações" quando houver mudanças
var formFields = [
    inputNome,
    inputEmail,
    inputIdade,
    inputTelefone,
    inputLoc,
];

formFields.forEach(function (field) {
  field.addEventListener("input", function () {
    btnSaveChanges.removeAttribute("disabled");
  });
});

// Função para atualizar informações do usuário no banco de dados
function updateUserData(newData) {
  var userId = "ID_DO_SEU_USUARIO"; // Substitua pelo ID do usuário no banco de dados
  firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .update(newData)
    .then(function () {
      console.log("Informações do usuário atualizadas com sucesso!");
      btnSaveChanges.setAttribute("disabled", "true");
    })
    .catch(function (error) {
      console.error("Erro ao atualizar informações do usuário:", error);
    });
}

// Ouvinte para salvar as alterações
btnSaveChanges.addEventListener("click", function () {
  var newData = {
    username: inputUsername.value,
    firstName: inputFirstName.value,
    lastName: inputLastName.value,
    location: inputLocation.value,
    email: inputEmailAddress.value,
  };

  updateUserData(newData);
});

// Buscar as informações do usuário ao carregar a página
*/

let userUid

firebase.auth().onAuthStateChanged(function(user){
    if(user) {
        userUid = user.uid;
    }
})

function salvaNome() {
    showLoading();

    const transaction = novaMudança();

    firebase.firestore()
        .collection('usuario')
        .add()
        .then(() => {
            hideLoading();
            window.location.href = "../home/home.html";
        })
        .catch(() => {
            hideLoading();
            alert('Erro ao salvar alteração');
        })
}

function novaMudança() {
    return {
        type: form.typeExpense().checked ? "expense" : "income",
        date: form.date().value,
        money: {
            currency: form.currency().value,
            value: parseFloat(form.value().value)
        },
        transactionType: form.transactionType().value,
        description: form.description().value,
        user: {
            uid: firebase.auth().currentUser.uid
        }
    };
}

function atualizaNome() {

    showLoading();

    let nomeUsuario = document.querySelector("#inputNome").value;
    var washingtonRef = firebase.firestore().collection("usuario").where("uid", "==", userUid).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            doc.ref.update ({
                nome: nomeUsuario
            })
            
            .then(() => {
                console.log("O seu nome foi alterado com sucesso!");
                salvaUsuario(userUid);
                hideLoading()
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Erro ao atualizar o nome ", error);
                hideLoading()
                });
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
        hideLoading()
    });
}

// Define um ouvinte de evento para o campo de entrada de imagem
document.getElementById("picture__input").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    uploadProfilePicture(file);
  }
});

// Função para fazer o upload da imagem de perfil
function uploadProfilePicture(file) {
  showLoading();

  const storageRef = firebase.storage().ref();
  const user = firebase.auth().currentUser;

  if (user) {
    const profilePictureRef = storageRef.child(`profilePictures/${user.uid}`);
    profilePictureRef
      .put(file)
      .then((snapshot) => {
        hideLoading();
        // Atualize a imagem de perfil na página
        snapshot.ref.getDownloadURL().then((url) => {
          document.getElementById("profile-pic").src = url;
          firebase.firestore().collection("usuario").doc(user.uid).update({
            imgURL: url
        })
        .then(() => {
            console.log("Document successfully written!");
        })
        });
        
      })
      .catch((error) => {
        // Ocorreu um erro durante o upload
        hideLoading();
        console.error("Erro ao carregar a imagem de perfil:", error);
        alert("Erro ao carregar a imagem de perfil. Tente novamente mais tarde.");
      });
  }
}

function validarNome() {
  const inputNome = document.getElementById("inputNome");
  const nomeUsuario = inputNome.value.trim();

  if (nomeUsuario === "") {
    // Nome de usuário está vazio, exiba uma mensagem de erro
    alert("Por favor, preencha o campo de nome de usuário.");
    return false; // Impede que a função `atualizaNome()` seja chamada
  }

  // Nome de usuário não está vazio, pode chamar a função `atualizaNome()`
  atualizaNome();
}

//--------------------------------------------------------------
//TERMINAR

function findTransactions() {
    showLoading();

    console.log("AAAAAAA");

    let emailUsuario= document.querySelector("#inputEmail").value;
    let idadeUsuario = document.querySelector("#inputIdade").value;
    let telUsuario = document.querySelector("#inputTelefone").value;
    let locUsuario = document.querySelector("#inputLoc").value;
    let videosUsuario = document.querySelector("#inputVid").value;
    let jogosUsuario = document.querySelector("#inputJog").value;

    console.log("AAAA");

    firebase.firestore()
        .collection('usuario')
        .where('uid', '==', userUid)
        .get()
        .then(snapshot => {
            const transactions = snapshot.docs.map(doc => doc.data());
            addTransactionsToScreen(transactions);
            hideLoading();
        })
        
        .catch(error => {
            hideLoading();
            console.log(error);
            alert('Erro ao achar dados');
        })
}