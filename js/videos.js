showLoading();

let watched;
let imageurl;
let spottinho;

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
        /*inputNome.value = userData.nome;
        console.log(userData.nome);
        inputEmail.value = userData.email;
        //inputIdade.value = userData.idade;
        inputTelefone.value = userData.telefone;
        //inputLoc.value = userData.loc;*/
        imageurl = userData.imgURL;
        spottinho = userData.nome;
        watched = userData.watched;
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
    let likeButton = document.getElementById("contador");
    liteEmbedEl.setAttribute("videoid", videos[0].id); 
    mainVideo.style = "background-image: " + "url('https://i.ytimg.com/vi/" + videos[0].id + "/maxresdefault.jpg')"
    mainVideoBox.appendChild(liteEmbedEl);

    mainTitle.innerHTML = videos[0].titulo;
    carregarComentariosIniciais();
    valor.innerHTML = videos[0].likes?videos[0].likes.length:"0";
    
      const videoRef = firebase.firestore().collection('video').where('id', '==', videos[0].id);
      videoRef.get().then((querySnapshot) => {
        console.log("entrou");
    
        querySnapshot.forEach((doc) => {
          const likes = doc.data().likes;
    
          if (likes && likes.includes(firebase.auth().currentUser.uid)) {
          pathElement.setAttribute("fill", "red");
          console.log(valor.innerHTML);
          console.log("Like adicionado");
          let primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
          likeButton.style.backgroundColor = "rgba(20, 235, 177, 0.1)";
          likeButton.style.borderColor = "rgba(20, 235, 177, 0.5)";
          }
          else  {
            pathElement.setAttribute("fill", "var(--secondary)");
            console.log(valor.innerHTML);
            console.log("Like removido");
            likeButton.style.backgroundColor = "";
            likeButton.style.borderColor = "";
          }      
        }
        );
      }).catch((error) => {
        console.error("Erro ao verificar se o usuário curtiu o vídeo:", error);
      });
      
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

    let likeButton = document.getElementById("contador");
    let clicado = e.currentTarget;
    const olhoSvg = document.getElementById('olho');
    olhoSvg.innerHTML = '';

    const isWatched = watched.filter(vid => vid.id == clicado.dataset.id).length > 0;
    const videoRef = firebase.firestore().collection('video').where('id', '==', clicado.dataset.id);

      videoRef.get().then((querySnapshot) => {
        console.log("entrou");
    
        querySnapshot.forEach((doc) => {
          const likes = doc.data().likes;
    
          if (likes && likes.includes(firebase.auth().currentUser.uid)) {
          pathElement.setAttribute("fill", "red");
          console.log(valor.innerHTML);
          console.log("Like adicionado");
          let primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
          likeButton.style.backgroundColor = "rgba(20, 235, 177, 0.1)";
          likeButton.style.borderColor = "rgba(20, 235, 177, 0.5)";
          }
          else  {
            pathElement.setAttribute("fill", "var(--secondary)");
            console.log(valor.innerHTML);
            console.log("Like removido");
            likeButton.style.backgroundColor = "";
            likeButton.style.borderColor = "";
          }   
        });
      }).catch((error) => {
        console.error("Erro ao verificar se o usuário curtiu o vídeo:", error);
      }); // Limpa o conteúdo atual do SVG

      if (!isWatched) {
        // Adicione aqui o código SVG para o estado inicial
        olhoSvg.innerHTML = '<path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="var(--text)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="var(--text)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
        olhoSvg.classList.remove('assistido');
    } else {
        // Adicione aqui o código SVG para o estado após a modificação
        olhoSvg.innerHTML = '<path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="var(--text)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        olhoSvg.classList.add('assistido');
      } 

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
  console.log(imageurl)
  console.log(spottinho)
  const q = firebase.firestore().collection('video').where('id', '==', liteEmbedEl.getAttribute('videoid')).get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          doc.ref.update({
              comments: firebase.firestore.FieldValue.arrayUnion({comentario: comment, pfp: imageurl, username: spottinho})
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
  let likeButton = document.getElementById("contador");
  let valor = document.getElementById("valor");
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
      pathElement.setAttribute("fill", "var(--secondary)");
      console.log(valor.innerHTML);
      valor.innerHTML = Number(valor.innerHTML) - 1;
      console.log("Like removido");
      likeButton.style.backgroundColor = "";
      likeButton.style.borderColor = "";
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
      let primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
      likeButton.style.backgroundColor = "rgba(20, 235, 177, 0.1)";
      likeButton.style.borderColor = "rgba(20, 235, 177, 0.5)";
  }
};

