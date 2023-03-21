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
		tagContenedor.classList = "bg-blue-800  hover:bg-blue-400 text-white font-semibold rounded-xl py-1 px-2 mr-2 w-fit inline";
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
				// Nos vamos a albumes
				window.location.replace("./albumes.html");
			};
		}
	});


}

function iniciarAjustes() {

	$("#nombreAlbum").val(sessionStorage.getItem('nombreAlbum'));

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

	// Obtenemos los datos del album
	let idalbum = sessionStorage.getItem('idAlbum');
	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/album.php", async: false, type: "post", dataType: "json",
		data: { funcion: "obtenerAlbum", idalbum: idalbum },
		success: function (result) {

			$("#tagsAlbum").val(result[0].tags);
		}
	});

}

function irAAlbum(idalbum, nombrealbum) {

	//asignamos cookie para saber adonde vamos y usaremos el nombre posteriormente
	sessionStorage.setItem('idAlbum', idalbum);
	sessionStorage.setItem('nombreAlbum', nombrealbum);
	window.location.assign("./album.html");

};

function modificarAlbum() {
	var nombre = $("#nombreAlbum").val();
	let tags = $("#tagsAlbum").val();


	if (nombre == "") {
		n.notiError("Nombre vacío");
		return;
	}
	else if (nombre.length > 100) {
		n.notiError("Nombre demasiado largo");
		$("#nombreUsuario").val("");
		return;
	}

	let idalbum = sessionStorage.getItem('idAlbum');
	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/album.php", async: false, type: "post", dataType: "json",
		data: { funcion: "modificarAlbum", idalbum: idalbum, nombre: nombre, tags:tags },
		success: function (result) {
			// nos viene json con exito = true si se hizo correctamente
			let respuesta = result.exito;
			// Cuando nos viene exito a true
			if (respuesta == true) irAAlbum(idalbum, nombre);
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

$("#botonCambiar").click(function () {
	modificarAlbum();
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