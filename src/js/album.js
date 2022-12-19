import { noti } from "./noti.js";
var n = new noti();

function Album() {

	this.abrirMenu = function () {
		$("#opcionesHome").show();
		$("#botonDesplegarMenu i").removeClass();
		$("#botonDesplegarMenu i").addClass('fa-solid fa-arrow-up');
		$("#botonDesplegarMenu").addClass('mb-2');
		menuOpcionesHome = "abierto";
	}

	this.cerrarSesion = function () {
		localStorage.removeItem('usuarioLogin');
		window.location.replace('./index.html');
	}

	this.cerrarMenu = function () {
		$("#opcionesHome").hide();
		$("#botonDesplegarMenu i").removeClass();
		$("#botonDesplegarMenu i").addClass('fa-solid fa-arrow-down');
		$("#botonDesplegarMenu").removeClass('mb-2');
		menuOpcionesHome = "cerrado";
	}

	this.crearImagen = function () {
		window.location.assign("./nuevaimagen.html");
	}

	this.iniciarAlbum = function () {


		// Guardamos nombre en session para usarlo en ajustes

		// Declaracion de variables
		let idalbum = sessionStorage.getItem('idAlbum');
		let nombrealbum = sessionStorage.getItem('nombreAlbum');
		$("#nombreAlbum").html(nombrealbum);
		menuOpcionesHome = "cerrado";


		$.ajax({
			url: "http://192.168.1.136/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
			data: { funcion: "obtenerImagenes", idalbum: idalbum },
			// Cuando lleguen los datos...
			success: function (result) {
				for (let i = 0; i < result.length; i++) {
					// asignamos variables con los datos
					let id = result[i].id;
					let titulo = result[i].titulo;
					let fecha = result[i].fecha;
					let ruta = result[i].ruta;

					// creamos los elementos
					let imagen = document.createElement("div");
					imagen.setAttribute('id', id);
					imagen.style = "cursor: pointer;";
					imagen.classList = "grid text-center bg-indigo-300 rounded-md lg:h-48 flex justify-center hover:bg-indigo-500";

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
				botonMas.setAttribute('onClick', 'album.crearImagen();');
				botonMas.style = "cursor: pointer;";
				botonMas.classList = "bg-indigo-300 rounded-full p-5 w-fit centrarHorizontal mt-16 hover:bg-indigo-500";



				let i = document.createElement('i');
				i.classList = "fa-solid fa-plus fa-2xl";

				// añadimos elementos despues de los albumes
				botonMas.append(i);
				colMas.append(botonMas);

				$("#imagenes").append(colMas);
			}
		})
	}
}

var album = new Album();

$("#botonDesplegarMenu").click(function () {
	if (menuOpcionesHome == 'cerrado') abrirMenu();
	else cerrarMenu();
});

$("#botonCerrarSesion").click(function () {
	cerrarSesion();
});


album.iniciarAlbum();