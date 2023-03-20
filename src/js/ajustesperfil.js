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

function comprobarEliminacionCuenta() {

	// Usamos una notificación custom sin usar noti ya que necesitamos que utilice funciones de esta página
	iziToast.show({
		title: "Eliminación de su cuenta de picSpace",
		message:'¿Está seguro de que desea eliminar su cuenta? Se borrarán todos los álbumes, imágenes y datos del perfil de picSpace',
		timeout: 5000,
		position: 'topCenter',
		icon: 'fa-solid fa-warning',
		color: 'red',
		buttons: [
			['<button>Eliminar</button>', function () {
				eliminarCuenta();
			}],
		],
	});

}

function comprobarTags(){

	$("#tagsIntroducidos").html("Tags introducidos:<br/>");

	let tags = ($("#tagsAlbum").val().split(","))
	tags.forEach(function(tag) {
		let tagContenedor = document.createElement('div');
		tagContenedor.classList = "bg-blue-800  hover:bg-blue-400 text-white font-semibold rounded-xl py-1 px-2 mr-2 w-fit inline";
		tagContenedor.textContent = tag;
		$("#tagsIntroducidos").append(tagContenedor);
	});
}

function eliminarCuenta() {

	let idusuario = localStorage.getItem('idUsuario');

	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
		data: { funcion: "eliminarCuenta", idusuario: idusuario},
		success: function (result) {
			// nos viene json con exito = true si se hizo correctamente
			sessionStorage.setItem('noti','cuentaEliminada');
			localStorage.removeItem('usuarioLogin');
			localStorage.removeItem('idPerfil');
			localStorage.removeItem('idUsuario');
			localStorage.removeItem('usuarioRuta');
			sessionStorage.removeItem('idPerfil');
			sessionStorage.removeItem('idImagen');
			sessionStorage.removeItem('nombreImagen');
		
			window.location.replace('./index.html');
		}
	});


}

function iniciarAjustes() {

	// Obtenemos los datos del perfil
	let idusuario = localStorage.getItem('idUsuario');

	// Cargamos foto perfil del usuario para el menú lateral
	$("#usuarioFotoPerfil").prop('src',localStorage.getItem('usuarioRuta'));

	// Comprobar notificaciones del usuario
	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
		data: { funcion: "obtenerNotificaciones", idusuario: localStorage.getItem('idUsuario')},
		success: function (result) {
			console.log(result[0]);
			if (result[0]!= undefined){
				$("#notificacionesAlerta").addClass("animate-pulse text-blue-700");
				// Contamos las notificaciones para mostrar un número en el icono
				let contNotificaciones = 0;
				result.forEach(function(notificacion){
					contNotificaciones++;
				})
				$("#notificacionesAlerta").text(" "+contNotificaciones);

			}
		}
	});
	
	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
		data: { funcion: "obtenerUsuario", idusuario: idusuario },
		success: function (result) {
			let usuario = result[0];
			console.log(usuario);
			console.log(usuario);
			$("#nombrePerfil").val(usuario.nombre);
			$("#descripcionPerfil").val(usuario.descripcion);
			$("#tagsPerfil").val(usuario.tags);
		}
	});
	// Obtenemos la contrasenya del usuario
	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
		data: { funcion: "obtenerUsuarioContrasenya", idusuario: idusuario },
		success: function (result) {
			let usuario = result[0];

			$("#contrasenyaPerfil").val(usuario.contrasenya);

		}
	});


}

function irAAlbum(idalbum, nombrealbum) {

	//asignamos cookie para saber adonde vamos y usaremos el nombre posteriormente
	sessionStorage.setItem('idAlbum', idalbum);
	sessionStorage.setItem('nombreAlbum', nombrealbum);
	window.location.assign("./album.html");

};

function modificarUsuario() {
	var nombre = $("#nombrePerfil").val();
	var contrasenya = $("#contrasenyaPerfil").val();
	var descripcion = $("#descripcionPerfil").val();
	let tags = $("#tagsPerfil").val();
	// Cogemos el archivo del input
	let archivo = $("#imagenPerfil").prop('files')[0];



	if (nombre == "") {
		n.notiError("Nombre vacío");
		return;
	}
	else if (nombre.length > 50) {
		n.notiError("Nombre demasiado largo");
		$("#nombrePerfil").val("");
		return;
	}
	else if (contrasenya == "") {
		n.notiError("Contrasenya vacía");
		return;
	}
	else if (contrasenya.length > 50) {
		n.notiError("Contrasenya demasiado larga");
		$("#contrasenyaPerfil").val("");
		return;
	}
	else if (descripcion.length > 255) {
		n.notiError("Descripción demasiado larga");
		$("#descripcionPerfil").val("");
		return;
	}
	else if (tags.length > 255) {
		n.notiError("Demasiados tags");
		$("#tagsPerfil").val("");
		return;
	}

	let idusuario = localStorage.getItem('idUsuario');

	//Creamos un objeto FormData donde irán los datos del archivo
	let formData = new FormData();
	formData.append('file', archivo);
	// NECESARIO UN FILENAME
	formData.append('filename', nombre);
	formData.append('nombre', nombre);
	formData.append('contrasenya', contrasenya);
	formData.append('descripcion', descripcion);
	formData.append('tags', tags);
	formData.append('idUsuario', idusuario);

	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/usuario.php",
		async: false,
		type: "post",
		data: formData,
		contentType: false,
		processData: false,
		dataType: "text",
		success: function(result) {

			setTimeout(function(){
				sessionStorage.setItem('noti','modificarUsuario');
				window.location.replace('./perfil.html');	
			},700)
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

$("#IrAMiPerfil").click(function() {
	sessionStorage.removeItem('idPerfil');
	window.location.assign("./perfil.html");
})

$("#botonCambiar").click(function () {
	modificarUsuario();
})

$("#botonEliminar").click(function () {
	comprobarEliminacionCuenta();
})

$("#tagsAlbum").on('keyup',function(e){
	// Cada vez que el usuario suelte la tecla de los tags, analizaremos la tecla pulsada, si es coma, ejecutaremos la funcion
	if (e.key==','){
		comprobarTags();
	}
});
// Hay que poner tambien el ultimo tag
$("#tagsAlbum").on('focusout',function(){
	comprobarTags();
});

iniciarAjustes();