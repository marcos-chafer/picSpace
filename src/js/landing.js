function comprobarUsuario() {
	let user = $("#usuarioLogin").val().trim();
	let passw = $("#contrasenyaLogin").val().trim();
	// TODO usar notificación de alguna librería
	if (user == "" || passw == ""){
		alert("Usuario y/o contraseña no puede estar vacío");
		return;
	} 

	$.ajax({
		url: "http://127.0.0.1/picSpace/src/server/usuario.php", async: true, type: "post", dataType: "json", data: {funcion:"login",usuario:user,contrasenya:passw},
		success: function(result) {
			// nos viene json con login igual a true o false.
			if (result.login==false) /* controlamos poir libreria de notificaciones TODO */ alert("Usuario y/o contraseña incorrectos");
			if (result.login==true){
				// TODO Produccion poner el replace para no voler hacia atras
				window.location.assign("./home.html");
			};
		}
	});

}

$("#usuarioLogin").on('keypress', function (event) {
	// Si la tecla pulsado ha sido 13(enter)...
	if (event.which == 13) comprobarUsuario();
})
$("#contrasenyaLogin").on('keypress', function (event) {
	// Si la tecla pulsado ha sido 13(enter)...
	if (event.which == 13) comprobarUsuario();
})
$("#botonLogin").click(function () {
	comprobarUsuario();
})
