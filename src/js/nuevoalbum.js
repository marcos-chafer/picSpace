import { noti } from "./noti.js";
let n = new noti();

var idusuario = localStorage.getItem('idUsuario');
var menuOpcionesHome = "cerrado";

function abrirMenu(){
	$("#opcionesHome").show();
	$("#botonDesplegarMenu i").removeClass();
	$("#botonDesplegarMenu i").addClass('fa-solid fa-arrow-up');
	$("#botonDesplegarMenu").addClass('mb-2');
	menuOpcionesHome = "abierto";
}

function crearAlbum(){
	let nombre = $("#nombreAlbum").val();
	let tags = $("#tagsAlbum").val();
	// Cogemos el archivo del input
	let archivo = $("#imagenAlbum").prop('files')[0];


	if (nombre==""){
		n.notiError("Nombre vacío");
		return;
	}
	else if (nombre.length>100){
		n.notiError("Nombre demasiado largo");
		$("#nombreUsuario").val("");
		return;
	}

	//Creamos un objeto FormData donde irán los datos del archivo
	let formData = new FormData();
	formData.append('file', archivo);
	// NECESARIO UN FILENAME
	formData.append('filename', nombre);
	formData.append('nombrealbum', nombre);
	formData.append('tags', tags);
	formData.append('idUsuario', idusuario);

	$.ajax({
		url: "http://picspace.epizy.com/picSpace/src/server/album.php",
		async: false,
		type: "post",
		data: formData,
		contentType: false,
		processData: false,
		dataType: "text",
		success: function(result) {
			result = JSON.parse(result);

			// nos viene json con exito = true si se hizo correctamente
			let respuesta = result.exito;
			// Cuando nos viene exito a true
			if (respuesta==true){
				sessionStorage.setItem('noti','guardarAlbum');
				window.location.replace('./albumes.html');
			}
		}
	});
}

function cerrarSesion(){
	localStorage.removeItem('usuarioLogin');
	window.location.replace('./index.html');
}

function cerrarMenu(){
	$("#opcionesHome").hide();
	$("#botonDesplegarMenu i").removeClass();
	$("#botonDesplegarMenu i").addClass('fa-solid fa-arrow-down');
	$("#botonDesplegarMenu").removeClass('mb-2');
	menuOpcionesHome = "cerrado";
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

$("#botonDesplegarMenu").click(function(){
	if (menuOpcionesHome=='cerrado') abrirMenu();
	else cerrarMenu();
});

$("#botonCerrarSesion").click(function(){
	cerrarSesion();
});

$("#IrAMiPerfil").click(function() {
	sessionStorage.removeItem('idPerfil');
	window.location.assign("./perfil.html");
})

$("#IrAMisAlbumes").click(function() {
	sessionStorage.removeItem('idAlbum');
	sessionStorage.removeItem('idPerfil');
	window.location.assign("./albumes.html");
})

$("#botonContinuar").click(function(){
	crearAlbum();
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

// Cargamos foto perfil del usuario para el menú lateral
if (localStorage.getItem('usuarioRuta') != null) $("#usuarioFotoPerfil").prop('src', localStorage.getItem('usuarioRuta'));
else  $("#usuarioFotoPerfil").prop('src', 'http://picspace.epizy.com/picSpace/assets/img/iconousuario.svg');

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