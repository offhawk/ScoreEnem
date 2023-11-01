const form   = document.getElementById('label-cadastro');
const campos = document.querySelectorAll('.required');
const spans   = document.querySelectorAll('.span-required');
const emailRegex = /\S+@\S+\.\S+/;

let erros = 0;

function setError(index){
    campos[index].style.border = '2px solid #ff0000';
    spans[index].style.display = 'block';

    spans.forEach((span => {
        if(span.style.display == 'block'){
            erros--;
        } else erros++;
    }))
    
}

function removeError(index){
    campos[index].style.border = '';
    spans[index].style.display = 'none';


    erros = 0;

    spans.forEach((span => {
        if(span.style.display == 'none'){
            erros++;
        } else erros--;
    }))

    console.log(spans.length)
    console.log(erros)

    if(erros == spans.length){
        document.getElementById('input-cadastro').removeAttribute('disabled');
    } else document.getElementById('input-cadastro').setAttribute('disabled', '');

}

function nameValidate(){
    if(campos[0].value.length < 3) {
        setError(0);

    } else {
        removeError(0);
    }
}

function userValidate(){
    if(campos[1].value.length < 3) {
        setError(1);
    } else {
        removeError(1);
    }

}

function emailValidate(){
    if(!emailRegex.test(campos[2].value)) {
        setError(2);
    } else {
        removeError(2);
    }
}

function mainPasswordValidate(){
    if(campos[3].value.length < 6) {
        setError(3);
    } else {
        removeError(3);
        comparePassword();
    }
}

function comparePassword(){
    
    if(campos[3].value == campos[4].value && campos[4].value.length >= 6) {
        removeError(4);
    } else {
        setError(4);
    }
}



