<?php
// Permitimos el acceso
header('Access-Control-Allow-Origin: *');
// Requerimos que estén los archivos donde esta el dat que realiza conexiones a BBDD
require_once('./datImagen.php');
// Obtenemos que funcion queremos realizar
$funcion = $_POST["funcion"];


switch ($funcion) {
	case 'obtenerImagenes':
		$idalbum = $_POST["idalbum"];
		echo obtenerImagenes($idalbum);
		break;
	case 'guardarImagen':
		$titulo = $_POST["titulo"];
		$descripcion = $_POST["descripcion"];
		$idalbum = $_POST["idalbum"];
		$idusuario = $_POST["idusuario"];
		echo guardarImagen($titulo,$descripcion,$idalbum,$idusuario);
		break;
	default:
		break;
};

function obtenerImagenes($idalbum){
// Funcion que obtiene todas las imagenes asignadas a un album
	$objImagen = new datImagen();

	$result = $objImagen->obtenerImagenes($idalbum);

	return $result;
}

function guardarImagen($titulo,$descripcion,$idalbum,$idusuario){
// Registra imagen en BBDD usando los params
// TODO securizar más esto

	$fecha = date("Y-m-d");
	$objImagen = new datImagen();
	
	$result = $objImagen->guardarImagen($titulo,$descripcion,$idalbum,$idusuario,$fecha);

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