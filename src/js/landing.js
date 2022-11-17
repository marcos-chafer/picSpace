function comprobarUsuario() {
	let user = $("#usuarioLogin").val().trim();
	let passw = $("#contrasenyaLogin").val().trim();
	if (user == "" || passw == ""){
		iziToast.show({
			title:"Error",
			message: 'Usuario y/o contraseña están vacíos',
			timeout: 5000,
			color:'red',
			icon:"fa-solid fa-xmark",
			position:'topRight',
		});
		return;
	} 

	$.ajax({
		url: "http://192.168.1.136/picSpace/src/server/usuario.php", async: true, type: "post", dataType: "json", data: {funcion:"login",usuario:user,contrasenya:passw},
		success: function(result) {
			// nos viene json con login igual a true o false.
			if (result.login==false) {
				iziToast.show({
					title:"Error",
					message: 'Usuario y/o contraseña incorrectos',
					timeout: 5000,
					color:'red',
					position:'topRight',
				});	
			}
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
$("#botonRegistrarLogin").click(function () {
	
})
