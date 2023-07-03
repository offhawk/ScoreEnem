let inputsEl = document.querySelectorAll('input');
let modal = document.getElementById('modal-full');

function alteraModal(e) {

    inputsEl.forEach(input => {
        input.value = "";
    });

    modal.classList.toggle('show');
}