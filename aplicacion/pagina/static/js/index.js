const elemento = document.getElementById("caja");
const elementoOculto = document.getElementById("caja2");

function login(response) {
  const responsePayload = decodeJwtResponse(response.credential);
     
     const nombreUsuario = document.getElementById("nombreUsuario");
     const nombre = responsePayload.given_name.split(" ")[0];
     nombreUsuario.textContent = nombre;
     const imagenUsuario = document.getElementById("imagenUsuario");
     imagenUsuario.src= responsePayload.picture;
     sessionStorage.setItem("nombre", nombre);
     sessionStorage.setItem("imagen", responsePayload.picture);
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
}

function init() {
  gapi.load('auth2', function() {
    gapi.auth2.init()
    {
      client_id : '731724841818-fv7v54nb8gk2vh5bgecp9qfr41nq4odj.apps.googleusercontent.com';
    };
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