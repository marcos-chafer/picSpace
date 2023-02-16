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

function comentarImagen() {
// Guarda en BBDD un comentario en la imagen actual
	var idimagen = sessionStorage.getItem('idImagen');
	var idusuario = localStorage.getItem('idUsuario');
	var comentarioTexto = $("#imagenComentarioTexto").val().trim();

	if (comentarioTexto.length>245){
		n.notiError("Comentario demasiado largo");
		return;
	}
	else if (comentarioTexto==""){
		n.notiError("Comentario vacío");
		return;
	}

	$.ajax({
		url: "http://192.168.1.136/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
		data: { funcion: "comentarImagen", idimagen: idimagen, idusuario: idusuario, comentarioTexto: comentarioTexto},
		// Cuando lleguen los datos...
		success: function (result) {
			// Si todo ha ido bien, notificamos al usuario
			if (result.exito){
				sessionStorage.setItem('noti','comentarImagen');
				window.location.reload();
			}
			else{
				n.notiError('Algo ha fallado, por favor, vuelva a intentarlo más tarde');
			}

		}
	})


}

function iniciarImagen() {

	// Declaracion de variables
	var idimagen = sessionStorage.getItem('idImagen');
	var nombreimagen = sessionStorage.getItem('nombreImagen');
	var idalbum = sessionStorage.getItem('idAlbum');
	var nombrealbum = sessionStorage.getItem('nombreAlbum');
	$("#nombreImagen").html(nombreimagen);
	$("#nombreAlbum").html(nombrealbum);
	menuOpcionesHome = "cerrado";

	// Controlamos notis
	let noti = sessionStorage.getItem('noti');
	switch (noti) {
		case "comentarImagen":
			n.notiInfo("Comentario enviado con éxito");
			break;
		default:
			break;
	}
	//Limpiamos noti una vez controlada
	sessionStorage.removeItem('noti');

	// Limpiamos input de comentario
	$("#imagenComentarioTexto").val("");



	$.ajax({
		url: "http://192.168.1.136/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
		data: { funcion: "obtenerImagen", idimagen: idimagen },
		// Cuando lleguen los datos...
		success: function (result) {

			let imagen = result[0];
			// Nos quedamos solo con el nombre y no con la extensión
			imagen.titulo = imagen.titulo.split(".")[0];

			$("#nombreImagen").html(imagen.titulo);

			// Añadiendo imagen
			let imagenRuta = document.createElement('img');
			imagenRuta.setAttribute('src', imagen.ruta);
			imagenRuta.style.height = "100%";
			// imagenRuta.style.width = "100%";

			$("#imagenRuta").append(imagenRuta);

			// Añadiendo descripcion
			$("#imagenDescripcion").html(imagen.descripcion);

			// Añadiendo puntuación
			$("#imagenPuntos").html(imagen.puntos);

		}
	})

	// Obtenemos comentarios
	$.ajax({
		url: "http://192.168.1.136/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
		data: { funcion: "obtenerComentarios", idimagen: idimagen },
		// Cuando lleguen los datos...
		success: function (result) {
			result.forEach(function(comentario) {
				let comentarioContenedor = document.createElement('div');
				// TODO Redirigir al perfil del usuario al clickar en el nombre
				let comentarioUsuario = document.createElement('span');
				comentarioUsuario.textContent = comentario.nombre+": ";
				comentarioContenedor.append(comentarioUsuario);

				let comentarioTexto = document.createElement('span');
				comentarioTexto.textContent = comentario.texto;
				comentarioContenedor.append(comentarioTexto);

				let comentarioFecha = document.createElement('span');
				comentarioFecha.textContent = " "+comentario.fecha;
				comentarioFecha.style.color = "gray";
				comentarioFecha.style.fontSize = "10px";
				comentarioContenedor.append(comentarioFecha);

				$("#imagenComentariosCaja").append(comentarioContenedor);
			});

		}
	})
}

function puntuarImagen() {
	// Funcion que decide si subir un punto o quitarselo a una imagen

	var idimagen = sessionStorage.getItem('idImagen');
	var idusuario = localStorage.getItem('idUsuario');

	$.ajax({
		url: "http://192.168.1.136/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
		data: { funcion: "puntuarImagen", idimagen: idimagen, idusuario: idusuario },
		// Cuando lleguen los datos...
		success: function (result) {

			// si no viene vacío, significa que el usuario ya ha puntuado esta imagen
			if (result.length != 0) {
				n.notiInfo('Usted ya ha puntuado la imagen');
				return;
			}
			else {	// En cambio, si viene vacío, cambiamos estilo del corazón
				$("#imagenPuntuar").css("color", "red");
				let puntos = parseInt($("#imagenPuntos").html());
				$("#imagenPuntos").html(puntos + 1);

			}

		}
	})

}

$("#botonDesplegarMenu").click(function () {
	if (menuOpcionesHome == 'cerrado') abrirMenu();
	else cerrarMenu();
});

$("#botonCerrarSesion").click(function () {
	cerrarSesion();
});

$("#imagenRuta").dblclick(function () {
	puntuarImagen();
})

$("#imagenPuntuar").click(function () {
	puntuarImagen();
})

$("#imagenComentariosEnviar").click(function () {
	comentarImagen();
})

iniciarImagen();
