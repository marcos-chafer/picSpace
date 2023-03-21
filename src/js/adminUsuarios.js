import { noti } from "./noti.js";
let n = new noti();
var menuOpcionesHome = "cerrado";



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

function eliminarUsuario(id){
// Elimina usuario de bbdd
	let idusuario = id;

	$.ajax({
		url: "http://picspace.epizy.com/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
		data: { funcion: "eliminarCuenta", idusuario: idusuario },
		// Cuando lleguen los datos...
		success: function (result) {
			if (result.exito == true){
				sessionStorage.setItem('noti','cuentaEliminada');
				window.location.reload();
			}
		}
	})

}

function iniciarInicioAdmin() {

	// Declaracion de variables
	menuOpcionesHome = "cerrado";

	// Controlamos notis
	let noti = sessionStorage.getItem('noti');
	switch (noti) {
		case "cuentaEliminada":
			n.notiInfo("Cuenta eliminada con éxito");
			break;
		default:
			break;
	}
	//Limpiamos noti una vez controlada
	sessionStorage.removeItem('noti');

	// Obtenemos estadísticas
	$.ajax({
		url: "http://picspace.epizy.com/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
		data: { funcion: "obtenerEstadisticasUsuarios"},
		success: function (result) {
			// Recorremos los usuarios que nos llegan
			result.forEach(function(usuario){
				let usuarioContenedor = document.createElement('div');
				usuarioContenedor.classList = "flex";

				let usuarioRuta = document.createElement('img');
				if (usuario.ruta == null) usuarioRuta.setAttribute('src','../assets/img/iconousuario.svg');
				else usuarioRuta.setAttribute('src',usuario.ruta);
				usuarioRuta.classList = "w-6 h-6 rounded-full mr-2 hover:scale-125 transition duration-200 ease-in-out";
				usuarioContenedor.append(usuarioRuta);
				
				let usuarioTexto = document.createElement('span');
				usuarioTexto.classList = "bg-blue-300 w-fit min-w-[20%] rounded-lg pl-2";
				usuarioTexto.textContent = "@"+usuario.identificador+" "+usuario.nombre;
				usuarioContenedor.append(usuarioTexto);

				let usuarioBotones = document.createElement('div');
				usuarioBotones.classList = "flex justify-center w-6 items-center ml-auto bg-red-500 rounded-full  hover:scale-150 transition duration-200 ease-in-out";
				if (usuario.identificador != "admin") usuarioContenedor.append(usuarioBotones);

				let usuarioEliminar = document.createElement('i');
				usuarioEliminar.setAttribute('id','botonEliminar_'+usuario.id);
				usuarioEliminar.setAttribute('title','Eliminar cuenta');
				usuarioEliminar.classList = "fa fa-x fa-md cursor-pointer";
				// Admin no se puede eliminar a si mismo
				if (usuario.identificador != "admin") usuarioBotones.append(usuarioEliminar);

				$("#usuarios").append(usuarioContenedor);

				// Agregamos funcionalidad a los botones

				$("#botonEliminar_"+usuario.id).click(function(){

					// Usamos una notificación custom sin usar noti ya que necesitamos que utilice funciones de esta página
					iziToast.show({
						title: "¿Está seguro de que desea eliminar la cuenta?",
						timeout: 5000,
						position: 'topCenter',
						icon: 'fa-solid fa-info',
						color: 'red',
						buttons: [
							['<button>Eliminar</button>', function () {
								eliminarUsuario(usuario.id);
							}],
						],
					});
				})

			})			
		}
	});

}

// ASIGNACIÓN DE EVENTOS
$("#botonDesplegarMenu").click(function () {
	if (menuOpcionesHome == 'cerrado') abrirMenu();
	else cerrarMenu();
});

$("#botonCerrarSesion").click(function () {
	cerrarSesion();
});


iniciarInicioAdmin();
