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

function iniciarSeguidores() {


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
		data: { funcion: "obtenerSeguidores", idusuario: idusuario },
		// Cuando lleguen los datos...
		success: function (result) {
			result.forEach(function(seguidor){
				let seguidorContenedor = document.createElement('div');
				seguidorContenedor.classList = "flex flex-col items-center rounded-3xl bg-blue-600 w-full lg:w-[20%] mx-6 lg:mx-0 h-40 cursor-pointer";
				seguidorContenedor.setAttribute('onclick','IrAPerfil('+seguidor.id+')');
		
				let seguidorTexto = document.createElement('div');
		
				let seguidorTextoIdentificador = document.createElement('span');
				seguidorTextoIdentificador.style.height = "80%";
				seguidorTextoIdentificador.classList = "font-semibold";
				seguidorTextoIdentificador.textContent = seguidor.identificador;
				seguidorContenedor.append(seguidorTextoIdentificador);
				
				let seguidorImagen = document.createElement('div');
				seguidorImagen.style.height = "80%";
				seguidorImagen.style.width = "100%";	
				seguidorImagen.classList = "flex flex-row mt-2"
		
				let seguidorRuta = document.createElement('img');
				seguidorRuta.style.objectFit = "cover";
				seguidorRuta.classList = "w-full h-full";
				if (seguidor.ruta == null) seguidorRuta.setAttribute('src',"../assets/img/iconousuario.svg");
				else seguidorRuta.setAttribute('src',seguidor.ruta);
				seguidorImagen.append(seguidorRuta);
				
				seguidorContenedor.append(seguidorImagen);
		
				$("#cajaSeguidores").append(seguidorContenedor);
		
		
		
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

$("#botonCerrarSesion").click(function () {
	cerrarSesion();
});


iniciarSeguidores();
