showLoading();

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

let videosPlaylistEl = [];

function preenchePlaylist(videos) {

    mainVideoBox.firstElementChild.remove()
    let liteEmbedEl = document.createElement("lite-youtube");
    liteEmbedEl.setAttribute("videoid", videos[0].id); 
    mainVideo.style = "background-image: " + "url('https://i.ytimg.com/vi/" + videos[0].id + "/maxresdefault.jpg')"
    mainVideoBox.appendChild(liteEmbedEl);

    mainTitle.innerHTML = videos[0].titulo;

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

}

function atualizaPlaylist(elemento) {

    videosPlaylistEl.forEach(video => {
        video.classList.remove('play-select');
    });
    
    elemento.classList.toggle('play-select');

}