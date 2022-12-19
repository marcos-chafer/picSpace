<?php
// Permitimos el acceso
header('Access-Control-Allow-Origin: *');
// Requerimos que estén los archivos donde esta el dat que realiza conexiones a BBDD
require_once('./datAlbum.php');
// Obtenemos que funcion queremos realizar
$funcion = $_POST["funcion"];


// Comprobamos la función a realizar
switch ($funcion) {
	case 'guardarAlbum':
		$nombre = $_POST["nombre"];
		$idusuario = $_POST["idusuario"];
		echo guardarAlbum($nombre,$idusuario);
		break;
	case 'eliminarAlbum':
		$idusuario = $_POST["idusuario"];
		$idalbum = $_POST["idalbum"];
		$nombrealbum = $_POST["nombrealbum"];
		echo eliminarAlbum($idusuario,$idalbum,$nombrealbum);
		break;
	case 'modificarAlbum':
		$idalbum = $_POST["idalbum"];
		$nombre = $_POST["nombre"];
		echo modificarAlbum($idalbum,$nombre);
		break;
	case 'obtenerAlbums':
		$identificador = $_POST["identificador"];
		echo obtenerAlbums($identificador);
		break;
	default:
		break;
};



// FUNCIONES

function guardarAlbum($nombre,$idusuario){
// Registra un album en BBDD usando los params
// TODO securizar más esto

	$fecha = date("Y-m-d");
	$objAlbum = new datAlbum();
	
	$result = $objAlbum->guardarAlbum($nombre,$idusuario,$fecha);

	return $result;
}

function eliminarAlbum($idusuario,$idalbum,$nombrealbum){
// Elimina un album de BBDD

	$objAlbum = new datAlbum();
	
	$result = $objAlbum->eliminarAlbum($idusuario,$idalbum,$nombrealbum);

	return $result;
}

function modificarAlbum($idalbum,$nombre){
// Modifica datos de un album de BBDD utilizando los params
// TODO securizar más esto

	$objAlbum = new datAlbum();
	
	$result = $objAlbum->modificarAlbum($idalbum,$nombre);

	return $result;
}

function obtenerAlbums($identificador){
// Funcion que obtiene todos los álbums asignados a un usuario
	$objAlbum = new datAlbum();

	$result = $objAlbum->obtenerAlbums($identificador);

	return $result;
}



// function login($identificador, $contrasenya) {
// // Funcion que comprueba si el usuario y la contraseña pasados por parametro estan en BBDD
// 	$objUsuario = new datUsuario();

// 	$result = $objUsuario->login($identificador, $contrasenya);

// 	return $result;

// };

// function obtenerInicio($identificador) {
// 	$objUsuario = new datUsuario();

// 	$result = $objUsuario->obtenerInicio($identificador);

// 	return $result;
// }


?>