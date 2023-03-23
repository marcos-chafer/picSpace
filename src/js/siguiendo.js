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

function IrAPerfil(idperfil){

	sessionStorage.setItem('idPerfil',idperfil);
	window.location.assign('./perfil.html');
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

function iniciarSiguiendo() {


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
		data: { funcion: "obtenerSeguidos", idusuario: idusuario },
		// Cuando lleguen los datos...
		success: function (result) {
			result.forEach(function(seguido){
				let seguidoContenedor = document.createElement('div');
				seguidoContenedor.classList = "flex flex-col items-center rounded-3xl bg-blue-600 w-full lg:w-[20%] mx-6 lg:mx-0 h-40 cursor-pointer";
				seguidoContenedor.setAttribute('onclick','IrAPerfil('+seguido.id+')');
		
				let seguidoTexto = document.createElement('div');
		
				let seguidoTextoIdentificador = document.createElement('span');
				seguidoTextoIdentificador.style.height = "80%";
				seguidoTextoIdentificador.classList = "font-semibold";
				seguidoTextoIdentificador.textContent = seguido.identificador;
				seguidoContenedor.append(seguidoTextoIdentificador);
				
				let seguidoImagen = document.createElement('div');
				seguidoImagen.style.height = "80%";
				seguidoImagen.style.width = "100%";	
				seguidoImagen.classList = "flex flex-row mt-2"
		
				let seguidoRuta = document.createElement('img');
				seguidoRuta.style.objectFit = "cover";
				seguidoRuta.classList = "w-full h-full";
				if (seguido.ruta == null) seguidoRuta.setAttribute('src',"../assets/img/iconousuario.svg");
				else seguidoRuta.setAttribute('src',seguido.ruta);
				seguidoImagen.append(seguidoRuta);
				
				seguidoContenedor.append(seguidoImagen);
		
				$("#cajaSeguidos").append(seguidoContenedor);
		
		
		
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


iniciarSiguiendo();
