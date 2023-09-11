const form   = document.getElementById('label-cadastro');
const campos = document.querySelectorAll('.required');
const spans   = document.querySelectorAll('.span-required');
const emailRegex = /\S+@\S+\.\S+/;

function setError(index){
    campos[index].style.border = '2px solid #ff0000';
    spans[index].style.display = 'block';
    
}

function removeError(index){
    campos[index].style.border = '';
    spans[index].style.display = 'none';

}

function nameValidate(){
    if(campos[0].value.length < 3) {

        setError(0);

    } else {
        removeError(0);
    }
}

function telValidate(){
    if(campos[1].value.length < 11) {

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



