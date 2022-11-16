<?php
// Permitimos el acceso
header('Access-Control-Allow-Origin: *');
// Requerimos que estén los archivos donde esta el dat que realiza conexiones a BBDD
require_once('./datUsuario.php');
// Obtenemos que funcion queremos realizar
$funcion = $_POST["funcion"];


switch ($funcion) {
	case 'login':
		$usuario = $_POST["usuario"];
		$contrasenya = $_POST["contrasenya"];
		echo login($usuario,$contrasenya);
		break;
	default:
		break;
};

function login($usuario, $contrasenya) {

	$objUsuario = new datUsuario();

	$result = $objUsuario->login($usuario, $contrasenya);

	return $result;

};

?>