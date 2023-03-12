import { noti } from "./noti.js";
var n = new noti();


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

function eliminarNotificacion(id){
// Elimina notificación de bbdd
	let idusuario = localStorage.getItem('idUsuario');


	$.ajax({
		url: "http://192.168.1.38/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
		data: { funcion: "eliminarNotificacion", idusuario: idusuario, idnotificacion: id },
		// Cuando lleguen los datos...
		success: function (result) {
			if (result.exito == true){
				n.notiInfo('Notificación eliminada con éxito');
				window.location.reload();
			}
		}
	})

}

function iniciarAlbum() {


	// Declaracion de variables
	let idusuario = localStorage.getItem('idUsuario');
	menuOpcionesHome = "cerrado";


	$.ajax({
		url: "http://192.168.1.38/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
		data: { funcion: "obtenerNotificaciones", idusuario: idusuario },
		// Cuando lleguen los datos...
		success: function (result) {
			result.forEach(function(notificacion){
				let notificacionContenedor = document.createElement('div');

				let notificacionBotones = document.createElement('div');
				notificacionBotones.classList = "inline mr-2";
				notificacionContenedor.append(notificacionBotones);

				let notificacionEliminar = document.createElement('i');
				notificacionEliminar.setAttribute('id','botonEliminar_'+notificacion.id);
				notificacionEliminar.setAttribute('title','Eliminar notificación');
				notificacionEliminar.classList = "fa fa-x fa-xl cursor-pointer";
				notificacionBotones.append(notificacionEliminar);

				let notificacionUsuario = document.createElement('button');
				

				let notificacionTexto = document.createElement('span');
				notificacionTexto.textContent = notificacion.texto;
				notificacionContenedor.append(notificacionTexto);

				

				$("#cajaNotificaciones").append(notificacionContenedor);

				// Agregamos funcionalidad a los botones

				$("#botonEliminar_"+notificacion.id).click(function(){
					eliminarNotificacion(notificacion.id);
				})

			})
		}
	})
}

function irAImagen(event) {

	// Cogemos el id y el nombre de la imagen
	let idimagen = (event.currentTarget.id);
	let nombreimagen = (event.currentTarget.title);

	//asignamos cookie para saber adonde vamos y usaremos el nombre posteriormente
	sessionStorage.setItem('idImagen',idimagen);
	sessionStorage.setItem('nombreImagen',nombreimagen);
	window.location.assign("./imagen.html");
	
};

// ASIGNACIÓN DE EVENTOS
$("#botonDesplegarMenu").click(function () {
	if (menuOpcionesHome == 'cerrado') abrirMenu();
	else cerrarMenu();
});

$("#botonCerrarSesion").click(function () {
	cerrarSesion();
});


iniciarAlbum();
