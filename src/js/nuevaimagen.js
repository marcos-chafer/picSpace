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
	formData.append('idUsuario', idusuario);
	formData.append('idAlbum', idalbum);
	formData.append('nombreAlbum', nombrealbum);
	

	$.ajax({
		url: "http://192.168.1.136/picSpace/src/server/imagen.php",
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

$("#botonDesplegarMenu").click(function(){
	if (menuOpcionesHome=='cerrado') abrirMenu();
	else cerrarMenu();
});

$("#botonCerrarSesion").click(function(){
	cerrarSesion();
});

$("#botonContinuar").click(function(){
	crearImagen();
})
