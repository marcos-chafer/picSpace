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

function IrAPerfil(idperfil){

	sessionStorage.setItem('idPerfil',idperfil);
	window.location.assign('./perfil.html');
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

function iniciarSiguiendo() {


	// Declaracion de variables
	let idusuario = localStorage.getItem('idUsuario');
	menuOpcionesHome = "cerrado";


	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
		data: { funcion: "obtenerSeguidores", idusuario: idusuario },
		// Cuando lleguen los datos...
		success: function (result) {
			result.forEach(function(seguido){
				console.log(seguido);
				let seguidoContenedor = document.createElement('div');
				seguidoContenedor.classList = "flex flex-col items-center border w-full lg:w-1/3 h-1/3";
				
				let seguidoTextoIdentificador = document.createElement('span');
				seguidoTextoIdentificador.classList = "font-semibold cursor-pointer";
				seguidoTextoIdentificador.setAttribute('onclick','IrAPerfil('+seguido.id+')');
				seguidoTextoIdentificador.textContent = seguido.identificador;
				seguidoContenedor.append(seguidoTextoIdentificador)
				
				let seguidoImagen = document.createElement('div');
				seguidoImagen.classList = "flex flex-row mt-4"
		
				let seguidoRuta = document.createElement('img');
				seguidoRuta.classList = "w-20 mb-4";
				if (seguido.ruta == null) seguidoRuta.setAttribute('src',"../assets/img/iconousuario.svg");
				else seguidoRuta.setAttribute('src',seguido.ruta);
				seguidoImagen.append(seguidoRuta);
				
				seguidoContenedor.append(seguidoImagen);
		
				$("#cajaSeguidos").append(seguidoContenedor);
		
		
		
			})
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
});

$("#botonCerrarSesion").click(function () {
	cerrarSesion();
});


iniciarSiguiendo();
