import { noti } from "./noti.js";
let n = new noti();

var idusuario = localStorage.getItem('idUsuario');
var idalbum = sessionStorage.getItem('idAlbum');
var nombrealbum = sessionStorage.getItem('nombreAlbum');
var menuOpcionesHome = "cerrado";

function abrirMenu(){
	$("#opcionesHome").show();
	$("#botonDesplegarMenu i").removeClass();
	$("#botonDesplegarMenu i").addClass('fa-solid fa-arrow-up');
	$("#botonDesplegarMenu").addClass('mb-2');
	menuOpcionesHome = "abierto";
}

function crearImagen(){

	let titulo = $("#tituloImagen").val();
	let descripcion = $("#descripcionImagen").val();
	let tags = $("#tagsImagen").val();
	// Cogemos el archivo del input
	let archivo = $("#archivoImagen").prop('files')[0];

	if (titulo==""){
		n.notiError("Titulo vacío");
		return;
	}
	else if (titulo.length>50){
		n.notiError("Titulo demasiado largo");
		$("#tituloUsuario").val("");
		return;
	}
	else if (descripcion.length>100){
		n.notiError("Descripcion demasiado larga");
		$("#descripcionUsuario").val("");
		return;
	}
	else if (archivo==undefined){
		n.notiError("Imagen no seleccionada");
		return;
	}

	//Creamos un objeto FormData donde irán los datos del archivo
	let formData = new FormData();
	formData.append('file', archivo);
	formData.append('filename', titulo);
	formData.append('descripcion', descripcion);
	formData.append('tags', tags);
	formData.append('idUsuario', idusuario);
	formData.append('idAlbum', idalbum);
	formData.append('nombreAlbum', nombrealbum);
	

	$.ajax({
		url: "http://picspace.epizy.com/picSpace/src/server/imagen.php",
		async: false,
		type: "post",
		data: formData,
		contentType: false,
		processData: false,
		dataType: "text",
		data: formData,
		success: function(result) {
			let data = JSON.parse(result);
			// Si la imagen se guarda correctamente, toca registrarla en BBDD y moverla a la carpeta correcta
			if (data.exito == true) window.location.replace('./album.html');
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

	let tags = ($("#tagsImagen").val().split(","))
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

$("#botonContinuar").click(function(){
	crearImagen();
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