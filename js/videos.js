showLoading();

firebase.auth().onAuthStateChanged(function(user){
  if (user == null || user == "") {
      hideLoading()
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

document.addEventListener('DOMContentLoaded', function () {
  // Adiciona um evento de escuta ao pressionar a tecla "Enter" no campo de input
  document.querySelector('#input-comment').addEventListener('keyup', function (event) {
      if (event.key === 'Enter') {
          addComment(); // Chama a função addComment() ao pressionar "Enter"
      }
  });
});

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

  // Limpar o valor do input após enviar o comentário
  document.querySelector('#input-comment').value = '';
}

function atualizaComentario(docRef) {
  // Pegue o documento do vídeo no banco de dados

  let comments = []
  let ul = document.getElementById("ul-comments");
  ul.innerHTML = ' ';
  
  // Retorne os comentários do vídeo
  docRef.get().then(document => {
      let data = document.data().comments;

      // Iterar pelos comentários em ordem reversa
      for (let i = data.length - 1; i >= 0; i--) {
          ul.innerHTML += '<li>' + data[i] + '</li>';
      }
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

function marcarComoAssistido() {
  // Obtenha o ID do vídeo atualmente em exibição
  let liteEmbedEl = document.querySelector("lite-youtube");
  const videoId = liteEmbedEl.getAttribute('videoid');
  let mainTitle = document.querySelector(".main-title").innerHTML;

  // Obtenha o ID do usuário atualmente autenticado
  const userId = firebase.auth().currentUser.uid;

  // Consulte o banco de dados para verificar se o vídeo já está marcado como assistido
  firebase.firestore().collection('usuario').doc(userId).get()
    .then((doc) => {
      if (doc.exists) {
        const watchedVideos = doc.data().watched || [];

        // Verifique se o vídeo já está na lista de assistidos
        if (watchedVideos.includes(videoId)) {
          // Se estiver, remova o vídeo da lista
          firebase.firestore().collection('usuario').doc(userId).update({
            watched: firebase.firestore.FieldValue.arrayRemove({id: videoId, titulo: mainTitle})
          });
          console.log("Vídeo removido da lista de assistidos");
        } else {
          // Se não estiver, adicione o vídeo à lista
          firebase.firestore().collection('usuario').doc(userId).update({
            watched: firebase.firestore.FieldValue.arrayUnion({id: videoId, titulo: mainTitle})
          });
          console.log("Vídeo adicionado à lista de assistidos");
        }
      } else {
        console.error("Documento do usuário não encontrado.");
      }
    })
    .catch((error) => {
      console.error("Erro ao marcar como assistido:", error);
    });
}