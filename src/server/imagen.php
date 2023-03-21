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

	case 'buscarTags':
		$tags = $_POST['tags'];
		echo buscarTags($tags);
		break;
	case 'comentarImagen':
		$idimagen = $_POST['idimagen'];
		$idusuario = $_POST['idusuario'];
		$identificador = $_POST['identificador'];
		$comentarioTexto = $_POST['comentarioTexto'];
		echo comentarImagen($idimagen,$idusuario,$identificador,$comentarioTexto);
		break;
	case 'comprobarPunto':
		$idimagen = $_POST['idimagen'];
		$idusuario = $_POST['idusuario'];
		echo comprobarPunto($idimagen,$idusuario);
		break;
	case 'eliminarImagen':
		$idusuario = $_POST["idusuario"];
		$idimagen = $_POST["idimagen"];
		$nombreimagen = $_POST["nombreimagen"];
		$nombrealbum = $_POST["nombrealbum"];
		echo eliminarImagen($idusuario,$idimagen,$nombreimagen,$nombrealbum);
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
		$tags = $_POST['tags'];

		$ruta = "/home/vol10_2/epizy.com/epiz_33830609/htdocs/picSpace/media/".$idusuario."/".$nombrealbum."/".$titulo;

		//Guardamos el archivo en la ruta seleccionada
		if(move_uploaded_file($_FILES['file']['tmp_name'],$ruta)){

			// Si todo va bien, guardamos imagen en BBDD
			// Ponemos la ruta de la imagen
			$ruta = "http://picspace.epizy.com/picSpace/media/".$idusuario."/".$nombrealbum."/".$titulo;

			echo guardarImagenBBDD($idusuario,$idalbum,$nombrealbum,$titulo,$ruta,$descripcion,$tags);
		}
		else{

		}
		break;
	case 'modificarImagen':
		$idimagen = $_POST["idimagen"];
		$nombre = $_POST["nombre"];
		$descripcion = $_POST["descripcion"];
		$tags = $_POST["tags"];
		echo modificarImagen($idimagen,$nombre,$descripcion,$tags);
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
	case 'obtenerTendencias':
		echo obtenerTendencias();
		break;
	case 'puntuarImagen':
		$idimagen = $_POST['idimagen'];
		$idusuario = $_POST['idusuario'];
		$punto = $_POST['punto'];
		if (!array_key_exists('identificador',$_POST)){
			echo puntuarImagen($idimagen,$idusuario,$identificador = null,$punto);
			break;
		}
		$identificador = $_POST['identificador'];
		echo puntuarImagen($idimagen,$idusuario,$identificador,$punto);
		break;
	case 'obtenerInicio':
		$idusuario = $_POST['idusuario'];
		echo obtenerInicio($idusuario);
		break;
	default:
		break;
};

function buscarTags($tags){
// Registra comentario en BBDD usando los params

	$objImagen = new datImagen();
	
	$result = $objImagen->buscarTags($tags);

	return $result;
}

function comentarImagen($idimagen,$idusuario,$identificador,$comentarioTexto){
// Registra comentario en BBDD usando los params

	$fecha = date("Y-m-d");
	$objImagen = new datImagen();
	
	$result = $objImagen->comentarImagen($idimagen,$idusuario,$identificador,$comentarioTexto,$fecha);

	return $result;
}

function comprobarPunto($idimagen,$idusuario){
// Comprueba si el usuario ha puntuado la imagen

	$objImagen = new datImagen();
	
	$result = $objImagen->comprobarPunto($idimagen,$idusuario);

	return $result;
}

function eliminarImagen($idusuario,$idimagen,$nombreimagen,$nombrealbum){
// Elimina una imagen de BBDD

	$objImagen = new datImagen();
	
	$result = $objImagen->eliminarImagen($idusuario,$idimagen,$nombreimagen,$nombrealbum);

	return $result;
}

function guardarImagenBBDD($idusuario,$idalbum,$nombrealbum,$titulo,$ruta,$descripcion,$tags){
// Registra imagen en BBDD usando los params
// TODO securizar más esto

	$fecha = date("Y-m-d");
	$objImagen = new datImagen();
	
	$result = $objImagen->guardarImagenBBDD($idusuario,$idalbum,$nombrealbum,$titulo,$ruta,$descripcion,$tags,$fecha);

	return $result;
}

function modificarImagen($idimagen,$nombre,$descripcion,$tags){
// Modifica datos de una imagen de BBDD utilizando los params
// TODO securizar más esto

	$objImagen = new datImagen();
	
	$result = $objImagen->modificarImagen($idimagen,$nombre,$descripcion,$tags);

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

function obtenerTendencias(){
// Funcion que obtiene todas las imagenes asignadas a un album
	$objImagen = new datImagen();

	$result = $objImagen->obtenerTendencias();

	return $result;
}

function puntuarImagen($idimagen, $idusuario, $identificador = null, $punto) {
	$objImagen = new datImagen();
	$result = null;

	if ($identificador == null) {
	    $result = $objImagen->puntuarImagen($idimagen, $idusuario,$identificador = null, $punto);
	} else {
	    $result = $objImagen->puntuarImagen($idimagen, $idusuario, $identificador, $punto);
	}
	return $result;
    }
    

function obtenerInicio($idusuario) {
	$objImagen = new datImagen();

	$result = $objImagen->obtenerInicio($idusuario);

	return $result;
}
?>