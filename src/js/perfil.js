import { noti } from "./noti.js";
let n = new noti();

var menuOpcionesHome = "cerrado";
var idusuario;

function abrirMenu() {
	$("#opcionesHome").show();
	$("#botonDesplegarMenu i").removeClass();
	$("#botonDesplegarMenu i").addClass('fa-solid fa-arrow-up');
	$("#botonDesplegarMenu").addClass('mb-2');
	menuOpcionesHome = "abierto";
}


function cerrarSesion() {
	localStorage.removeItem('usuarioLogin');
	localStorage.removeItem('idPerfil');
	localStorage.removeItem('idUsuario');
	localStorage.removeItem('usuarioRuta');
	sessionStorage.removeItem('idPerfil');
	sessionStorage.removeItem('idImagen');
	sessionStorage.removeItem('nombreImagen');

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

	idusuario = sessionStorage.getItem('idPerfil');
	// Cogemos siempres nuestro propio perfil para una futura comprobación de seguimiento
	var idseguidor = localStorage.getItem('idUsuario');

	// Si el idusuario esta vacío, es nuestro propio perfil
	if (idusuario=="" || idusuario==null){
		idusuario = localStorage.getItem('idUsuario');
	}
	
	// Cargamos foto perfil del usuario para el menú lateral
	$("#usuarioFotoPerfil").prop('src',localStorage.getItem('usuarioRuta'));

	// Comprobar notificaciones del usuario
	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
		data: { funcion: "obtenerNotificaciones", idusuario: localStorage.getItem('idUsuario')},
		success: function (result) {
			if (result[0]!= undefined){
				$("#notificacionesAlerta").addClass("text-blue-700");
				// Contamos las notificaciones para mostrar un número en el icono
				let contNotificaciones = 0;
				result.forEach(function(notificacion){
					if (notificacion.vista==null){
						$("#notificacionesAlerta").addClass("animate-pulse");
						contNotificaciones++;

						if (notificacion.imagen != null) n.notiInfo(notificacion.texto+" imagen");
						else n.notiInfo(notificacion.texto);
					}
				})
				// Marcamos notificaciones como vistas
				$.ajax({
					url: "http://192.168.1.137/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
					data: { funcion: "avistarNotificaciones", idusuario: localStorage.getItem('idUsuario')},
					success: function (result) {
						console.log(result);
					}
				});
				if(contNotificaciones!=0) $("#notificacionesAlerta").text(" "+contNotificaciones);
			}
		}
	});

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
			let perfil = result[0];
			// Transformamos el json de albumes en un objeto para más comodidad
			let albumes = JSON.parse(result.albumes);

			$("#usuarioIdentificador").html(perfil.identificador);
			$("#usuarioDatosNombre").html(perfil.nombre);
			// $("#usuarioDatosIdentificador").html("@"+perfil.identificador);
			$("#usuarioDatosDescripcion").html(perfil.descripcion);
			$("#usuarioSiguiendo").html(result.seguidos+" siguiendo");
			$("#usuarioSeguidores").html(result.seguidores+" seguidores");
			
			let imagenPerfil = document.createElement('img');
			if (perfil.ruta == null) imagenPerfil.setAttribute('src',"./../assets/img/iconousuario.svg");
			else imagenPerfil.setAttribute('src',perfil.ruta);
			imagenPerfil.classList = "w-32 h-32  rounded-full"

			$("#usuarioImagen").append(imagenPerfil);

			// Contamos numalbumes
			let usuarioNumalbumes = 0;

			albumes.forEach(function(album) {
				// asignamos variables con los datos
				let id = album.id;
				let nombre = album.nombre;
				let fecha = album.fecha;
				let ruta = album.ruta;

				// creamos los elementos
				let albumCard = document.createElement("div");
				albumCard.setAttribute('id', id);
				albumCard.setAttribute('nombre', nombre);
				albumCard.addEventListener('click', irAAlbum);
				albumCard.style = "cursor: pointer;";
				albumCard.classList = "albumCard";

				let albumTitulo = document.createElement("div");
				albumTitulo.classList= "pt-2"
				albumTitulo.textContent = nombre;

				let albumImagen = document.createElement('div');
				albumImagen.classList = "albumCardImagen";

				let albumRuta = document.createElement('img');
				albumRuta.setAttribute('src', ruta)

				albumImagen.append(albumRuta);

				// añadimos elementos al div de albumes
				albumCard.append(albumTitulo);
				albumCard.append(albumImagen);
				$("#usuarioalbumes").append(albumCard);
				
				usuarioNumalbumes++;
			});

			$("#usuarioNumalbumes").html(usuarioNumalbumes+" albumes");

			// Controlamos botón seguir
			if (idusuario!=localStorage.getItem('idUsuario')){

				if (result.seSiguen == false){
					let botonSeguir = document.createElement('button');
					botonSeguir.setAttribute('id',"botonSeguir_"+perfil.id);
					botonSeguir.classList = "w-1/3 lg:w-1/6 boton hover:scale-105 transition duration-300 ease-in-out";
					botonSeguir.addEventListener('click',seguir);
					botonSeguir.textContent = "Seguir";
	
	
					$("#infoPerfil").append(botonSeguir)
				}
				else if (result.seSiguen == true){
					let botonSeguido = document.createElement('button');
					botonSeguido.setAttribute('id',"botonNoSeguir_"+perfil.id);
					botonSeguido.classList = "w-1/3 lg:w-1/6 boton hover:scale-105 hover:bg-red-800 transition duration-300 ease-in-out";
					botonSeguido.addEventListener('click',noSeguir);
					botonSeguido.textContent = "Siguiendo";
	
	
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
	let idtarget = (event.currentTarget.id);
	let idusuario = idtarget.split('_')[1];
	var idseguidor = localStorage.getItem('idUsuario');
	var identificador = localStorage.getItem('usuarioLogin');

	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
		data: { funcion: "seguirUsuario", idusuario: idusuario, identificador:identificador, idseguidor:idseguidor},
		success: function (result) {
			sessionStorage.setItem('noti','usuarioSeguido');
			window.location.reload();
		

		}
	});

}

function noSeguir(event) {
	// Cogemos el id a seguir y nuestro id
	let idtarget = (event.currentTarget.id);
	let idusuario = idtarget.split('_')[1];
	var idseguidor = localStorage.getItem('idUsuario');

	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
		data: { funcion: "noSeguirUsuario", idusuario: idusuario, idseguidor:idseguidor},
		success: function (result) {
			sessionStorage.setItem('noti','usuarioNoSeguido');
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

$("#botonCerrarSesion").click(function () {
	cerrarSesion();
});

iniciarPerfil();

$("#botonNoSeguir_"+idusuario).hover(
	function(){
		$(this).text('Dejar de seguir');
	},
	function(){
		$(this).text('Siguiendo');
	}
);

