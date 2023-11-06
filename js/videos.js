showLoading();

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

let videos = [];

query = location.search.slice(1);
partes = query.split('&');
data = {};
partes.forEach(function (parte) {
    let chaveValor = parte.split('=');
    let chave = chaveValor[0];
    let valor = chaveValor[1];
    data[chave] = valor;
});


let videosEl = firebase.firestore().collection('video').where("mat", "==", data.mat).orderBy("order").get().then(snapshot => {
    videos = snapshot.docs.map(doc => doc.data());
    preenchePlaylist(videos);
    hideLoading();
})   

const videosDivEl = document.querySelector("#videos-list");

let mainTitle = document.querySelector(".main-title");
let mainVideo = document.querySelector("lite-youtube");
let mainVideoBox = document.querySelector("#video-box");
let valor = document.querySelector("#valor");
let svgElement = document.getElementById("coracao");
  let pathElement = svgElement.querySelector("path");

let videosPlaylistEl = [];

function preenchePlaylist(videos) {

    mainVideoBox.firstElementChild.remove()
    let liteEmbedEl = document.createElement("lite-youtube");
    liteEmbedEl.setAttribute("videoid", videos[0].id); 
    mainVideo.style = "background-image: " + "url('https://i.ytimg.com/vi/" + videos[0].id + "/maxresdefault.jpg')"
    mainVideoBox.appendChild(liteEmbedEl);

    mainTitle.innerHTML = videos[0].titulo;
    carregarComentariosIniciais();
    valor.innerHTML = videos[0].likes?videos[0].likes.length:"0";

    videos.forEach(video => {
        
        let videoLine = document.createElement("div");
        videoLine.classList.add('video-line');

        videoLine.dataset.id = video.id;
        videoLine.dataset.titulo = video.titulo;

        let imgContainer = document.createElement("div");
        imgContainer.classList.add('video');
        let img = document.createElement("img");

        img.width = 772;
        img.height = 434;

        img.classList.add('thumbnail-video');
    
        img.src = "https://i.ytimg.com/vi/" + video.id + "/hqdefault.jpg";
    
        imgContainer.appendChild(img);
    
        let titleContainer = document.createElement("div");
        titleContainer.classList.add('video-title-box');
        let title = document.createElement("p");
    
        title.textContent = video.titulo;
    
        titleContainer.appendChild(title);
    
        videoLine.appendChild(imgContainer);
        videoLine.appendChild(titleContainer);
    
        videosDivEl.appendChild(videoLine);

    });

    videosPlaylistEl = document.querySelectorAll('.video-line');

    if (videosPlaylistEl.length > 0) {
      videosPlaylistEl[0].classList.add('play-select');
  }

    videosPlaylistEl.forEach(video => {
        video.addEventListener('click', alteraVideo)
    });
}

function alteraVideo(e) {

    let clicado = e.currentTarget;

    mainVideoBox.firstElementChild.remove()
    let liteEmbedEl = document.createElement("lite-youtube");
    liteEmbedEl.setAttribute("videoid", clicado.dataset.id); 
    mainVideo.style = "background-image: " + "url('https://i.ytimg.com/vi/" + clicado.dataset.id + "/hqdefault.jpg')"
    mainVideoBox.appendChild(liteEmbedEl);

    mainTitle.innerHTML = clicado.dataset.titulo;

    atualizaPlaylist(e.currentTarget);
    const q = firebase.firestore().collection('video').where('id', '==', liteEmbedEl.getAttribute('videoid')).get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            atualizaComentario(doc.ref)
            valor.innerHTML = doc.data().likes?doc.data().likes.length:"0";
        });
    })
}

function atualizaPlaylist(elemento) {

    videosPlaylistEl.forEach(video => {
        video.classList.remove('play-select');
    });
    
    elemento.classList.toggle('play-select');

}

function addComment() {


    let liteEmbedEl = document.querySelector("lite-youtube");
    console.log(liteEmbedEl.getAttribute('videoid'))

    let comment = document.querySelector('#input-comment').value

    console.log(comment)

    const q = firebase.firestore().collection('video').where('id', '==', liteEmbedEl.getAttribute('videoid')).get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            doc.ref.update({
                comments: firebase.firestore.FieldValue.arrayUnion(comment)
            });
            atualizaComentario(doc.ref)
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });


}

function atualizaComentario(docRef) {
    // Pegue o documento do vídeo no banco de dados
  
    let comments = []
    let ul = document.getElementById("ul-comments");
    ul.innerHTML = ' '
    // Retorne os comentários do vídeo
    docRef.get().then(document => {
      //return document.data().comments;
      let data = document.data().comments
      data.forEach((c) => {
        ul.innerHTML += '<li>' + c + '</li>';
      })
    });

}

function carregarComentariosIniciais() {
  let liteEmbedEl = document.querySelector("lite-youtube");
  const videoId = liteEmbedEl.getAttribute('videoid');

  const q = firebase.firestore().collection('video').where('id', '==', videoId).get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      atualizaComentario(doc.ref);
    });
  })
  .catch((error) => {
    console.log("Erro ao buscar comentários do vídeo:", error);
  });
}

//like
function checkUserLiked() {
  let liteEmbedEl = document.querySelector("lite-youtube");
  const videoId = liteEmbedEl.getAttribute('videoid');

  const videoRef = firebase.firestore().collection('video').where('id', '==', videoId);

  videoRef.get().then((querySnapshot) => {
    console.log("entrou");

    querySnapshot.forEach((doc) => {
      const likes = doc.data().likes;

      if (likes && likes.includes(firebase.auth().currentUser.uid)) {
        curtirVideo(true);
        return true; // O usuário curtiu o vídeo
      } else {
        curtirVideo(false);
        return false; // O usuário não curtiu o vídeo
      }
    });
  }).catch((error) => {
    console.error("Erro ao verificar se o usuário curtiu o vídeo:", error);
  });
}

// Função para adicionar ou remover a interação de deslike na coleção "interactions"
function curtirVideo (liked) {

  let liteEmbedEl = document.querySelector("lite-youtube");
  // Verificar se o usuário já interagiu com a postagem
  if (liked === true) {
      const q = firebase.firestore().collection('video').where('id', '==', liteEmbedEl.getAttribute('videoid')).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          doc.ref.update({
            likes: firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.uid)
          });
        });
      });
      const q1 = firebase.firestore().collection('usuario').where('uid', '==', firebase.auth().currentUser.uid).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          doc.ref.update({
            liked: firebase.firestore.FieldValue.arrayRemove(liteEmbedEl.getAttribute('videoid'))
          });
        });
      });
      pathElement.setAttribute("fill", "#cccccc");
      console.log(valor.innerHTML);
      valor.innerHTML = Number(valor.innerHTML) - 1;
      console.log("Like removido");
  } else {
    // Se o usuário ainda não interagiu com a postagem, adicione a interação de like
    const q = firebase.firestore().collection('video').where('id', '==', liteEmbedEl.getAttribute('videoid')).get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          doc.ref.update({
              likes: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
              
          });
      });
  });
  const q1 = firebase.firestore().collection('usuario').where('uid', '==', firebase.auth().currentUser.uid).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          doc.ref.update({
            liked: firebase.firestore.FieldValue.arrayUnion(liteEmbedEl.getAttribute('videoid'))
          });
        });
      });
      pathElement.setAttribute("fill", "red");
      console.log(valor.innerHTML);
      valor.innerHTML = Number(valor.innerHTML) + 1;
      console.log("Like adicionado");
  }
};
