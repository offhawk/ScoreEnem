let searchEl = document.querySelector('#input-search-friends');
let searchIconEl = document.querySelector('#friends-icon-search');
let addIconEl = document.querySelector('#friends-icon-add');
let searchDivEl = document.querySelector('#search-list');
let friendsDivEl = document.querySelector('#friends-list');
let infoEl = document.querySelector('#friends-info-p');
let searchListEl = document.querySelector('#search-ul');
let friendsListEl = document.querySelector('#friends-ul');

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
    firebase.firestore()
      .collection("usuario")
      .where("uid", "==", user.uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var userData = doc.data();
            document.getElementById("profile-pic").src = userData.imgURL;
            //inputNome.value = userData.nome;
            //console.log(userData.nome);
            //inputEmail.value = userData.email;
            //inputIdade.value = userData.idade;
            //inputTelefone.value = userData.telefone;
            //inputLoc.value = userData.loc;

            amigos = userData.amigos;
            console.log(amigos)
            let amigosEl = "<p>Nenhum amigo encontrado.</p>";
            if(amigos != null){
                friendsListEl.innerHTML = "";
                amigos.forEach((friend) => {
                    firebase.firestore().collection('usuario').doc(friend).get().then((doc) => {

                        let amigoDoc = doc.data()

                        friendsListEl.innerHTML += `<li><div class="friends-box" data-username="${amigoDoc.username}">
                                                    <div class="img-wrapper">
                                                        <img src="${amigoDoc.imgURL}">
                                                    </div>
                                                    <div class="friends-info">
                                                        <p class="friends-name">${amigoDoc.nome}</p>
                                                        <p class="friends-username">${amigoDoc.username}</p>
                                                    </div>
                                                    <div class="svg-wrapper" onclick="removerAmigo(this.parentElement)">
                                                        <?xml version="1.0" ?><svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M17.5001 11.9998C20.5377 11.9998 23.0001 14.4622 23.0001 17.4998C23.0001 20.5373 20.5377 22.9998 17.5001 22.9998C14.4626 22.9998 12.0001 20.5373 12.0001 17.4998C12.0001 14.4622 14.4626 11.9998 17.5001 11.9998ZM12.0227 13.9986C11.3754 15.0091 11.0001 16.2106 11.0001 17.4998C11.0001 19.1435 11.6102 20.6447 12.6164 21.7893C11.815 21.9311 10.9421 22.0008 10.0001 22.0008C7.11062 22.0008 4.87181 21.3442 3.30894 20.0006C2.48032 19.2882 2.00366 18.2498 2.00366 17.157V16.2497C2.00366 15.0071 3.01102 13.9997 4.25366 13.9997L12.0227 13.9986ZM20.8093 15.252L15.2524 20.809C15.893 21.2449 16.6668 21.4998 17.5001 21.4998C19.7093 21.4998 21.5001 19.7089 21.5001 17.4998C21.5001 16.6665 21.2453 15.8927 20.8093 15.252ZM17.5001 13.4998C15.291 13.4998 13.5001 15.2906 13.5001 17.4998C13.5001 18.3331 13.7549 19.1069 14.1909 19.7475L19.7479 14.1906C19.1072 13.7546 18.3334 13.4998 17.5001 13.4998ZM10.0001 2.00439C12.7615 2.00439 15.0001 4.24297 15.0001 7.00439C15.0001 9.76582 12.7615 12.0044 10.0001 12.0044C7.2387 12.0044 5.00012 9.76582 5.00012 7.00439C5.00012 4.24297 7.2387 2.00439 10.0001 2.00439Z"/></svg>
                                                    </div>
                                                </div></li>`
                    })
                })
            } else friendsListEl.innerHTML = "<p>Nenhum amigo encontrado.</p>"
            hideLoading()
        });
      })
      .catch(function (error) {
        console.log("Erro ao buscar informações do usuário:", error);
        hideLoading()

      });
  }

let amigos = [];



