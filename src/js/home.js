function iniciarHome() {
	$.ajax({
		url: "http://127.0.0.1/picSpace/src/server/home.php", async: true, type: "post", dataType: "json", data: {funcion:"obtenerFeed"} , success: function (result) {postIniciarHome(result)}
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

iniciarHome();