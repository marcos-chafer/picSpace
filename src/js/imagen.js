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

function comentarImagen() {
// Guarda en BBDD un comentario en la imagen actual
	var idimagen = sessionStorage.getItem('idImagen');
	var idusuario = localStorage.getItem('idUsuario');
	var identificador = localStorage.getItem('usuarioLogin');
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
		url: "http://http://picspace.epizy.com/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
		data: { funcion: "comentarImagen", idimagen: idimagen, idusuario: idusuario, identificador:identificador, comentarioTexto: comentarioTexto},
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
		url: "http://http://picspace.epizy.com/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
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

	// Comprobar notificaciones del usuario
	$.ajax({
		url: "http://http://picspace.epizy.com/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
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
					url: "http://http://picspace.epizy.com/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
					data: { funcion: "avistarNotificaciones", idusuario: localStorage.getItem('idUsuario')},
					success: function (result) {
					}
				});
				if(contNotificaciones!=0) $("#notificacionesAlerta").text(" "+contNotificaciones);
			}
		}
	});

	// Cargamos imagen
	$.ajax({
		url: "http://http://picspace.epizy.com/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
		data: { funcion: "obtenerImagen", idimagen: idimagen },
		// Cuando lleguen los datos...
		success: function (result) {
			console.log(result);
			let imagen = result[0];

			// Comprobamos si debemos mostrar el botón ajustes de perfil
			if (imagen.id_usuario == localStorage.getItem('idUsuario')){
				$("#botonAjustesImagen").show();
			}

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

			// Añadiendo autor
			$("#imagenAutor").html(imagen.nombre);
			$("#imagenAutor").click(function(){
				IrAPerfil(imagen.id_usuario)
			})

			// Añadiendo tags

			let tags = imagen.tags.split(",");
			tags.forEach(function(tag) {
				let tagContenedor = document.createElement('div');
				tagContenedor.setAttribute('id',tag);
				tagContenedor.classList = "bg-blue-800  hover:bg-blue-400 text-white font-semibold rounded-xl py-1 px-2 mr-2 w-fit inline cursor-pointer hover:scale-105 transition duration-200 ease-in-out";
				tagContenedor.addEventListener('click',IrATag);
				tagContenedor.textContent = tag;
				$("#imagenTags").append(tagContenedor);
			});


			// Añadiendo puntuación
			$("#imagenPuntos").html(imagen.puntos);

		}
	})

	// Obtenemos comentarios
	$.ajax({
		url: "http://http://picspace.epizy.com/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
		data: { funcion: "obtenerComentarios", idimagen: idimagen },
		// Cuando lleguen los datos...
		success: function (result) {
			result.forEach(function(comentario) {
				console.log(comentario);
				let comentarioContenedor = document.createElement('div');
				comentarioContenedor.classList = "flex mt-2";

				let comentarioImagen = document.createElement('img');
				comentarioImagen.classList = "w-6 h-6 self-center mr-2 rounded-full hover:scale-150 transition duration-100 ease-in-out";
				comentarioImagen.setAttribute('src',comentario.ruta);

				// TODO Redirigir al perfil del usuario al clickar en el nombre
				let comentarioUsuario = document.createElement('span');
				comentarioUsuario.textContent = comentario.nombre+": ";
				comentarioUsuario.classList = "w-fit mr-1 font-semibold cursor-pointer hover:text-blue-800 hover:underline hover:scale-105 transition duration-100 ease-in-out";
				comentarioUsuario.addEventListener('click',function(){
					IrAPerfil(comentario.idusuario)
				})

				let comentarioTexto = document.createElement('span');
				comentarioTexto.textContent = comentario.texto;

				let comentarioComentario = document.createElement('div');
				// Comprobamos si el comentario es del usuario logueado, entonces lo movemos a la derecha
				let usuarioLogin = localStorage.getItem('usuarioLogin');
				if (comentario.nombre == usuarioLogin) comentarioComentario.classList = "flex text-right mr-2 ml-2 ml-auto";
				else comentarioComentario.classList = "flex text-left ml-2 mr-2";
				comentarioComentario.append(comentarioImagen);
				comentarioComentario.append(comentarioUsuario);
				comentarioComentario.append(comentarioTexto);
				comentarioContenedor.append(comentarioComentario);


				let comentarioFecha = document.createElement('div');
				comentarioFecha.classList = "mr-2 self-end";
				comentarioFecha.textContent = " "+comentario.fecha;
				comentarioFecha.style.color = "gray";
				comentarioFecha.style.fontSize = "10px";
				comentarioContenedor.append(comentarioFecha);

				$("#imagenComentariosCaja").append(comentarioContenedor);
			});

		}
	})
}

function IrATag(event){

	// Cogemos el tag
	let tag = (event.currentTarget.id);

	//asignamos cookie para saber adonde vamos y usaremos el nombre posteriormente
	sessionStorage.setItem('buscarTag',tag);
	window.location.assign("./buscar.html");

}

function IrAPerfil(idperfil){

	sessionStorage.setItem('idPerfil',idperfil);
	window.location.assign('./perfil.html');
}

function puntuarImagen() {
	// Funcion que decide si subir un punto o quitarselo a una imagen

	var idimagen = sessionStorage.getItem('idImagen');
	var idusuario = localStorage.getItem('idUsuario');
	var identificador = localStorage.getItem('usuarioLogin');

	// Si hay voto del usuario, hay que quitar el punto
	if ($("#imagenPuntuar").css('color') == 'rgb(255, 0, 0)'){

		$.ajax({
			url: "http://http://picspace.epizy.com/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
			data: { funcion: "puntuarImagen", idimagen: idimagen, idusuario: idusuario, punto:"quitar" },
			// Cuando lleguen los datos...
			success: function (result) {
				window.location.reload();
			}
		})
	}
	else{

		$.ajax({
			url: "http://http://picspace.epizy.com/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
			data: { funcion: "puntuarImagen", idimagen: idimagen, idusuario: idusuario, identificador:identificador, punto:"poner" },
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

$("#IrAMiPerfil").click(function() {
	sessionStorage.removeItem('idPerfil');
	window.location.assign("./perfil.html");
})

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
