import { noti } from "./noti.js";
var n = new noti();


function abrirMenu() {
	$("#opcionesHome").show();
	$("#botonDesplegarMenu i").removeClass();
	$("#botonDesplegarMenu i").addClass('fa-solid fa-arrow-up');
	$("#botonDesplegarMenu").addClass('mb-2');
	menuOpcionesHome = "abierto";
}

function buscarTag(){
	let tags = $("#tagsBuscar").val();
	// Limpiamos anteriores resultados
	$("#cajaResultadosBusqueda").html("");

	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/imagen.php", async: false, type: "post", dataType: "json",
		data: { funcion: "buscarTags", tags:tags },
		// Cuando lleguen los datos...
		success: function (result) {
			result.forEach(function(imagen){
				// creamos los elementos
				let imagenContenedor = document.createElement("div");
				imagenContenedor.setAttribute('id', imagen.idimagen);
				imagenContenedor.classList = "imagenCard";
				imagenContenedor.addEventListener('click',irAImagen);

				let imagenTitulo = document.createElement("div");
				imagenTitulo.classList = "";
				imagenTitulo.textContent = imagen.titulo;

				let imagenNombre = document.createElement("div");
				imagenNombre.textContent = imagen.nombre;

				let imagenImagen = document.createElement('div');
				imagenImagen.classList = "w-full overflow-hidden ";

				let imagenRuta = document.createElement('img')
				imagenRuta.classList = "w-full min-h-full";
				imagenRuta.setAttribute('src', imagen.ruta)

				imagenImagen.append(imagenRuta);

				// añadimos elementos al div de imagenes
				imagenContenedor.append(imagenTitulo);
				imagenContenedor.append(imagenNombre);
				imagenContenedor.append(imagenImagen);
				$("#cajaResultadosBusqueda").append(imagenContenedor);
			})
		}
	})

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

function comprobarTags(){

	$("#tagsIntroducidos").html("Tags introducidos:<br/>");

	let tags = ($("#tagsBuscar").val().split(","))
	tags.forEach(function(tag) {
		let tagContenedor = document.createElement('div');
		tagContenedor.classList = "bg-blue-800  hover:bg-blue-400 text-white font-semibold rounded-xl py-1 px-2 mr-2 w-fit inline hover:scale-105 transition duration-200 ease-in-out";
		tagContenedor.textContent = tag;
		$("#tagsIntroducidos").append(tagContenedor);
	});
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

function iniciarBuscar() {


	// Declaracion de variables
	let idusuario = localStorage.getItem('idUsuario');
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

	// Miramos si hay que buscar un tag

	if (sessionStorage.getItem('buscarTag')!= null){
		$("#tagsBuscar").val(sessionStorage.getItem('buscarTag'));
		buscarTag();
	}
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

$("#botonBuscar").click(function(){
	buscarTag();
})

$("#tagsBuscar").on('keyup',function(e){
	// Cada vez que el usuario suelte la tecla de los tags, analizaremos la tecla pulsada, si es coma, ejecutaremos la funcion
	if (e.key==','){
		comprobarTags();
	}
});
// Hay que poner tambien el ultimo tag
$("#tagsBuscar").on('focusout',function(){
	comprobarTags();
});


iniciarBuscar();
