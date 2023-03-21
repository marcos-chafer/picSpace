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

function comprobarTags(){

	$("#tagsIntroducidos").html("Tags introducidos:<br/>");

	let tags = ($("#tagsImagen").val().split(","))
	tags.forEach(function(tag) {
		let tagContenedor = document.createElement('div');
		tagContenedor.classList = "bg-blue-800  hover:bg-blue-400 text-white font-semibold rounded-xl py-1 px-2 mr-2 w-fit inline";
		tagContenedor.textContent = tag;
		$("#tagsIntroducidos").append(tagContenedor);
	});
}

function eliminarImagen() {

	console.log("Hey");

	let idimagen = sessionStorage.getItem('idImagen');
	let nombreimagen = sessionStorage.getItem('nombreImagen');
	let nombrealbum = sessionStorage.getItem('nombreAlbum');


	$.ajax({
		url: "http://picspace.epizy.com/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
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
	let idimagen = sessionStorage.getItem('idImagen');

	// Cargamos foto perfil del usuario para el menú lateral
	$("#usuarioFotoPerfil").prop('src',localStorage.getItem('usuarioRuta'));

	// Comprobar notificaciones del usuario
	$.ajax({
		url: "http://picspace.epizy.com/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
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
					url: "http://picspace.epizy.com/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
					data: { funcion: "avistarNotificaciones", idusuario: localStorage.getItem('idUsuario')},
					success: function (result) {
						console.log(result);
					}
				});
				if(contNotificaciones!=0) $("#notificacionesAlerta").text(" "+contNotificaciones);
			}
		}
	});

	$.ajax({
		url: "http://picspace.epizy.com/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
		data: { funcion: "obtenerImagen", idimagen: idimagen },
		// Cuando lleguen los datos...
		success: function (result) {

			let imagen = result[0];
			$("#tagsImagen").val(imagen.tags);

		}
	})

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
	var tags = $("#tagsImagen").val();

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
		url: "http://picspace.epizy.com/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
		data: { funcion: "modificarImagen", idimagen: idimagen, nombre: nombre, descripcion:descripcion, tags:tags },
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

$("#IrAMiPerfil").click(function() {
	sessionStorage.removeItem('idPerfil');
	window.location.assign("./perfil.html");
})

$("#botonCerrarSesion").click(function () {
	cerrarSesion();
});

$("#botonCambiar").click(function () {
	modificarImagen();
})

$("#botonEliminar").click(function () {
	comprobarEliminacionImagen();
})

$("#tagsImagen").on('keyup',function(e){
	// Cada vez que el usuario suelte la tecla de los tags, analizaremos la tecla pulsada, si es coma, ejecutaremos la funcion
	if (e.key==','){
		comprobarTags();
	}
});
// Hay que poner tambien el ultimo tag
$("#tagsImagen").on('focusout',function(){
	comprobarTags();
});

iniciarAjustes();