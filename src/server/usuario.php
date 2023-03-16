<?php
// Permitimos el acceso
header('Access-Control-Allow-Origin: *');
// Requerimos que estén los archivos donde esta el dat que realiza conexiones a BBDD
require_once('./datUsuario.php');
// Obtenemos que funcion queremos realizar
if (isset($_POST["funcion"])) $funcion = $_POST["funcion"];
// Si no nos viene funcion en post debe de ser una subida de archivo
else $funcion = "guardarUsuarioImagenServidor";


switch ($funcion) {
	case 'buscarIdentificador':
		$identificador = $_POST["identificador"];
		echo buscarIdentificador($identificador);
		break;
	case 'eliminarNotificacion':
		$idusuario = $_POST['idusuario'];
		$idnotificacion = $_POST['idnotificacion'];
		echo eliminarNotificacion($idusuario,$idnotificacion);
		break;
	case 'guardarUsuario':
		$nombre = $_POST["nombre"];
		$identificador = $_POST["identificador"];
		$contrasenya = $_POST["contrasenya"];
		$email = $_POST["email"];
		$tags = $_POST["tags"];
		echo guardarUsuario($nombre,$identificador,$contrasenya,$email,$tags);
		break;
	case 'login':
		$usuario = $_POST["usuario"];
		$contrasenya = $_POST["contrasenya"];
		echo login($usuario,$contrasenya);
		break;
	case 'guardarUsuarioImagenServidor':
		// Si no nos viene archivo de imagen, modificamos
		if (!array_key_exists('file',$_FILES)){
			$idusuario = $_POST['idUsuario'];
			$nombre = $_POST['nombre'];
			$contrasenya = $_POST['contrasenya'];
			$descripcion = $_POST['descripcion'];
			$tags = $_POST['tags'];

			echo modificarUsuario($idusuario,$nombre,$contrasenya,$descripcion,$tags);
			break;
		}

		// Cogemos el nombre del archivo si nos viene
		$nombrearchivo = $_FILES['file']['full_path'];
		$nombreexplotado = explode(".",$nombrearchivo);
		
		$idusuario = $_POST['idUsuario'];
		$nombre = $_POST['nombre'];
		$contrasenya = $_POST['contrasenya'];
		$descripcion = $_POST['descripcion'];
		$tags = $_POST['tags'];
		// El nombre del archivo será nombre_perfil.extensionarchivo
		$titulo = $nombre."_perfil.".$nombreexplotado[1];

		$ruta = "/XAMPP/htdocs/picspace/media/".$idusuario."/".$titulo;


		// Creamos la carpeta del album si no existe
		if (!file_exists("/XAMPP/htdocs/picspace/media/".$idusuario)){
			mkdir("/XAMPP/htdocs/picspace/media/".$idusuario,777);
		}
		//Guardamos el archivo en la ruta seleccionada
		if(move_uploaded_file($_FILES['file']['tmp_name'],$ruta)){
			// Si todo va bien, guardamos imagen en BBDD
			// Ponemos la ruta de la imagen
			$ruta = "/picspace/media/".$idusuario."/".$titulo;
			// Llamamos a modificar usuario para guardarlo en BBDD
			echo modificarUsuario($idusuario,$nombre,$contrasenya,$descripcion,$tags,$ruta);
		}
		else{

		}
		break;		
	case 'obtenerIdUsuario':
		$identificador = $_POST["identificador"];
		echo obtenerIdUsuario($identificador);
		break;
	case 'obtenerNotificaciones':
		$idusuario = $_POST['idusuario'];
		echo obtenerNotificaciones($idusuario);
		break;
	case 'obtenerSeguidores':
		$idusuario = $_POST['idusuario'];
		echo obtenerSeguidores($idusuario);
		break;
	case 'obtenerSeguidos':
		$idusuario = $_POST['idusuario'];
		echo obtenerSeguidos($idusuario);
		break;
	case 'obtenerUsuario':
		$idusuario = $_POST['idusuario'];
		echo obtenerUsuario($idusuario);
		break;
	case 'obtenerUsuarioContrasenya':
		$idusuario = $_POST['idusuario'];
		echo obtenerUsuarioContrasenya($idusuario);
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

function eliminarNotificacion($idusuario,$idnotificacion){
	$objUsuario = new datUsuario();

	$result = $objUsuario->eliminarNotificacion($idusuario,$idnotificacion);

	return $result;
}

function guardarUsuario($nombre,$identificador,$contrasenya,$email,$tags){
// Registra usuario en BBDD usando los params
// TODO securizar más esto
	$objUsuario = new datUsuario();
	// Guardamos el usuario en BBDD
	$result = $objUsuario->guardarUsuario($nombre,$identificador,$contrasenya,$email,$tags);
	// Obtenemos la id del usuario recién creado para crear sus carpetas
	$idusuario = $objUsuario->obtenerIdUsuario($identificador);
	$objIdusuario = json_decode($idusuario);
	$idusuario = $objIdusuario[0]->id;
	$result_decode = json_decode($result);
	$result_decode->id = $idusuario;
	$result = json_encode($result_decode);
	// $result['idusuario'] = $idusuario;
	
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

function modificarUsuario($idusuario,$nombre,$contrasenya,$descripcion,$tags,$ruta = null) {
// Funcion que comprueba si el usuario y la contraseña pasados por parametro estan en BBDD
	$objUsuario = new datUsuario();

	$result = $objUsuario->modificarUsuario($idusuario,$nombre,$contrasenya,$descripcion,$tags,$ruta);

	return $result;

};

function obtenerIdUsuario($identificador) {
	$objUsuario = new datUsuario();

	$result = $objUsuario->obtenerIdUsuario($identificador);

	return $result;
}

function obtenerNotificaciones($idusuario) {
	$objUsuario = new datUsuario();

	$result = $objUsuario->obtenerNotificaciones($idusuario);

	return $result;
}

function obtenerSeguidores($idusuario) {
	$objUsuario = new datUsuario();

	$result = $objUsuario->obtenerSeguidores($idusuario);

	return $result;
}

function obtenerSeguidos($idusuario) {
	$objUsuario = new datUsuario();

	$result = $objUsuario->obtenerSeguidos($idusuario);

	return $result;
}

function obtenerUsuario($idusuario) {
	$objUsuario = new datUsuario();

	$result = $objUsuario->obtenerUsuario($idusuario);

	return $result;
}

function obtenerUsuarioContrasenya($idusuario) {
	$objUsuario = new datUsuario();

	$result = $objUsuario->obtenerUsuarioContrasenya($idusuario);

	return $result;
}
// TODO eliminar usuario (eliminando estructura de archivos)

?>