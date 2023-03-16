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

function comprobarEliminacionAlbum() {

	// Comprobamos si el álbum está vacío
	var idalbum = sessionStorage.getItem('idAlbum')

	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
		data: { funcion: "obtenerImagenes", idalbum: idalbum },
		success: function (result) {
			// Si el álbum no contiene imagenes, mostramos un mensaje
			if (result.length == 0) {
				// Usamos una notificación custom sin usar noti ya que necesitamos que utilice funciones de esta página
				iziToast.show({
					title: "¿Está seguro de que desea eliminar el álbum?",
					timeout: 5000,
					position: 'topCenter',
					icon: 'fa-solid fa-info',
					color: 'red',
					buttons: [
						['<button>Eliminar</button>', function () {
							eliminarAlbum();
						}],
					],
				});
			}
			// Si nos llega con imágenes
			else{
				// Usamos una notificación custom sin usar noti ya que necesitamos que utilice funciones de esta página
				iziToast.show({
					title: "El álbum contiene imágenes",
					message:'¿Está seguro de que desea eliminar el álbum?',
					timeout: 5000,
					position: 'topCenter',
					icon: 'fa-solid fa-warning',
					color: 'red',
					buttons: [
						['<button>Eliminar</button>', function () {
							eliminarAlbum();
						}],
					],
				});
			}
		}
	})

}

function comprobarTags(){

	$("#tagsIntroducidos").html("Tags introducidos:<br/>");

	let tags = ($("#tagsAlbum").val().split(","))
	tags.forEach(function(tag) {
		let tagContenedor = document.createElement('div');
		tagContenedor.classList = "bg-indigo-800  hover:bg-indigo-400 text-white font-semibold rounded-xl py-1 px-2 mr-2 w-fit inline";
		tagContenedor.textContent = tag;
		$("#tagsIntroducidos").append(tagContenedor);
	});
}

function eliminarAlbum() {

	let idalbum = sessionStorage.getItem('idAlbum');
	let nombrealbum = sessionStorage.getItem('nombreAlbum');


	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/album.php", async: false, type: "post", dataType: "json",
		data: { funcion: "eliminarAlbum", idusuario: idusuario, idalbum: idalbum, nombrealbum: nombrealbum },
		success: function (result) {
			// nos viene json con exito = true si se hizo correctamente
			let respuesta = result.exito;
			// Cuando nos viene exito a true
			if (respuesta == true) {
				// limpiamos items de session
				sessionStorage.removeItem('idAlbum');
				sessionStorage.removeItem('nombreAlbum');
				// Añadimos noti de eliminarAlbum
				sessionStorage.setItem('noti', 'eliminarAlbum');
				// Nos vamos a albums
				window.location.replace("./albums.html");
			};
		}
	});


}

function iniciarAjustes() {

	// Obtenemos los datos del perfil
	let idusuario = localStorage.getItem('idUsuario');
	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
		data: { funcion: "obtenerUsuario", idusuario: idusuario },
		success: function (result) {
			let usuario = result[0];
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

			sessionStorage.setItem('noti','modificarUsuario');
			window.location.replace('./perfil.html');

		}
	});

	// $.ajax({
	// 	url: "http://192.168.1.137/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
	// 	data: { funcion: "modificarUsuario", idusuario: idusuario, nombre: nombre, contrasenya: contrasenya, descripcion:descripcion, tags:tags },
	// 	success: function (result) {
	// 		console.log(result);

	// 	}
	// });
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
	comprobarEliminacionAlbum();
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