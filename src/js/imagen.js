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

function iniciarImagen() {

	// Declaracion de variables
	var idimagen = sessionStorage.getItem('idImagen');
	var nombreimagen = sessionStorage.getItem('nombreImagen');
	var idalbum = sessionStorage.getItem('idAlbum');
	var nombrealbum = sessionStorage.getItem('nombreAlbum');
	$("#nombreImagen").html(nombreimagen);
	$("#nombreAlbum").html(nombrealbum);
	menuOpcionesHome = "cerrado";

	$.ajax({
		url: "http://192.168.1.136/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
		data: { funcion: "obtenerImagen", idimagen: idimagen },
		// Cuando lleguen los datos...
		success: function (result) {

			let imagen = result[0];
			// Nos quedamos solo con el nombre y no con la extensión
			imagen.titulo = imagen.titulo.split(".")[0];

			console.log(imagen);
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
			if (result.length != 0){
				n.notiInfo('Usted ya ha puntuado la imagen');
				return;
			}
			else{	// En cambio, si viene vacío, cambiamos estilo del corazón
				$("#imagenPuntuar").css("color","red");
				let puntos = parseInt($("#imagenPuntos").html());
				$("#imagenPuntos").html(puntos+1);

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

iniciarImagen();
