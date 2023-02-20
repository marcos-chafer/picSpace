import { noti } from "./noti.js";
let n = new noti();

var idusuario = localStorage.getItem('idUsuario');
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

function comprobarEliminacionImagen() {
	// Usamos una notificación custom sin usar noti ya que necesitamos que utilice funciones de esta página
	iziToast.show({
		title: "¿Está seguro de que desea eliminar la imagen?",
		timeout: 5000,
		position: 'topCenter',
		icon: 'fa-solid fa-info',
		color: 'red',
		buttons: [
			['<button>Eliminar</button>', function () {
				eliminarImagen();
			}],
		],
	});

}

function eliminarImagen() {

	console.log("Hey");

	let idimagen = sessionStorage.getItem('idImagen');
	let nombreimagen = sessionStorage.getItem('nombreImagen');
	let nombrealbum = sessionStorage.getItem('nombreAlbum');


	$.ajax({
		url: "http://192.168.1.136/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
		data: { funcion: "eliminarImagen", idusuario: idusuario, idimagen: idimagen, nombreimagen: nombreimagen, nombrealbum: nombrealbum },
		success: function (result) {
			// nos viene json con exito = true si se hizo correctamente
			let respuesta = result.exito;

			// Cuando nos viene exito a true
			if (respuesta == true) {
				// limpiamos items de session
				sessionStorage.removeItem('idImagen');
				sessionStorage.removeItem('nombreImagen');
				// Añadimos noti de eliminarImagen
				sessionStorage.setItem('noti', 'eliminarImagen');
				// Nos vamos a album
				window.location.replace("./album.html");
			};
		}
	});


}

function iniciarAjustes() {

	$("#nombreImagen").val(sessionStorage.getItem('nombreImagen'));
	$("#descripcionImagen").val(sessionStorage.getItem('descripcionImagen'));
}

function irAImagen(idimagen, nombreimagen) {

	//asignamos cookie para saber adonde vamos y usaremos el nombre posteriormente
	sessionStorage.setItem('idImagen', idimagen);
	sessionStorage.setItem('nombreImagen', nombreimagen);
	window.location.assign("./imagen.html");

};

function modificarImagen() {
	var nombre = $("#nombreImagen").val();
	var descripcion = $("#descripcionImagen").val();

	if (nombre == "") {
		n.notiError("Nombre vacío");
		return;
	}
	else if (nombre.length > 100) {
		n.notiError("Nombre demasiado largo");
		$("#nombreUsuario").val("");
		return;
	}
	if (descripcion == "") {
		n.notiError("Descripción vacía");
		return;
	}
	else if (descripcion.length > 100) {
		n.notiError("Descripción demasiado larga");
		$("#nombreUsuario").val("");
		return;
	}

	let idimagen = sessionStorage.getItem('idImagen');
	$.ajax({
		url: "http://192.168.1.136/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
		data: { funcion: "modificarImagen", idimagen: idimagen, nombre: nombre, descripcion:descripcion },
		success: function (result) {
			// nos viene json con exito = true si se hizo correctamente
			let respuesta = result.exito;
			console.log(respuesta);
			// Cuando nos viene exito a true
			if (respuesta == true) irAImagen(idimagen, nombre);
		}
	});
}



$("#botonDesplegarMenu").click(function () {
	if (menuOpcionesHome == 'cerrado') abrirMenu();
	else cerrarMenu();
});

$("#botonCerrarSesion").click(function () {
	cerrarSesion();
});

$("#botonCambiar").click(function () {
	modificarImagen();
})

$("#botonEliminar").click(function () {
	comprobarEliminacionImagen();
})

iniciarAjustes();