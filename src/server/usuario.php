<?php
// Permitimos el acceso
header('Access-Control-Allow-Origin: *');
// Requerimos que estén los archivos donde esta el dat que realiza conexiones a BBDD
require_once('./datUsuario.php');
// Obtenemos que funcion queremos realizar
$funcion = $_POST["funcion"];


switch ($funcion) {
	case 'buscarIdentificador':
		$identificador = $_POST["identificador"];
		echo buscarIdentificador($identificador);
		break;
	case 'guardarUsuario':
		$nombre = $_POST["nombre"];
		$identificador = $_POST["identificador"];
		$contrasenya = $_POST["contrasenya"];
		$email = $_POST["email"];
		echo guardarUsuario($nombre,$identificador,$contrasenya,$email);
		break;
	case 'login':
		$usuario = $_POST["usuario"];
		$contrasenya = $_POST["contrasenya"];
		echo login($usuario,$contrasenya);
		break;
	case 'obtenerIdUsuario':
		$identificador = $_POST["identificador"];
		echo obtenerIdUsuario($identificador);
		break;
	case 'obtenerInicio':
		$identificador = $_POST['identificador'];
		echo obtenerInicio($identificador);
		break;
	default:
		break;
};

function buscarIdentificador($identificador){
// Funcion que comprueba si existe el identificador pasado por parametro
	$objUsuario = new datUsuario();

	$result = $objUsuario->buscarIdentificador($identificador);

	return $result;
}

function guardarUsuario($nombre,$identificador,$contrasenya,$email){
// Registra usuario en BBDD usando los params
// TODO securizar más esto
	$objUsuario = new datUsuario();
	// Guardamos el usuario en BBDD
	$result = $objUsuario->guardarUsuario($nombre,$identificador,$contrasenya,$email);
	// Obtenemos la id del usuario recién creado para crear sus carpetas
	$idusuario = $objUsuario->obtenerIdUsuario($identificador);
	$objIdusuario = json_decode($idusuario);
	$idusuario = $objIdusuario[0]->id;
	
	// Creamos estructura de carpetas del usuario
	mkdir('/XAMPP/htdocs/picspace/media/'.$idusuario."/",0777,true);

	return $result;
}

function login($identificador, $contrasenya) {
// Funcion que comprueba si el usuario y la contraseña pasados por parametro estan en BBDD
	$objUsuario = new datUsuario();

	$result = $objUsuario->login($identificador, $contrasenya);

	return $result;

};

function obtenerIdUsuario($identificador) {
	$objUsuario = new datUsuario();

	$result = $objUsuario->obtenerIdUsuario($identificador);

	return $result;
}

function obtenerInicio($identificador) {
	$objUsuario = new datUsuario();

	$result = $objUsuario->obtenerInicio($identificador);

	return $result;
}
// TODO eliminar usuario (eliminando estructura de archivos)

?>