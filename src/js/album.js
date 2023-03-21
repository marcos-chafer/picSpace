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

function crearImagen() {
	window.location.assign("./nuevaimagen.html");
}

function iniciarAlbum() {

	// Controlamos notis
	let noti = sessionStorage.getItem('noti');
	switch (noti) {
		case "eliminarImagen":
			n.notiInfo("Imagen eliminada con éxito");
			break;
		default:
			break;
	}
	//Limpiamos noti una vez controlada
	sessionStorage.removeItem('noti');

	// Declaracion de variables
	let idalbum = sessionStorage.getItem('idAlbum');
	let nombrealbum = sessionStorage.getItem('nombreAlbum');
	$("#nombreAlbum").html(nombrealbum);
	menuOpcionesHome = "cerrado";

	// Cargamos foto perfil del usuario para el menú lateral
	$("#usuarioFotoPerfil").prop('src',localStorage.getItem('usuarioRuta'));

	// Comprobar notificaciones del usuario
	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
		data: { funcion: "obtenerNotificaciones", idusuario: localStorage.getItem('idUsuario')},
		success: function (result) {
			console.log(result[0]);
			if (result[0]!= undefined){
				$("#notificacionesAlerta").addClass("animate-pulse text-blue-700");
				// Contamos las notificaciones para mostrar un número en el icono
				let contNotificaciones = 0;
				result.forEach(function(notificacion){
					contNotificaciones++;
				})
				$("#notificacionesAlerta").text(" "+contNotificaciones);

			}
		}
	});

	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
		data: { funcion: "obtenerImagenes", idalbum: idalbum },
		// Cuando lleguen los datos...
		success: function (result) {
			for (let i = 0; i < result.length; i++) {
				// asignamos variables con los datos
				let id = result[i].id;
				let titulo = result[i].titulo;
				// Nos quedamos solo con el nombre y no con la extensión
				titulo = titulo.split(".")[0];
				let fecha = result[i].fecha;
				let ruta = result[i].ruta;

				// creamos los elementos
				let imagen = document.createElement("div");
				imagen.setAttribute('id', id);
				imagen.style = "cursor: pointer;";
				imagen.classList = "imagenCard";
				// añadimos el title para ser usado posteriormente
				imagen.title = titulo;
				imagen.addEventListener('click',irAImagen);

				let imagenTitulo = document.createElement("div");
				imagenTitulo.textContent = titulo;

				let imagenImagen = document.createElement('div');
				imagenImagen.classList = "h-32";

				let imagenRuta = document.createElement('img')
				imagenRuta.setAttribute('src', ruta)

				imagenImagen.append(imagenRuta);

				// añadimos elementos al div de imagenes
				imagen.append(imagenTitulo);
				imagen.append(imagenImagen);
				$("#imagenes").append(imagen);
			}
			// Cuando se hayan recorrido todos los imagenes...
			let colMas = document.createElement("div");
			colMas.classList = "lg:h-48";

			let botonMas = document.createElement("button");
			botonMas.setAttribute('id', 'botonMas');
			botonMas.addEventListener('click',crearImagen);
			botonMas.style = "cursor: pointer;";
			botonMas.classList = "bg-blue-300 rounded-full p-5 w-fit centrarHorizontal mt-16 hover:bg-blue-500 hover:scale-110 transition duration-200 ease-in-out";



			let i = document.createElement('i');
			i.classList = "fa-solid fa-plus fa-2xl";

			// añadimos elementos despues de los albumes
			botonMas.append(i);
			colMas.append(botonMas);

			$("#imagenes").append(colMas);
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
})

$("#botonCerrarSesion").click(function () {
	cerrarSesion();
});


iniciarAlbum();
