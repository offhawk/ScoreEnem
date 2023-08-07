let user = null;
function verificaUsuario() {
  user = localStorage.getItem("userId");
  if (user == null || user == "") {
    alert("Você não está logado!");
    window.location.href = "../pages/login.html";
  } else {
    user = localStorage.getItem("user");
    fetchUserData();
  }
}

/*firebase.auth().onAuthStateChanged(function(user){
    if (user == null || user == "") {
        alert("Você não está logado!");
        window.location.href = "../pages/login.html";
      } else {
        user = localStorage.getItem("user");
        fetchUserData();
    }
})*/

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
function fetchUserData() {
  var userId = user; // Substitua pelo ID do usuário no banco de dados
  console.log("chegou aq");
  console.log(localStorage.getItem("userId"));
  firebase
    .firestore()
    .collection("usuario")
    .where("uid", "==", localStorage.getItem("userId"))
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var userData = doc.data();
        inputNome.value = userData.nome;
        console.log(userData.nome);
        inputEmail.value = userData.email;
        //inputIdade.value = userData.idade;
        inputTelefone.value = userData.telefone;
        //inputLoc.value = userData.loc;
      });
    })
    .catch(function (error) {
      console.log("Erro ao buscar informações do usuário:", error);
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

window.addEventListener("load", function () {
    verificaUsuario();
});


