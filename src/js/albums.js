import { noti } from "./noti.js";
let n = new noti();

function abrirMenu(){
	$("#opcionesHome").show();
	$("#botonDesplegarMenu i").removeClass();
	$("#botonDesplegarMenu i").addClass('fa-solid fa-arrow-up');
	$("#botonDesplegarMenu").addClass('mb-2');
	menuOpcionesHome = "abierto";
}

function cerrarSesion(){
	localStorage.removeItem('usuarioLogin');
	window.location.replace('./index.html');
}

function cerrarMenu(){
	$("#opcionesHome").hide();
	$("#botonDesplegarMenu i").removeClass();
	$("#botonDesplegarMenu i").addClass('fa-solid fa-arrow-down');
	$("#botonDesplegarMenu").removeClass('mb-2');
	menuOpcionesHome = "cerrado";
}

function crearAlbum(){
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
		url: "http://192.168.1.136/picSpace/src/server/album.php", async: false, type: "post", dataType: "json",
		data: {funcion:"obtenerAlbums", identificador:identificador},
		// Cuando lleguen los datos...
		success: function (result){
			for (let i = 0; i < result.length; i++) {
				// asignamos variables con los datos
				let id = result[i].id;
				let nombre = result[i].nombre;
				let fecha = result[i].fecha;
				let ruta = result[i].ruta;
				
				// creamos los elementos
				let album = document.createElement("div");
				album.setAttribute('id',id);
				album.setAttribute('nombre',nombre);
				album.addEventListener('click',irAAlbum);
				album.style = "cursor: pointer;";
				album.classList = "bg-indigo-300 rounded-md lg:h-48 hover:bg-indigo-500 text-center";

				let albumTitulo = document.createElement("div");
				albumTitulo.textContent = nombre;

				let albumImagen = document.createElement('div');
				albumImagen.classList = "h-32";

				let albumRuta = document.createElement('img');
				albumRuta.setAttribute('src',ruta)
				console.log(result);
				
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
		botonMas.setAttribute('id','botonMas');
		botonMas.addEventListener('click',crearAlbum);
		botonMas.style = "cursor: pointer;";
		botonMas.classList = "bg-indigo-300 rounded-full p-5 w-fit centrarHorizontal mt-16 hover:bg-indigo-500";


		
		let i = document.createElement('i');
		i.classList = "fa-solid fa-plus fa-2xl";
		
		// añadimos elementos despues de los albumes
		botonMas.append(i);
		colMas.append(botonMas);

		$("#albums").append(colMas);
		}
	})
}

function irAAlbum(event) {

	// Cogemos el id y el nombre del album
	let idalbum = (event.currentTarget.id);
	let nombrealbum = (event.currentTarget.attributes.nombre.value);

	//asignamos cookie para saber adonde vamos y usaremos el nombre posteriormente
	sessionStorage.setItem('idAlbum',idalbum);
	sessionStorage.setItem('nombreAlbum',nombrealbum);
	window.location.assign("./album.html");
	
};


$("#botonDesplegarMenu").click(function(){
	if (menuOpcionesHome=='cerrado') abrirMenu();
	else cerrarMenu();
});

$("#botonCerrarSesion").click(function(){
	cerrarSesion();
});

iniciarAlbum();