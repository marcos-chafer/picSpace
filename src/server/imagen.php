<?php
// Permitimos el acceso
header('Access-Control-Allow-Origin: *');
// Requerimos que estén los archivos donde esta el dat que realiza conexiones a BBDD
require_once('./datImagen.php');
// Obtenemos que funcion queremos realizar
if (isset($_POST["funcion"])) $funcion = $_POST["funcion"];
// Si no nos viene funcion en post debe de ser una subida de archivo
else $funcion = "guardarImagenServidor";

switch ($funcion) {
	case 'obtenerImagenes':
		$idalbum = $_POST["idalbum"];
		echo obtenerImagenes($idalbum);
		break;
	case 'guardarImagenServidor':
		// Cogemos el nombre del archivo
		$nombrearchivo = $_FILES['file']['full_path'];
		$nombreexplotado = explode(".",$nombrearchivo);
		
		$titulo = $_POST['filename'].".".$nombreexplotado[1];
		// Separamos el titulo para obtener la extensión
		$idusuario = $_POST['idUsuario'];
		$idalbum = $_POST['idAlbum'];
		$nombrealbum = $_POST['nombreAlbum'];
		$descripcion = $_POST['descripcion'];

		$ruta = "/XAMPP/htdocs/picspace/media/".$idusuario."/".$nombrealbum."/".$titulo;

		//Guardamos el archivo en la ruta seleccionada
		if(move_uploaded_file($_FILES['file']['tmp_name'],$ruta)){
			// Si todo va bien, guardamos imagen en BBDD
			// Ponemos la ruta de la imagen
			$ruta = "/picspace/media/".$idusuario."/".$nombrealbum."/".$titulo;

			echo guardarImagenBBDD($idusuario,$idalbum,$nombrealbum,$titulo,$ruta,$descripcion);
		}
		else{

		}
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

function guardarImagenBBDD($idusuario,$idalbum,$nombrealbum,$titulo,$ruta,$descripcion,){
// Registra imagen en BBDD usando los params
// TODO securizar más esto

	$fecha = date("Y-m-d");
	$objImagen = new datImagen();
	
	$result = $objImagen->guardarImagenBBDD($idusuario,$idalbum,$nombrealbum,$titulo,$ruta,$descripcion,$fecha);

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