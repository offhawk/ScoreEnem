function showLoading() {
    const div = document.createElement("div");
    div.classList.add('loading')

    div.innerHTML = '<div><?xml version="1.0" ?><svg fill="none" height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M4 24C4 35.0457 12.9543 44 24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4" stroke="#21EDC5" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"/></svg></div>'

    document.body.appendChild(div);
}

function hideLoading() {
    const loadings = document.getElementsByClassName("loading");
    if (loadings.length) {
        loadings[0].remove();
    }
} 