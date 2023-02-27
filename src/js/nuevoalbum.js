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

	if (nombre==""){
		n.notiError("Nombre vacío");
		return;
	}
	else if (nombre.length>100){
		n.notiError("Nombre demasiado largo");
		$("#nombreUsuario").val("");
		return;
	}

	$.ajax({
		url: "http://192.168.1.136/picSpace/src/server/album.php", async: false, type: "post", dataType: "json",
		data: {funcion:"guardarAlbum",nombre:nombre,idusuario:idusuario, tags:tags},
		success: function(result) {
			// nos viene json con exito = true si se hizo correctamente
			let respuesta = result.exito;
			// Cuando nos viene exito a true
			if (respuesta==true){
				sessionStorage.setItem('noti','guardarAlbum');
				window.location.replace('./albums.html');
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
		tagContenedor.classList = "bg-indigo-800  hover:bg-indigo-400 text-white font-semibold rounded-xl py-1 px-2 mr-2 w-fit inline";
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