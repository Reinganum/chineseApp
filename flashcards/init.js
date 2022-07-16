// revisar que usuario tenga token de ingreso //

var copiaToken = JSON.parse(localStorage.getItem('token'));

function verificarLogin(token){
    if (token === "valido") {
        console.log('hola')
    } else {console.log('chao')
    window.location = '/login.html';
}
}

verificarLogin(copiaToken);
