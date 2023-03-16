

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


function iniciarHome() {
	// alert("usuarioLogin es: "+identificador);

	// Declaracion de variables
	this.menuOpcionesHome = "cerrado";

	obtenerIdUsuario();
	let idusuario = localStorage.getItem('idUsuario');
	
	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/imagen.php", async: true, type: "post", dataType: "json",
		data: {funcion:"obtenerInicio", idusuario:idusuario},
		success: function (result) {
			postIniciarHome(result)
		}
	})
}

function IrAAlbum(idalbum,nombrealbum){

	sessionStorage.setItem('idAlbum',idalbum);
	sessionStorage.setItem('nombreAlbum',nombrealbum);
	window.location.assign('./album.html');
}

function IrAPerfil(idperfil){

	sessionStorage.setItem('idPerfil',idperfil);
	window.location.assign('./perfil.html');
}

function IrAImagen(idalbum,nombrealbum,idimagen){

	sessionStorage.setItem('idAlbum',idalbum);
	sessionStorage.setItem('nombreAlbum',nombrealbum);
	sessionStorage.setItem('idImagen',idimagen);
	window.location.assign('./imagen.html');
}

function obtenerIdUsuario(){
	let identificador = localStorage.getItem('usuarioLogin');

	$.ajax({
		url: "http://192.168.1.137/picSpace/src/server/usuario.php", async: true, type: "post", dataType: "json",
		data: {funcion:"obtenerIdUsuario", identificador:identificador},
		success: function (result) {
			localStorage.setItem('idUsuario',result[0].id);
		}
	})

}

function postIniciarHome(datos) {
	datos.forEach(function(post){
		console.log(post);
		let postContenedor = document.createElement('div');
		postContenedor.classList = "flex flex-col items-center border w-full lg:w-1/3 h-1/3";

		let postTexto = document.createElement('div');

		let postTextoIdentificador = document.createElement('span');
		postTextoIdentificador.classList = "font-semibold cursor-pointer";
		postTextoIdentificador.setAttribute('onclick','IrAPerfil('+post.idusuario+')');
		postTextoIdentificador.textContent = post.identificador;
		postContenedor.append(postTextoIdentificador)

		let postTextoAlbum = document.createElement('span');
		postTextoAlbum.classList = "font-semibold cursor-pointer";
		postTextoAlbum.textContent = post.nombrealbum;
		postTextoAlbum.setAttribute('onclick','IrAAlbum('+post.id_album+',"'+post.nombrealbum+'")');
		postContenedor.append(postTextoAlbum)

		postTexto.textContent = " ha subido una foto a ";
		postTexto.append(postTextoAlbum);
		postContenedor.append(postTexto);

		let postImagen = document.createElement('div');
		postImagen.classList = "flex flex-row mt-4"

		let postRuta = document.createElement('img');
		postRuta.classList = "w-40 cursor-pointer";
		postRuta.setAttribute('title',post.titulo);
		postRuta.setAttribute('src',post.ruta);
		postRuta.setAttribute('onclick','IrAImagen('+post.id_album+',"'+post.nombrealbum+'",'+post.idimagen+')');
		postImagen.append(postRuta);

		let postImagenPuntuar= document.createElement('i');
		postImagenPuntuar.classList = "ml-4 fa fa-heart";
		postImagen.append(postImagenPuntuar);

		let postImagenPuntuacion = document.createElement('span');
		postImagenPuntuacion.classList = "ml-2";
		postImagenPuntuacion.textContent = post.puntos;
		postImagen.append(postImagenPuntuacion);


		postContenedor.append(postImagen);


		$("#inicioHome").append(postContenedor);



	})

		
}


$("#botonDesplegarMenu").click(function(){
	if (menuOpcionesHome=="cerrado") abrirMenu();
	else cerrarMenu();
});

$("#IrAMiPerfil").click(function() {
	sessionStorage.removeItem('idPerfil');
	window.location.assign("./perfil.html");
})

$("#botonCerrarSesion").click(function(){
	cerrarSesion();
});

iniciarHome();