// 0 = Amigos
// 1 = Usuários no geral
let modoPesquisa = 0;

addIconEl.addEventListener('click', alteraPesquisa);
searchIconEl.addEventListener('click', pesquisaAmigo);

function alteraPesquisa() {
    searchDivEl.classList.toggle('hidden');
    friendsDivEl.classList.toggle('hidden');

    if(modoPesquisa == 0){
        modoPesquisa = 1;
        infoEl.innerHTML = "Adicionar amigo";
        addIconEl.innerHTML = `<?xml version="1.0" ?><svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 14L13.5 14.001C14.2793 14.001 14.9204 14.5963 14.9931 15.3566L15 15.501V17.5C14.999 21 11.284 22 8.5 22C5.77787 22 2.1647 21.044 2.00545 17.7296L2 17.5V15.5C2 14.7207 2.59527 14.0796 3.35561 14.0069L3.5 14ZM15.488 14H20.5C21.2793 14 21.9204 14.5944 21.9931 15.3555L22 15.5V17C21.999 20.062 19.142 21 17 21C16.32 21 15.569 20.904 14.86 20.678C15.5128 19.9277 15.9362 18.9748 15.9934 17.78L16 17.5V15.5C16 15.0056 15.8507 14.5488 15.601 14.1616L15.488 14H20.5H15.488ZM8.5 3C10.985 3 13 5.015 13 7.5C13 9.985 10.985 12 8.5 12C6.015 12 4 9.985 4 7.5C4 5.015 6.015 3 8.5 3ZM17.5 5C19.433 5 21 6.567 21 8.5C21 10.433 19.433 12 17.5 12C15.567 12 14 10.433 14 8.5C14 6.567 15.567 5 17.5 5Z"/></svg>`
    } else {
        modoPesquisa = 0;
        infoEl.innerHTML = "Meus amigos";
        fetchUserData(firebase.auth().currentUser)
        addIconEl.innerHTML = `<?xml version="1.0" ?><svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M11.0004 17.5003C11.0004 16.2113 11.3755 15.01 12.0226 13.9996L4.25278 14.0002C3.01076 14.0002 2.00391 15.007 2.00391 16.2491V17.169C2.00391 17.7411 2.18231 18.2989 2.51427 18.7648C4.05643 20.9292 6.5794 22.0013 10.0004 22.0013C10.9317 22.0013 11.7966 21.9219 12.5921 21.7618C11.6006 20.6207 11.0004 19.1306 11.0004 17.5003Z"/><path d="M15.0004 7.00488C15.0004 4.24346 12.7618 2.00488 10.0004 2.00488C7.23894 2.00488 5.00036 4.24346 5.00036 7.00488C5.00036 9.76631 7.23894 12.0049 10.0004 12.0049C12.7618 12.0049 15.0004 9.76631 15.0004 7.00488Z"/><path d="M23.0004 17.5002C23.0004 14.4627 20.5379 12.0002 17.5004 12.0002C14.4628 12.0002 12.0004 14.4627 12.0004 17.5002C12.0004 20.5378 14.4628 23.0002 17.5004 23.0002C20.5379 23.0002 23.0004 20.5378 23.0004 17.5002ZM17.4105 14.0083L17.5004 14.0002L17.5902 14.0083C17.7943 14.0453 17.9553 14.2063 17.9923 14.4104L18.0004 14.5002L17.9994 17.0002H20.5043L20.5942 17.0083C20.7982 17.0453 20.9592 17.2063 20.9962 17.4104L21.0043 17.5002L20.9962 17.5901C20.9592 17.7942 20.7982 17.9551 20.5942 17.9922L20.5043 18.0002H17.9994L18.0004 20.5002L17.9923 20.5901C17.9553 20.7942 17.7943 20.9551 17.5902 20.9922L17.5004 21.0002L17.4105 20.9922C17.2064 20.9551 17.0455 20.7942 17.0084 20.5901L17.0004 20.5002L16.9994 18.0002H14.5043L14.4144 17.9922C14.2103 17.9551 14.0494 17.7942 14.0123 17.5901L14.0043 17.5002L14.0123 17.4104C14.0494 17.2063 14.2103 17.0453 14.4144 17.0083L14.5043 17.0002H16.9994L17.0004 14.5002L17.0084 14.4104C17.0455 14.2063 17.2064 14.0453 17.4105 14.0083Z"/></svg>`
    } 

}

