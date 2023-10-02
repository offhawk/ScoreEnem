firebase.auth().onAuthStateChanged(function(user){
    if (user == null || user == "") {
        hideLoading()
        alert("Você não está logado!");
        window.location.href = "../pages/login.html";
      } else {
        fetchUserData(user);
    }
})

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