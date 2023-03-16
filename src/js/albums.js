import { noti } from "./noti.js";
let n = new noti();

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

function crearAlbum() {
	window.location.assign("./nuevoalbum.html");
}

function iniciarAlbum() {
	// Declaracion de variables
	let identificador = localStorage.getItem('usuarioLogin');
	albums.menuOpcionesHome = "cerrado";

	// Controlamos notis
	let noti = sessionStorage.getItem('noti');
	switch (noti) {
		case "eliminarAlbum":
			n.notiInfo("Álbum eliminado con éxito");
			break;
		case "guardarAlbum":
			n.notiInfo("Álbum creado con éxito");
			break;
		default:
			break;
	}
	//Limpiamos noti una vez controlada
	sessionStorage.removeItem('noti');



	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/album.php", async: false, type: "post", dataType: "json",
		data: { funcion: "obtenerAlbums", identificador: identificador },
		// Cuando lleguen los datos...
		success: function (result) {
			for (let i = 0; i < result.length; i++) {
				// asignamos variables con los datos
				let id = result[i].id;
				let nombre = result[i].nombre;
				let fecha = result[i].fecha;
				let ruta = result[i].ruta;

				// creamos los elementos
				let album = document.createElement("div");
				album.setAttribute('id', id);
				album.setAttribute('nombre', nombre);
				album.addEventListener('click', irAAlbum);
				album.style = "cursor: pointer;";
				album.classList = "albumCard";

				let albumTitulo = document.createElement("div");
				albumTitulo.textContent = nombre;

				let albumImagen = document.createElement('div');
				albumImagen.classList = "h-32";

				let albumRuta = document.createElement('img');
				albumRuta.setAttribute('src', ruta)

				albumImagen.append(albumRuta);

				// añadimos elementos al div de albumes
				album.append(albumTitulo);
				album.append(albumImagen);
				$("#albums").append(album);
			}
			// Cuando se hayan recorrido todos los albumes...
			let colMas = document.createElement("div");
			colMas.classList = "lg:h-48";

			let botonMas = document.createElement("button");
			botonMas.setAttribute('id', 'botonMas');
			botonMas.addEventListener('click', crearAlbum);
			botonMas.style = "cursor: pointer;";
			botonMas.classList = "bg-indigo-300 rounded-full p-5 w-fit centrarHorizontal mt-16 hover:bg-indigo-500 hover:scale-110 transition duration-200 ease-in-out";



			let i = document.createElement('i');
			i.classList = "fa-solid fa-plus fa-2xl";

			// añadimos elementos despues de los albumes
			botonMas.append(i);
			colMas.append(botonMas);

			$("#albums").append(colMas);
		}
	})

	// Creación del carrusel

	let carrusel = document.createElement('div');
	carrusel.setAttribute('id', 'carrusel');

	let buttonLeft = document.createElement('button');
	buttonLeft.setAttribute('id', 'prev');
	buttonLeft.textContent = "<";
	carrusel.append(buttonLeft);

	let carruselImages = document.createElement('div');
	carruselImages.setAttribute('id', 'slideshow-container');
	carruselImages.classList = "h-10 w-10";
	carrusel.append(carruselImages);

	let buttonRight = document.createElement('button');
	buttonRight.setAttribute('id', 'next');
	buttonRight.textContent = ">";
	carrusel.append(buttonRight);

	$("#albums").append(carrusel);

	//Seleccionamos los elementos recién creados






	var imagenes = new Array();
	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
		data: { funcion: "obtenerTendencias" },
		// Cuando lleguen los datos...
		success: function (result) {
			imagenes = result;


		}
	})

	let currentSlide = 0;
	// Tiempo del carrusel
	let slideIntervalId = null;
	const slideInterval = 5000;
	const slidesToShow = 4;

	function showSlides(startIndex) {
		const $container = $("#slideshow-container");
		$container.empty();

		for (let i = startIndex; i < Math.min(startIndex + slidesToShow, imagenes.length); i++) {
			const $img = $("<img>").attr("src", imagenes[i].ruta);
			$container.append($img);
		}

		currentSlide = startIndex + 3;
	}

	showSlides(0);

	function nextSlide() {
		if (currentSlide < imagenes.length - 1) {
			showSlides(currentSlide + 1);
		} else {
			showSlides(0);
		}
	}

	slideIntervalId = setInterval(nextSlide, slideInterval);

	$("#prev").on("click", () => {
		if (currentSlide > 3) {
			showSlides(currentSlide - 4);
		}
	});

	$("#next").on("click", () => {
		if (currentSlide < imagenes.length - 1) {
			showSlides(currentSlide + 1);
		} else {
			showSlides(0);
		}
	});

	$("#slideshow-container").on("mouseenter", () => {
		clearInterval(slideIntervalId);
	}).on("mouseleave", () => {
		slideIntervalId = setInterval(nextSlide, slideInterval);
	});


}

function irAAlbum(event) {

	// Cogemos el id y el nombre del album
	let idalbum = (event.currentTarget.id);
	let nombrealbum = (event.currentTarget.attributes.nombre.value);

	//asignamos cookie para saber adonde vamos y usaremos el nombre posteriormente
	sessionStorage.setItem('idAlbum', idalbum);
	sessionStorage.setItem('nombreAlbum', nombrealbum);
	window.location.assign("./album.html");

};


$("#botonDesplegarMenu").click(function () {
	if (menuOpcionesHome == 'cerrado') abrirMenu();
	else cerrarMenu();
});

$("#IrAMiPerfil").click(function () {
	sessionStorage.removeItem('idPerfil');
	window.location.assign("./perfil.html");
})

$("#botonCerrarSesion").click(function () {
	cerrarSesion();
});

iniciarAlbum();