let videos = [];

let videosEl = firebase.firestore().collection('video').orderBy("order").get().then(snapshot => {
    videos = snapshot.docs.map(doc => doc.data());
    preenchePlaylist(videos);
})   

const videosDivEl = document.querySelector("#videos-list");

let mainTitle = document.querySelector(".main-title");
let mainVideo = document.querySelector("iframe");

function preenchePlaylist(videos) {

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
    
        img.src = "https://i3.ytimg.com/vi/" + video.id + "/maxresdefault.jpg";
    
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

    let videosPlaylistEl = document.querySelectorAll('.video-line');

    videosPlaylistEl.forEach(video => {
        video.addEventListener('click', alteraVideo)
    });

}


function alteraVideo(e) {

    let clicado = e.currentTarget;
    mainTitle.innerHTML = clicado.dataset.titulo;
    mainVideo.src = "https://www.youtube.com/embed/" + clicado.dataset.id;

}