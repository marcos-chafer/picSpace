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

function comprobarEliminacionAlbum(){

	// Usamos una notificación custom sin usar noti ya que necesitamos que utilice funciones de esta página
	iziToast.show({
		title: "¿Está seguro de que desea eliminar el álbum?",
		timeout: 5000,
		position:'topCenter',
		icon: 'fa-solid fa-info',
		color: 'red',
		buttons: [
			['<button>Eliminar</button>', function () {
				eliminarAlbum();
			}], 
		],
	});


}

function eliminarAlbum(){

	let idalbum = sessionStorage.getItem('idAlbum');
	let nombrealbum = sessionStorage.getItem('nombreAlbum');
	

	$.ajax({
		url: "http://192.168.1.136/picSpace/src/server/album.php", async: false, type: "post", dataType: "json",
		data: {funcion:"eliminarAlbum",idusuario:idusuario,idalbum:idalbum,nombrealbum:nombrealbum},
		success: function(result) {
			// nos viene json con exito = true si se hizo correctamente
			let respuesta = result.exito;
			// Cuando nos viene exito a true
			if (respuesta==true) {
				// limpiamos items de session
				sessionStorage.removeItem('idAlbum');
				sessionStorage.removeItem('nombreAlbum');
				// Añadimos noti de eliminarAlbum
				sessionStorage.setItem('noti','eliminarAlbum');
				// Nos vamos a albums
				window.location.replace("./albums.html");
			};
		}
	});


}

function iniciarAjustes() {


	$("#nombreAlbum").val(sessionStorage.getItem('nombreAlbum'));

}

function irAAlbum(idalbum,nombrealbum) {
	
	//asignamos cookie para saber adonde vamos y usaremos el nombre posteriormente
	sessionStorage.setItem('idAlbum',idalbum);
	sessionStorage.setItem('nombreAlbum',nombrealbum);
	window.location.assign("./album.html");
	
};

function modificarAlbum(){
	var nombre = $("#nombreAlbum").val();

	if (nombre==""){
		n.notiError("Nombre vacío");
		return;
	}
	else if (nombre.length>100){
		n.notiError("Nombre demasiado largo");
		$("#nombreUsuario").val("");
		return;
	}

	let idalbum = sessionStorage.getItem('idAlbum');
	$.ajax({
		url: "http://192.168.1.136/picSpace/src/server/album.php", async: false, type: "post", dataType: "json",
		data: {funcion:"modificarAlbum",idalbum:idalbum,nombre:nombre},
		success: function(result) {
			// nos viene json con exito = true si se hizo correctamente
			let respuesta = result.exito;
			// Cuando nos viene exito a true
			if (respuesta==true) irAAlbum(idalbum,nombre);
		}
	});
}



$("#botonDesplegarMenu").click(function(){
	if (menuOpcionesHome=='cerrado') abrirMenu();
	else cerrarMenu();
});

$("#botonCerrarSesion").click(function(){
	cerrarSesion();
});

$("#botonCambiar").click(function(){
	modificarAlbum();
})

$("#botonEliminar").click(function(){
	comprobarEliminacionAlbum();
})

iniciarAjustes();