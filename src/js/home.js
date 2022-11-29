

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
	
	// $.ajax({
	// 	url: "http://192.168.1.136/picSpace/src/server/usuario.php", async: true, type: "post", dataType: "json",
	// 	data: {funcion:"obtenerInicio", identificador:identificador},
	// 	success: function (result) {postIniciarHome(result)}
	// })
}
function obtenerIdUsuario(){
	let identificador = localStorage.getItem('usuarioLogin');

	$.ajax({
		url: "http://192.168.1.136/picSpace/src/server/usuario.php", async: true, type: "post", dataType: "json",
		data: {funcion:"obtenerIdUsuario", identificador:identificador},
		success: function (result) {
			localStorage.setItem('idUsuario',result[0].id);
		}
	})

}

function postIniciarHome(datos) {
	console.log(datos)
	for (let i = 0; i < datos.length; i++) {
		let nombreUsuario = datos[i].nombreUsuario;
		let identificadorUsuario = datos[i].identificadorUsuario;
		let fotoPerfilUsuario = datos[i].fotoPerfilUsuario;
		let tituloImagenUsuario = datos[i].tituloImagenUsuario;
		let imagenUsuario = datos[i].imagenUsuario;

		let contenedor = document.createElement("div");
		contenedor.classList.add("grid","lg:grid-cols-2","justify-evenly","border","border-black");

		let infoUsuario = document.createElement("div");
		infoUsuario.classList.add("justify-self-center");

		let fotoPerfilInfoUsuario = document.createElement("span");
		fotoPerfilInfoUsuario.textContent=fotoPerfilUsuario;
		infoUsuario.append(fotoPerfilInfoUsuario);

		let nombreInfoUsuario = document.createElement("span");
		nombreInfoUsuario.textContent=nombreUsuario;
		infoUsuario.append(nombreInfoUsuario);

		let identificadorInfoUsuario = document.createElement("span");
		identificadorInfoUsuario.textContent=identificadorUsuario;
		infoUsuario.append(identificadorInfoUsuario);

		contenedor.append(infoUsuario);

		let infoImagen = document.createElement("div");
		infoImagen.classList.add("justify-self-center");

		let tituloImagenInfoUsuario = document.createElement("span");
		tituloImagenInfoUsuario.textContent=tituloImagenUsuario;
		infoImagen.append(tituloImagenInfoUsuario);

		let imagenInfoUsuario = document.createElement("span");
		imagenInfoUsuario.textContent=imagenUsuario;
		infoImagen.append(imagenInfoUsuario);

		contenedor.append(infoImagen);
		
		$("#inicioHome").append(contenedor);
		
	}
}


$("#botonDesplegarMenu").click(function(){
	if (menuOpcionesHome=="cerrado") abrirMenu();
	else cerrarMenu();
});

$("#botonCerrarSesion").click(function(){
	cerrarSesion();
});

iniciarHome();