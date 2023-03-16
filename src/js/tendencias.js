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

function eliminarNotificacion(id){
// Elimina notificación de bbdd
	let idusuario = localStorage.getItem('idUsuario');


	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
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

function iniciarAlbum() {

	menuOpcionesHome = "cerrado";


	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
		data: { funcion: "obtenerTendencias" },
		// Cuando lleguen los datos...
		success: function (result) {
			//Recorremos las imagenes
			for (let i = 0; i < result.length; i++) {
				// asignamos variables con los datos
				let id = result[i].id;
				let titulo = result[i].titulo;
				// Nos quedamos solo con el nombre y no con la extensión
				titulo = titulo.split(".")[0];
				let fecha = result[i].fecha;
				let ruta = result[i].ruta;

				console.log(result[i]);

				// creamos los elementos
				let imagen = document.createElement("div");
				imagen.setAttribute('id', id);
				imagen.style = "cursor: pointer;";
				imagen.classList = "grid text-center bg-indigo-300 w-1/2 h-20 mx-20 mb-10 rounded-md flex justify-center hover:bg-indigo-500 hover:scale-110 transition duration-200 ease-in-out";
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
				$("#cajaTendencias").append(imagen);
			}
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