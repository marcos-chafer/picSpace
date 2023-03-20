import { noti } from "./noti.js";
let n = new noti();

function cambiarImagen(modo){
	if (modo == "anterior"){
		let imagen = $("#imagenPresentacion").prop('src').split("/");
		imagen = imagen[imagen.length-1]
		if (imagen == 'presentacion1.bmp'){
			$("#imagenPresentacion").prop('src','../assets/img/presentacion3.bmp');
		}
		else if (imagen == 'presentacion2.bmp'){
			$("#imagenPresentacion").prop('src','../assets/img/presentacion1.bmp');
		}
		else{
			$("#imagenPresentacion").prop('src','../assets/img/presentacion2.bmp');
		}
	}
	else if (modo == "siguiente") {
		let imagen = $("#imagenPresentacion").prop('src').split("/");
		imagen = imagen[imagen.length-1]
		if (imagen == 'presentacion1.bmp'){
			$("#imagenPresentacion").prop('src','../assets/img/presentacion2.bmp');
		}
		else if (imagen == 'presentacion2.bmp'){
			$("#imagenPresentacion").prop('src','../assets/img/presentacion3.bmp');
		}
		else{
			$("#imagenPresentacion").prop('src','../assets/img/presentacion1.bmp');
		}
	}
}

function comprobarLogin(){
	//SI hay cookie de usuario redirigimos a su inicio
	if(localStorage.getItem('usuarioLogin')) window.location.replace("./home.html");
}

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
		url: "http://192.168.1.137/picSpace/src/server/usuario.php", async: true, type: "post", dataType: "json", data: {funcion:"login",usuario:user,contrasenya:passw},
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
			// Cuando se loguee el administrador
			if (result.login==true && user=="admin"){
				window.location.replace("./adminHome.html");
			}
			else if (result.login==true){
				localStorage.setItem('usuarioLogin',result.usuario.identificador);
				localStorage.setItem('idUsuario',result.usuario.id);
				localStorage.setItem('usuarioRuta',result.usuario.ruta);
				window.location.replace("./home.html");
			};
		}
	});

}

function iniciarCarrusel() {

	setInterval(function(){
		let imagen = $("#imagenPresentacion").prop('src').split("/");
		imagen = imagen[imagen.length-1]
		if (imagen == 'presentacion1.bmp'){
			$("#imagenPresentacion").prop('src','../assets/img/presentacion2.bmp');
		}
		else if (imagen == 'presentacion2.bmp'){
			$("#imagenPresentacion").prop('src','../assets/img/presentacion3.bmp');
		}
		else{
			$("#imagenPresentacion").prop('src','../assets/img/presentacion1.bmp');
		}

	},5000)
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
	window.location.assign("./register.html");
})
$("#botonImagenAnterior").click(function(){
	cambiarImagen("anterior");
})
$("#botonImagenSiguiente").click(function(){
	cambiarImagen("siguiente");
})

// Controlamos notis
let notif = sessionStorage.getItem('noti');
switch (notif) {
	case "cuentaEliminada":
		n.notiInfo("Cuenta eliminada con éxito");
		break;
	default:
		break;
}
//Limpiamos noti una vez controlada
sessionStorage.removeItem('noti');

comprobarLogin();
iniciarCarrusel();