function pesquisaAmigo() {

    if(searchEl.value == ""){
        searchListEl.innerHTML = "";
        fetchUserData(firebase.auth().currentUser)
        return;
    }

    let amigos = [];

    firebase.firestore().collection('usuario').doc(firebase.auth().currentUser.uid).get().then((doc => {
        user = doc.data();
        let amigosArr = user.amigos;
        amigosArr.forEach((amigo) => {
            amigos.push(amigo);
        })
    }));

    // Pesquisa entre os amigos
    if(modoPesquisa == 0){

        if(amigos != null){
            amigos.forEach((friend) => {
                friendsListEl.innerHTML += `<div class="friends-box">
                                                <div class="img-wrapper">
                                                    <img src="../imgs/Nuvem.png">
                                                </div>
                                                <div class="friends-info">
                                                    <p class="friends-name">Gustavo</p>
                                                    <p class="friends-username">@offhawk</p>
                                                </div>
                                                <div class="svg-wrapper">
                                                    <?xml version="1.0" ?><svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M17.5001 11.9998C20.5377 11.9998 23.0001 14.4622 23.0001 17.4998C23.0001 20.5373 20.5377 22.9998 17.5001 22.9998C14.4626 22.9998 12.0001 20.5373 12.0001 17.4998C12.0001 14.4622 14.4626 11.9998 17.5001 11.9998ZM12.0227 13.9986C11.3754 15.0091 11.0001 16.2106 11.0001 17.4998C11.0001 19.1435 11.6102 20.6447 12.6164 21.7893C11.815 21.9311 10.9421 22.0008 10.0001 22.0008C7.11062 22.0008 4.87181 21.3442 3.30894 20.0006C2.48032 19.2882 2.00366 18.2498 2.00366 17.157V16.2497C2.00366 15.0071 3.01102 13.9997 4.25366 13.9997L12.0227 13.9986ZM20.8093 15.252L15.2524 20.809C15.893 21.2449 16.6668 21.4998 17.5001 21.4998C19.7093 21.4998 21.5001 19.7089 21.5001 17.4998C21.5001 16.6665 21.2453 15.8927 20.8093 15.252ZM17.5001 13.4998C15.291 13.4998 13.5001 15.2906 13.5001 17.4998C13.5001 18.3331 13.7549 19.1069 14.1909 19.7475L19.7479 14.1906C19.1072 13.7546 18.3334 13.4998 17.5001 13.4998ZM10.0001 2.00439C12.7615 2.00439 15.0001 4.24297 15.0001 7.00439C15.0001 9.76582 12.7615 12.0044 10.0001 12.0044C7.2387 12.0044 5.00012 9.76582 5.00012 7.00439C5.00012 4.24297 7.2387 2.00439 10.0001 2.00439Z"/></svg>
                                                </div>
                                            </div>`
            })
        }

        friendsListEl.innerHTML = amigos == null? "Nenhum amigo encontrado.": friendsListEl.innerHTML;

    } else {
        let pesquisa = searchEl.value;
        console.log(pesquisa);
        searchListEl.innerHTML = "Pesquisando...";
        let user;

        firebase.firestore().collection('usuario').orderBy('nomeSearch').where('nomeSearch', '>=', pesquisa.toUpperCase()).where('username', '>=', pesquisa.toLowerCase()).get().then((snapshot => {
            if(!snapshot.empty){
                searchListEl.innerHTML = "";
            } else searchListEl.innerHTML = "Nenhum usuário encontrado.";
            snapshot.forEach((doc) => {
                user = doc.data()
                console.log(user)

                searchListEl.innerHTML += `<li>
                                                <div class="friends-box" id="search-box" data-username="${user.username}">
                                                    <div class="img-wrapper">
                                                        <img src="${user.imgURL}">
                                                    </div>
                                                    <div class="friends-info">
                                                        <p class="friends-name">${user.nome}</p>
                                                        <p class="friends-username">@${user.username}</p>
                                                    </div>
                                                    <div class="svg-wrapper" ${amigos.includes(user.uid)?``:`onclick="addAmigo(this.parentElement)"`}>
                                                        ${amigos.includes(user.uid)?`
                                                            <?xml version="1.0" ?><svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M17.5001 11.9998C20.5377 11.9998 23.0001 14.4622 23.0001 17.4998C23.0001 20.5373 20.5377 22.9998 17.5001 22.9998C14.4626 22.9998 12.0001 20.5373 12.0001 17.4998C12.0001 14.4622 14.4626 11.9998 17.5001 11.9998ZM12.0224 13.9991C11.3753 15.0095 11.0001 16.2108 11.0001 17.4998C11.0001 19.1301 11.6003 20.6202 12.5919 21.7613C11.7963 21.9214 10.9314 22.0008 10.0001 22.0008C6.57915 22.0008 4.05619 20.9287 2.51403 18.7643C2.18207 18.2984 2.00366 17.7406 2.00366 17.1685V16.2486C2.00366 15.0065 3.01052 13.9997 4.25254 13.9997L12.0224 13.9991ZM14.8537 17.1462C14.6584 16.951 14.3418 16.951 14.1466 17.1462C13.9513 17.3415 13.9513 17.6581 14.1466 17.8533L16.1466 19.8533C16.3418 20.0486 16.6584 20.0486 16.8537 19.8533L20.8537 15.8533C21.0489 15.6581 21.0489 15.3415 20.8537 15.1462C20.6584 14.951 20.3418 14.951 20.1466 15.1462L16.5001 18.7927L14.8537 17.1462ZM10.0001 2.00439C12.7615 2.00439 15.0001 4.24297 15.0001 7.00439C15.0001 9.76582 12.7615 12.0044 10.0001 12.0044C7.2387 12.0044 5.00012 9.76582 5.00012 7.00439C5.00012 4.24297 7.2387 2.00439 10.0001 2.00439Z" fill="#14EBB1"/></svg>`:`
                                                            <?xml version="1.0" ?><svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M11.0004 17.5003C11.0004 16.2113 11.3755 15.01 12.0226 13.9996L4.25278 14.0002C3.01076 14.0002 2.00391 15.007 2.00391 16.2491V17.169C2.00391 17.7411 2.18231 18.2989 2.51427 18.7648C4.05643 20.9292 6.5794 22.0013 10.0004 22.0013C10.9317 22.0013 11.7966 21.9219 12.5921 21.7618C11.6006 20.6207 11.0004 19.1306 11.0004 17.5003Z"/><path d="M15.0004 7.00488C15.0004 4.24346 12.7618 2.00488 10.0004 2.00488C7.23894 2.00488 5.00036 4.24346 5.00036 7.00488C5.00036 9.76631 7.23894 12.0049 10.0004 12.0049C12.7618 12.0049 15.0004 9.76631 15.0004 7.00488Z"/><path d="M23.0004 17.5002C23.0004 14.4627 20.5379 12.0002 17.5004 12.0002C14.4628 12.0002 12.0004 14.4627 12.0004 17.5002C12.0004 20.5378 14.4628 23.0002 17.5004 23.0002C20.5379 23.0002 23.0004 20.5378 23.0004 17.5002ZM17.4105 14.0083L17.5004 14.0002L17.5902 14.0083C17.7943 14.0453 17.9553 14.2063 17.9923 14.4104L18.0004 14.5002L17.9994 17.0002H20.5043L20.5942 17.0083C20.7982 17.0453 20.9592 17.2063 20.9962 17.4104L21.0043 17.5002L20.9962 17.5901C20.9592 17.7942 20.7982 17.9551 20.5942 17.9922L20.5043 18.0002H17.9994L18.0004 20.5002L17.9923 20.5901C17.9553 20.7942 17.7943 20.9551 17.5902 20.9922L17.5004 21.0002L17.4105 20.9922C17.2064 20.9551 17.0455 20.7942 17.0084 20.5901L17.0004 20.5002L16.9994 18.0002H14.5043L14.4144 17.9922C14.2103 17.9551 14.0494 17.7942 14.0123 17.5901L14.0043 17.5002L14.0123 17.4104C14.0494 17.2063 14.2103 17.0453 14.4144 17.0083L14.5043 17.0002H16.9994L17.0004 14.5002L17.0084 14.4104C17.0455 14.2063 17.2064 14.0453 17.4105 14.0083Z"/></svg>`
                                                        }
                                                    </div>
                                                </div>
                                            </li>`
            })
        }));
    }
}

function addAmigo(parent) {

    const userRef = firebase.firestore().collection('usuario').doc(firebase.auth().currentUser.uid);
    const amigoRef = firebase.firestore().collection('usuario').where("username", "==", parent.dataset.username).get().then((snapshot => {
            snapshot.forEach((doc) => {
                userRef.update({
                    amigos: firebase.firestore.FieldValue.arrayUnion(doc.data().uid)
                })
                let divSvgEl = parent.querySelector('.svg-wrapper');
                divSvgEl.innerHTML = `<?xml version="1.0" ?><svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M17.5001 11.9998C20.5377 11.9998 23.0001 14.4622 23.0001 17.4998C23.0001 20.5373 20.5377 22.9998 17.5001 22.9998C14.4626 22.9998 12.0001 20.5373 12.0001 17.4998C12.0001 14.4622 14.4626 11.9998 17.5001 11.9998ZM12.0224 13.9991C11.3753 15.0095 11.0001 16.2108 11.0001 17.4998C11.0001 19.1301 11.6003 20.6202 12.5919 21.7613C11.7963 21.9214 10.9314 22.0008 10.0001 22.0008C6.57915 22.0008 4.05619 20.9287 2.51403 18.7643C2.18207 18.2984 2.00366 17.7406 2.00366 17.1685V16.2486C2.00366 15.0065 3.01052 13.9997 4.25254 13.9997L12.0224 13.9991ZM14.8537 17.1462C14.6584 16.951 14.3418 16.951 14.1466 17.1462C13.9513 17.3415 13.9513 17.6581 14.1466 17.8533L16.1466 19.8533C16.3418 20.0486 16.6584 20.0486 16.8537 19.8533L20.8537 15.8533C21.0489 15.6581 21.0489 15.3415 20.8537 15.1462C20.6584 14.951 20.3418 14.951 20.1466 15.1462L16.5001 18.7927L14.8537 17.1462ZM10.0001 2.00439C12.7615 2.00439 15.0001 4.24297 15.0001 7.00439C15.0001 9.76582 12.7615 12.0044 10.0001 12.0044C7.2387 12.0044 5.00012 9.76582 5.00012 7.00439C5.00012 4.24297 7.2387 2.00439 10.0001 2.00439Z" fill="#14EBB1"/></svg>`
            })
    }))

}

function removerAmigo(parent) {

    let username = parent.dataset.username;

    const userRef = firebase.firestore().collection('usuario').doc(firebase.auth().currentUser.uid);
    const amigoRef = firebase.firestore().collection('usuario').where("username", "==", username).get().then((snapshot => {
            snapshot.forEach((doc) => {
                userRef.update({
                    amigos: firebase.firestore.FieldValue.arrayRemove(doc.data().uid)
                })
              
                fetchUserData(firebase.auth().currentUser);
            })
    }))
}