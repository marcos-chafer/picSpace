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

function iniciarSeguidores() {


	// Declaracion de variables
	let idusuario = localStorage.getItem('idUsuario');
	menuOpcionesHome = "cerrado";


	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
		data: { funcion: "obtenerSeguidores", idusuario: idusuario },
		// Cuando lleguen los datos...
		success: function (result) {
			result.forEach(function(seguidor){
				console.log(seguidor);
				let seguidorContenedor = document.createElement('div');
				seguidorContenedor.classList = "flex flex-col items-center border w-full lg:w-1/3 h-1/3";
		
				let seguidorTexto = document.createElement('div');
		
				let seguidorTextoIdentificador = document.createElement('span');
				seguidorTextoIdentificador.classList = "font-semibold cursor-pointer";
				seguidorTextoIdentificador.setAttribute('onclick','IrAPerfil('+seguidor.id+')');
				seguidorTextoIdentificador.textContent = seguidor.identificador;
				seguidorContenedor.append(seguidorTextoIdentificador)
				
				let seguidorImagen = document.createElement('div');
				seguidorImagen.classList = "flex flex-row mt-4"
		
				let seguidorRuta = document.createElement('img');
				seguidorRuta.classList = "w-20 mb-4";
				if (seguidor.ruta == null) seguidorRuta.setAttribute('src',"../assets/img/iconousuario.svg");
				else seguidorRuta.setAttribute('src',seguidor.ruta);
				seguidorImagen.append(seguidorRuta);
				
				seguidorContenedor.append(seguidorImagen);
		
				$("#cajaSeguidores").append(seguidorContenedor);
		
		
		
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


iniciarSeguidores();