// Adicione este código JS ao seu script existente

function exibirModalAssistido() {
  // Obtenha o ID do vídeo atualmente em exibição
  let liteEmbedEl = document.querySelector("lite-youtube");
  const videoId = liteEmbedEl.getAttribute('videoid');

  // Obtenha o ID do usuário atualmente autenticado
  const userId = firebase.auth().currentUser.uid;

  // Consulte o banco de dados para verificar se o vídeo já está marcado como assistido
  firebase.firestore().collection('usuario').doc(userId).get()
      .then((doc) => {
          if (doc.exists) {
              const watchedVideos = doc.data().watched || [];

              // Verifique se o vídeo já está na lista de assistidos
              let isWatched = watchedVideos.filter(vid => vid.id == videoId).length > 0;

              // Criação da janela modal
              var modal = document.createElement('div');
              modal.id = 'modal';

              // Conteúdo da modal
              var modalContent = document.createElement('div');
              modalContent.id = 'modal-content';

              var h1 = document.createElement('h1');
              h1.textContent = isWatched ? 'Deseja remover este vídeo da lista de assistidos?' : 'Deseja marcar o vídeo como assistido?';

              var p = document.createElement('p');

              var btnCancel = document.createElement('button');
              btnCancel.textContent = 'CANCELAR';
              btnCancel.classList.add('btn', 'btn-cancel');
              btnCancel.id = 'cancelar';

              var btnAction = document.createElement('button');
              btnAction.id = 'sair-modal';

              // Adiciona a classe 'btn-add' se o vídeo não estiver assistido e 'btn-exit' se já estiver assistido
              btnAction.classList.add('btn', isWatched ? 'btn-exit' : 'btn-add');
              btnAction.textContent = isWatched ? 'REMOVER' : 'ADICIONAR';

              modalContent.appendChild(h1);
              modalContent.appendChild(p);
              modalContent.appendChild(btnCancel);
              modalContent.appendChild(btnAction);

              modal.appendChild(modalContent);

              // Adiciona a modal ao corpo do documento
              document.body.appendChild(modal);

              // Fecha a modal ao clicar no botão "Cancelar"
              document.getElementById('cancelar').addEventListener('click', function () {
                  document.body.removeChild(modal);
              });

              // Fecha a modal ao clicar fora dela
              modal.addEventListener('click', function (event) {
                  if (event.target === modal) {
                      document.body.removeChild(modal);
                  }
              });

              // Adiciona a animação
              modalContent.classList.add('animate__animated', 'animate__bounceIn');

              // Adiciona a função para chamar marcarAssistido() ao clicar no botão "ADICIONAR" ou "REMOVER"
              btnAction.addEventListener('click', function (event) {
                  event.stopPropagation();
                  marcarAssistido(videoId, isWatched);
                  document.body.removeChild(modal);

                  // Modifica o SVG ao clicar no botão
                  const olhoSvg = document.getElementById('olho');
                  olhoSvg.innerHTML = ''; // Limpa o conteúdo atual do SVG

                  if (isWatched) {
                      // Adicione aqui o código SVG para o estado inicial
                      olhoSvg.innerHTML = '<path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="var(--text)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="var(--text)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
                      olhoSvg.classList.remove('assistido');
                  } else {
                      // Adicione aqui o código SVG para o estado após a modificação
                      olhoSvg.innerHTML = '<path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="var(--text)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                      olhoSvg.classList.add('assistido');
                  }
              });
          } else {
              console.error("Documento do usuário não encontrado.");
          }
      })
      .catch((error) => {
          console.error("Erro ao verificar se o vídeo está marcado como assistido:", error);
      });
}

function marcarAssistido(videoId, isWatched) {
  // Obtenha o ID do usuário atualmente autenticado
  const userId = firebase.auth().currentUser.uid;
  const mainTitle = document.querySelector(".main-title").innerHTML;

  // Atualiza a lista de vídeos assistidos no banco de dados
  if (isWatched) {
      firebase.firestore().collection('usuario').doc(userId).update({
          watched: firebase.firestore.FieldValue.arrayRemove({id: videoId, titulo: mainTitle})
      });
      console.log("Vídeo removido da lista de assistidos");
  } else {
      firebase.firestore().collection('usuario').doc(userId).update({
          watched: firebase.firestore.FieldValue.arrayUnion({id: videoId, titulo: mainTitle})
      });
      console.log("Vídeo adicionado à lista de assistidos");
  }
}
