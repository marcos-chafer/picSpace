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


	case 'comentarImagen':
		$idimagen = $_POST['idimagen'];
		$idusuario = $_POST['idusuario'];
		$comentarioTexto = $_POST['comentarioTexto'];
		echo comentarImagen($idimagen,$idusuario,$comentarioTexto);
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
	case 'obtenerComentarios':
		$idimagen = $_POST["idimagen"];
		echo obtenerComentarios($idimagen);
		break;
	case 'obtenerImagen':
		$idimagen = $_POST["idimagen"];
		echo obtenerImagen($idimagen);
		break;
	case 'obtenerImagenes':
		$idalbum = $_POST["idalbum"];
		echo obtenerImagenes($idalbum);
		break;
	case 'puntuarImagen':
		$idimagen = $_POST['idimagen'];
		$idusuario = $_POST['idusuario'];
		echo puntuarImagen($idimagen,$idusuario);
		break;
	default:
		break;
};

function comentarImagen($idimagen,$idusuario,$comentarioTexto){
// Registra comentario en BBDD usando los params

	$fecha = date("Y-m-d");
	$objImagen = new datImagen();
	
	$result = $objImagen->comentarImagen($idimagen,$idusuario,$comentarioTexto,$fecha);

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

function obtenerComentarios($idimagen){
// Funcion que obtiene los comentarios de una imagen
	// Instanciamos objeto de imagen
	$objImagen = new datImagen();
	// Llamamos al método del objeto imagen y guardamos lo que devuelva en una variable
	$result = $objImagen->obtenerComentarios($idimagen);

	return $result;
}

function obtenerImagen($idimagen){
// Funcion que obtiene la información de una imagen
	// Instanciamos objeto de imagen
	$objImagen = new datImagen();
	// Llamamos al método del objeto imagen y guardamos lo que devuelva en una variable
	$result = $objImagen->obtenerImagen($idimagen);

	return $result;
}

function obtenerImagenes($idalbum){
// Funcion que obtiene todas las imagenes asignadas a un album
	$objImagen = new datImagen();

	$result = $objImagen->obtenerImagenes($idalbum);

	return $result;
}

function puntuarImagen($idimagen,$idusuario){
// Funcion que decide si puntuar o quitar el punto a una imagen
	$objImagen = new datImagen();

	$result = $objImagen->puntuarImagen($idimagen,$idusuario);

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