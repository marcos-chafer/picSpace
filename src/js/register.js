import { noti } from "./noti.js";
let n = new noti();


function comprobarCampos(){
	let nombre = $("#nombreUsuario").val().trim()
	let identificador = $("#identificadorUsuario").val().trim()
	let contrasenya = $("#contrasenyaUsuario").val().trim()
	let contrasenyasegunda = $("#contrasenyasegundaUsuario").val().trim()
	let email = $("#emailUsuario").val()

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
	// TODO validar email

	// Si todo va bien, registramos el usuario en BD

	$.ajax({
		url: "http://192.168.1.136/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
		data: {funcion:"guardarUsuario",nombre:nombre,identificador:identificador,contrasenya:contrasenya,email:email},
		success: function(result) {
			// nos viene json con exito = true si se hizo correctamente
			respuesta = result.exito;
		}
	});
	if (respuesta==true) n.notiInfo("Usuario registrado");
	// TODO Que hacer cuando nos registramos con éxito

}

function comprobarIdentificador(identificador){
	// Inicializamos la respuesta
	let respuesta="";
	$.ajax({
		url: "http://192.168.1.136/picSpace/src/server/usuario.php", async: false, type: "post", dataType: "json",
		data: {funcion:"buscarIdentificador",identificador:identificador},
		success: function(result) {
			// nos viene json con identificadorExiste igual a true o false, le asignamos el valor a la respuesta
			respuesta = result;
		}
	});
	//La retornamos
	return respuesta.identificadorExiste;
}



$("#botonContinuar").on('click',function(){
	comprobarCampos();
});