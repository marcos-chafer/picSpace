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
		url: "http://192.168.1.38/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
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

function comprobarPunto(){
// Comprueba si el usuario ya ha puntuado la imagen

	var idimagen = sessionStorage.getItem('idImagen');
	var idusuario = localStorage.getItem('idUsuario');


	$.ajax({
		url: "http://192.168.1.38/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
		data: { funcion: "comprobarPunto", idimagen: idimagen, idusuario: idusuario },
		// Cuando lleguen los datos...
		success: function (result) {

			if (result.punto){
				$("#imagenPuntuar").css("color", "red");
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

	// Comprobamos si debemos colorear el corazón
	comprobarPunto();



	$.ajax({
		url: "http://192.168.1.38/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
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
		url: "http://192.168.1.38/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
		data: { funcion: "obtenerComentarios", idimagen: idimagen },
		// Cuando lleguen los datos...
		success: function (result) {
			result.forEach(function(comentario) {
				let comentarioContenedor = document.createElement('div');
				comentarioContenedor.classList = "flex";

				let comentarioImagen = document.createElement('img');
				comentarioImagen.classList = "mr-[20px]";
				comentarioImagen.style.width = "10px";
				comentarioImagen.style.height = "10px";
				comentarioContenedor.append(comentarioImagen);

				// TODO Redirigir al perfil del usuario al clickar en el nombre
				let comentarioUsuario = document.createElement('span');
				comentarioUsuario.textContent = comentario.nombre+": ";

				let comentarioTexto = document.createElement('span');
				comentarioTexto.textContent = comentario.texto;

				let comentarioComentario = document.createElement('div');
				// Comprobamos si el comentario es del usuario logueado, entonces lo movemos a la derecha
				let usuarioLogin = localStorage.getItem('usuarioLogin');
				if (comentario.nombre == usuarioLogin) comentarioComentario.classList = "text-right mr-2 ml-auto";
				else comentarioComentario.classList = "text-left mr-2 m";
				comentarioComentario.append(comentarioUsuario);
				comentarioComentario.append(comentarioTexto);
				comentarioContenedor.append(comentarioComentario);


				let comentarioFecha = document.createElement('div');
				comentarioFecha.classList = "ml-auto self-end";
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

	// Si hay voto del usuario, hay que quitar el punto
	if ($("#imagenPuntuar").css('color') == 'rgb(255, 0, 0)'){

		$.ajax({
			url: "http://192.168.1.38/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
			data: { funcion: "puntuarImagen", idimagen: idimagen, idusuario: idusuario, punto:"quitar" },
			// Cuando lleguen los datos...
			success: function (result) {
				window.location.reload();
			}
		})
	}
	else{

		$.ajax({
			url: "http://192.168.1.38/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
			data: { funcion: "puntuarImagen", idimagen: idimagen, idusuario: idusuario, punto:"poner" },
			// Cuando lleguen los datos...
			success: function (result) {
				window.location.reload();
			}
		})
	}
}

$("#botonDesplegarMenu").click(function () {
	if (menuOpcionesHome == 'cerrado') abrirMenu();
	else cerrarMenu();
});

$("#botonCerrarSesion").click(function () {
	cerrarSesion();
});

$("#botonAjustesImagen").click(function () {
	sessionStorage.setItem('nombreImagen',$("#nombreImagen").html());
	sessionStorage.setItem('descripcionImagen',$("#imagenDescripcion").html());
	window.location.assign('./ajustesimagen.html');
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
