import { noti } from "./noti.js";
let n = new noti();


function comprobarCampos(){
	let nombre = $("#nombreUsuario").val().trim()
	let identificador = $("#identificadorUsuario").val().trim()
	let contrasenya = $("#contrasenyaUsuario").val().trim()
	let contrasenyasegunda = $("#contrasenyasegundaUsuario").val().trim()
	let email = $("#emailUsuario").val();
	let tags = $("#tagsUsuario").val();

	// Inicializamos la expresión regular para comprobar si el email es válido
	let verificaremail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

	// Comprobamos todos los campos si vienen vacíos o son demasiado largos
	if (nombre==""){
		n.notiError("Nombre vacío");
		return;
	}
	else if (nombre.length>50){
		n.notiError("Nombre demasiado largo");
		$("#nombreUsuario").val("");
		return;
	}
	else if (identificador==""){
		n.notiError("Identificador vacío");
		return;
	}
	else if (identificador.length>20){
		n.notiError("Identificador demasiado largo");
		$("#identificadorUsuario").val("");
		return;
	}

	// Debemos comprobar que el identificador no esté en uso
	let respuesta = comprobarIdentificador(identificador);
	//Si existe el identificador..
	if (respuesta==true) {
		n.notiError("El identificador ya existe, pruebe con otro");
		return;
	}

	else if (contrasenya==""){
		n.notiError("Contraseña no puede estar vacía");
		return;
	}
	else if (contrasenya.length>50){
		n.notiError("Contraseña demasiado larga");
		$("#contrasenyaUsuario").val("");
		return;
	}
	else if (contrasenyasegunda==""){
		n.notiError("Repetir contraseña no puede estar vacío");
		return;
	}
	else if (contrasenyasegunda!=contrasenya){
		n.notiError("Las contraseñas no coinciden");
		return;
	}
	else if (email.length>250){
		n.notiError("Email demasiado largo");
		$("#contrasenyaUsuario").val("");
		return;
	}
	else if (email==""){
		n.notiError("Email no puede estar vacío");
		return;
	}
	else if (!verificaremail.test(email)){
		n.notiError("Email incorrecto");
		return;
	}
	// Si todo va bien, registramos el usuario en BD

	$.ajax({
		url: "http://127.0.0.1/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
		data: {funcion:"guardarUsuario",nombre:nombre,identificador:identificador,contrasenya:contrasenya,email:email ,tags:tags},
		success: function(result) {
			// nos viene json con exito = true si se hizo correctamente
			respuesta = result.exito;
		}
	});
		// Que hacer cuando nos registramos con éxito
	if (respuesta==true){
		n.notiInfo("Usuario registrado");
		localStorage.setItem('usuarioLogin', identificador);
		window.location.replace('./home.html');
	}

}

function comprobarIdentificador(identificador){
	// Inicializamos la respuesta
	let respuesta="";
	$.ajax({
		url: "http://127.0.0.1/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
		data: {funcion:"buscarIdentificador",identificador:identificador},
		success: function(result) {
			// nos viene json con identificadorExiste igual a true o false, le asignamos el valor a la respuesta
			respuesta = result;
		}
	});
	//La retornamos
	return respuesta.identificadorExiste;
}

function comprobarTags(){

	$("#tagsIntroducidos").html("Tags introducidos:<br/>");

	let tags = ($("#tagsUsuario").val().split(","))
	tags.forEach(function(tag) {
		let tagContenedor = document.createElement('div');
		tagContenedor.classList = "bg-indigo-800  hover:bg-indigo-400 text-white font-semibold rounded-xl py-1 px-2 mr-2 w-fit inline";
		tagContenedor.textContent = tag;
		$("#tagsIntroducidos").append(tagContenedor);
	});
}


$("#botonContinuar").on('click',function(){
	comprobarCampos();
});

$("#tagsUsuario").on('keyup',function(e){
	// Cada vez que el usuario suelte la tecla de los tags, analizaremos la tecla pulsada, si es coma, ejecutaremos la funcion
	if (e.key==','){
		comprobarTags();
	}
});
// Hay que poner tambien el ultimo tag
$("#tagsUsuario").on('focusout',function(){
	comprobarTags();
});