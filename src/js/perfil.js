import { noti } from "./noti.js";
let n = new noti();

var menuOpcionesHome = "cerrado";

function abrirMenu() {
	$("#opcionesHome").show();
	$("#botonDesplegarMenu i").removeClass();
	$("#botonDesplegarMenu i").addClass('fa-solid fa-arrow-up');
	$("#botonDesplegarMenu").addClass('mb-2');
	menuOpcionesHome = "abierto";
}


function cerrarSesion() {
	localStorage.removeItem('usuarioLogin');
	window.location.replace('./index.html');
}

function cerrarMenu() {
	$("#opcionesHome").hide();
	$("#botonDesplegarMenu i").removeClass();
	$("#botonDesplegarMenu i").addClass('fa-solid fa-arrow-down');
	$("#botonDesplegarMenu").removeClass('mb-2');
	menuOpcionesHome = "cerrado";
}

function iniciarPerfil() {
// Cargaremos el perfil segun la variable sessionStorage idPerfil, si no hay ninguna, se cargará la del usuario logueado actualmente

	var idusuario = sessionStorage.getItem('idPerfil');
	if (idusuario=="" || idusuario==null) idusuario = localStorage.getItem('idUsuario');

	$.ajax({
		url: "http://192.168.1.38/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
		data: { funcion: "obtenerUsuario", idusuario: idusuario},
		success: function (result) {
			let perfil = result[0];
			// Transformamos el json de albumes en un objeto para más comodidad
			let albumes = JSON.parse(result.albumes);

			$("#usuarioNombre").html(perfil.nombre);
			$("#usuarioDatosNombre").html(perfil.nombre);
			$("#usuarioDatosIdentificador").html("@"+perfil.identificador);

			albumes.forEach(function(album) {
				let usuarioAlbum = document.createElement('div');
				usuarioAlbum.setAttribute('id',album.id);
				usuarioAlbum.setAttribute('nombre',album.nombre);
				usuarioAlbum.addEventListener('click',irAAlbum);
				usuarioAlbum.style = "cursor: pointer;";
				usuarioAlbum.classList = "bg-indigo-300 rounded-md lg:h-48 lg:w-48 flex justify-center hover:bg-indigo-500";

				let albumTitulo = document.createElement("div");
				albumTitulo.textContent = album.nombre;

				let albumImagen = document.createElement('div');
				albumImagen.classList = "h-32";

				// añadimos elementos al div de albumes
				usuarioAlbum.append(albumTitulo);
				usuarioAlbum.append(albumImagen);
				$("#usuarioAlbums").append(usuarioAlbum);
			});


		}
	});


}

function irAAlbum(event) {

	// Cogemos el id y el nombre del album
	let idalbum = (event.currentTarget.id);
	let nombrealbum = (event.currentTarget.attributes.nombre.value);

	//asignamos cookie para saber adonde vamos y usaremos el nombre posteriormente
	sessionStorage.setItem('idAlbum',idalbum);
	sessionStorage.setItem('nombreAlbum',nombrealbum);
	window.location.assign("./album.html");
	
};


$("#botonDesplegarMenu").click(function () {
	if (menuOpcionesHome == 'cerrado') abrirMenu();
	else cerrarMenu();
});

$("#botonCerrarSesion").click(function () {
	cerrarSesion();
});

iniciarPerfil();