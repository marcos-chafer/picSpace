import { noti } from "./noti.js";
var n = new noti();
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

function eliminarNotificacion(id){
// Elimina notificación de bbdd
	let idusuario = localStorage.getItem('idUsuario');


	$.ajax({
		url: "http://picspace.epizy.com/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
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

function iniciarNotificaciones() {


	// Declaracion de variables
	let idusuario = localStorage.getItem('idUsuario');
	menuOpcionesHome = "cerrado";

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

	$.ajax({
		url: "http://picspace.epizy.com/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
		data: { funcion: "obtenerNotificaciones", idusuario: idusuario },
		// Cuando lleguen los datos...
		success: function (result) {
			result.forEach(function(notificacion){
				let notificacionContenedor = document.createElement('div');
				notificacionContenedor.classList = "flex w-full mx-auto";

				let notificacionRuta = document.createElement('img');
				notificacionRuta.setAttribute('id',notificacion.idusuario)
				notificacionRuta.setAttribute('src',notificacion.ruta)
				notificacionRuta.classList = "w-6 h-6 rounded-full mr-2 cursor-pointer hover:scale-125 transition duration-200 ease-in-out";
				notificacionRuta.addEventListener('click',IrAPerfil);
				notificacionContenedor.append(notificacionRuta);
				
				let notificacionTexto = document.createElement('span');
				notificacionTexto.classList = "bg-blue-300 rounded-lg pl-2";
				notificacionTexto.textContent = notificacion.texto;
				notificacionContenedor.append(notificacionTexto);

				if (notificacion.imagen != null){
					let notificacionImagen = document.createElement('span');
					notificacionImagen.setAttribute('id',notificacion.imagen);
					notificacionImagen.textContent = "imagen";
					notificacionImagen.classList = "cursor-pointer ml-1 pr-2 hover:text-blue-500 hover:scale-105 font-semibold transition duration-200 ease-in-out";
					notificacionImagen.addEventListener('click',irAImagen);
					notificacionTexto.append(notificacionImagen);
				}

				let notificacionBotones = document.createElement('div');
				notificacionBotones.classList = "flex justify-center w-6 items-center ml-auto bg-blue-300 rounded-full  hover:scale-150 transition duration-200 ease-in-out";
				notificacionContenedor.append(notificacionBotones);

				let notificacionEliminar = document.createElement('i');
				notificacionEliminar.setAttribute('id','botonEliminar_'+notificacion.id);
				notificacionEliminar.setAttribute('title','Eliminar notificación');
				notificacionEliminar.classList = "fa fa-x fa-md cursor-pointer";
				notificacionBotones.append(notificacionEliminar);

				

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

function IrAPerfil(event){
	// Cogemos el id del usuario
	let idperfil = (event.currentTarget.id);


	sessionStorage.setItem('idPerfil',idperfil);
	window.location.assign('./perfil.html');
}

// ASIGNACIÓN DE EVENTOS
$("#botonDesplegarMenu").click(function () {
	if (menuOpcionesHome == 'cerrado') abrirMenu();
	else cerrarMenu();
});

$("#IrAMiPerfil").click(function() {
	sessionStorage.removeItem('idPerfil');
	window.location.assign("./perfil.html");
});

$("#IrAMisAlbumes").click(function() {
	sessionStorage.removeItem('idAlbum');
	sessionStorage.removeItem('idPerfil');
	window.location.assign("./albumes.html");
})

$("#botonCerrarSesion").click(function () {
	cerrarSesion();
});


iniciarNotificaciones();
