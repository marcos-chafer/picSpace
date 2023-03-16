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
	// Cogemos siempres nuestro propio perfil para una futura comprobación de seguimiento
	var idseguidor = localStorage.getItem('idUsuario');

	// Si el idusuario esta vacío, es nuestro propio perfil
	if (idusuario=="" || idusuario==null){
		idusuario = localStorage.getItem('idUsuario');
	}

	// Controlamos notis
	let noti = sessionStorage.getItem('noti');
	switch (noti) {
		case "modificarUsuario":
			n.notiInfo("Perfil modificado con éxito");
			break;
		case "usuarioSeguido":
			n.notiInfo("Perfil seguido con éxito");
			break;
		case "usuarioNoSeguido":
			n.notiInfo("Perfil dejado de seguir con éxito");
			break;
		default:
			break;
	}
	//Limpiamos noti una vez controlada
	sessionStorage.removeItem('noti');

	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
		data: { funcion: "obtenerUsuario", idusuario: idusuario, idseguidor:idseguidor},
		success: function (result) {
			console.log(result);
			let perfil = result[0];
			// Transformamos el json de albumes en un objeto para más comodidad
			let albumes = JSON.parse(result.albumes);

			$("#usuarioNombre").html(perfil.nombre);
			$("#usuarioDatosNombre").html(perfil.nombre);
			$("#usuarioDatosIdentificador").html("@"+perfil.identificador);
			$("#usuarioSiguiendo").html(result.seguidos+" siguiendo");
			$("#usuarioSeguidores").html(result.seguidores+" seguidores");
			
			let imagenPerfil = document.createElement('img');
			if (perfil.ruta == null) imagenPerfil.setAttribute('src',"./../assets/img/iconousuario.svg");
			else imagenPerfil.setAttribute('src',perfil.ruta);
			imagenPerfil.classList = "w-32 h-32 rounded-full"

			$("#usuarioImagen").append(imagenPerfil);

			albumes.forEach(function(album) {
				let usuarioAlbum = document.createElement('div');
				usuarioAlbum.setAttribute('id',album.id);
				usuarioAlbum.setAttribute('nombre',album.nombre);
				usuarioAlbum.addEventListener('click',irAAlbum);
				usuarioAlbum.style = "cursor: pointer;";
				usuarioAlbum.classList = "albumCard w-40";

				let albumTitulo = document.createElement("div");
				albumTitulo.textContent = album.nombre;

				let albumImagen = document.createElement('div');
				albumImagen.classList = "h-32";

				// añadimos elementos al div de albumes
				usuarioAlbum.append(albumTitulo);
				usuarioAlbum.append(albumImagen);
				$("#usuarioAlbums").append(usuarioAlbum);
			});

			// Controlamos botón seguir
			if (idusuario!=localStorage.getItem('idUsuario')){

				if (result.seSiguen == "false"){
					let botonSeguir = document.createElement('button');
					botonSeguir.setAttribute('id',perfil.id);
					botonSeguir.classList = "boton  hover:scale-125 transition duration-300 ease-in-out";
					botonSeguir.addEventListener('click',seguir);
					botonSeguir.textContent = "Seguir";
	
	
					$("#infoPerfil").append(botonSeguir)
				}
				else if (result.seSiguen == "true"){
					let botonSeguido = document.createElement('button');
					botonSeguido.setAttribute('id',perfil.id);
					botonSeguido.classList = "boton hover:scale-125 hover:bg-red-800 transition duration-300 ease-in-out";
					botonSeguido.addEventListener('click',noSeguir);
					botonSeguido.textContent = "Seguido";
	
	
					$("#infoPerfil").append(botonSeguido)
				}

				
			}


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

function seguir(event) {
	// Cogemos el id a seguir y nuestro id
	let idusuario = (event.currentTarget.id);
	var idseguidor = localStorage.getItem('idUsuario');

	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
		data: { funcion: "seguirUsuario", idusuario: idusuario, idseguidor:idseguidor},
		success: function (result) {
			sessionStorage.setItem('noti','usuarioSeguido');
			console.log(result);
			window.location.reload();
		

		}
	});

}

function noSeguir(event) {
	// Cogemos el id a seguir y nuestro id
	let idusuario = (event.currentTarget.id);
	var idseguidor = localStorage.getItem('idUsuario');

	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
		data: { funcion: "noSeguirUsuario", idusuario: idusuario, idseguidor:idseguidor},
		success: function (result) {
			sessionStorage.setItem('noti','usuarioNoSeguido');
			console.log(result);
			window.location.reload();
		

		}
	});

}


$("#botonDesplegarMenu").click(function () {
	if (menuOpcionesHome == 'cerrado') abrirMenu();
	else cerrarMenu();
});

$("#IrAMiPerfil").click(function() {
	sessionStorage.removeItem('idPerfil');
	window.location.assign("./perfil.html");
})

$("#usuarioAjustes").click(function(){
	window.location.assign("./ajustesperfil.html");
})

$("#botonCerrarSesion").click(function () {
	cerrarSesion();
});

iniciarPerfil();