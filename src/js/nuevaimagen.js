import { noti } from "./noti.js";
let n = new noti();

var idusuario = localStorage.getItem('idUsuario');
var idalbum = sessionStorage.getItem('idAlbum');
var menuOpcionesHome = "cerrado";

function abrirMenu(){
	$("#opcionesHome").show();
	$("#botonDesplegarMenu i").removeClass();
	$("#botonDesplegarMenu i").addClass('fa-solid fa-arrow-up');
	$("#botonDesplegarMenu").addClass('mb-2');
	menuOpcionesHome = "abierto";
}

function crearAlbum(){
	let titulo = $("#tituloImagen").val();
	let descripcion = $("#descripcionImagen").val();

	if (titulo==""){
		n.notiError("Titulo vacío");
		return;
	}
	else if (titulo.length>100){
		n.notiError("Titulo demasiado largo");
		$("#tituloUsuario").val("");
		return;
	}
	else if (descripcion.length>100){
		n.notiError("Descripcion demasiado larga");
		$("#descripcionUsuario").val("");
		return;
	}

	$.ajax({
		url: "http://192.168.1.136/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
		data: {funcion:"guardarImagen",idalbum:idalbum,idusuario:idusuario,titulo:titulo,descripcion:descripcion},
		success: function(result) {
			// nos viene json con exito = true si se hizo correctamente
			let respuesta = result.exito;
			// Cuando nos viene exito a true
			if (respuesta==true) window.location.replace('./album.html');
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
	crearAlbum();
})
