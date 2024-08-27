// const { PopupCancelledError } = require("@auth0/auth0-spa-js");
const elemento = document.getElementById("caja");
const elementoOculto = document.getElementById("caja2");

function login(response) {
  const responsePayload = decodeJwtResponse(response.credential);
     console.log("ID: " + responsePayload.sub);
     console.log('Full Name: ' + responsePayload.name);
     console.log('Given Name: ' + responsePayload.given_name);
     console.log('Family Name: ' + responsePayload.family_name);
     console.log("Image URL: " + responsePayload.picture);
     console.log("Email: " + responsePayload.email);
     const nombreUsuario = document.getElementById("nombreUsuario");
     const nombre = responsePayload.given_name.split(" ")[0];
     nombreUsuario.textContent = nombre;
     const imagenUsuario = document.getElementById("imagenUsuario");
     imagenUsuario.src= responsePayload.picture;
     sessionStorage.setItem("nombre", nombre);
     sessionStorage.setItem("imagen", responsePayload.picture);
     alert('Hola '+nombre);
     ocultarElemento();

}
function decodeJwtResponse(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

function ocultarElemento() {
    elemento.style.display = 'none';
    elementoOculto.style.display = 'flex'
}
function mostrarElemento() {
    elemento.style.display = 'flex';
    elementoOculto.style.display = 'none'
}
function signOut() {
  sessionStorage.removeItem("nombre");
  sessionStorage.removeItem("imagen");
  mostrarElemento();
  // const auth2 = gapi.auth2.getAuthInstance();
  // auth2.signOut().then(function () {
  //   console.log('User signed out.');
  // });
}

function init() {
  gapi.load('auth2', function() {
    gapi.auth2.init();
  });
}
function comprobarSesion() {
  const nombre = sessionStorage.getItem("nombre");
  if (nombre) {
    const nombreUsuario = document.getElementById("nombreUsuario");
    nombreUsuario.textContent = nombre;
    const imagen = sessionStorage.getItem("imagen");
    const imagenUsuario = document.getElementById("imagenUsuario");
    imagenUsuario.src= imagen;
    ocultarElemento();
  }
}
document.addEventListener("DOMContentLoaded", comprobarSesion);