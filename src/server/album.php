<?php
// Permitimos el acceso
header('Access-Control-Allow-Origin: *');
// Requerimos que estén los archivos donde esta el dat que realiza conexiones a BBDD
require_once('./datAlbum.php');
// Obtenemos que funcion queremos realizar
if (isset($_POST["funcion"])) $funcion = $_POST["funcion"];
// Si no nos viene funcion en post debe de ser una subida de archivo
else $funcion = "guardarAlbumImagenServidor";



// Comprobamos la función a realizar
switch ($funcion) {
	case 'guardarAlbumImagenServidor':
		// Si no nos viene archivo de imagen, modificamos
		if (!array_key_exists('file',$_FILES)){
			$nombrealbum = $_POST['nombrealbum'];
			$idusuario = $_POST['idUsuario'];
			$tags = $_POST['tags'];

			echo guardarAlbum($nombrealbum,$idusuario,$tags);

			// Creamos la carpeta del album si no existe
			if (!file_exists("/home/vol10_2/epizy.com/epiz_33830609/htdocs/picSpace/media/".$idusuario."/".$nombrealbum)){
				mkdir("/home/vol10_2/epizy.com/epiz_33830609/htdocs/picSpace/media/".$idusuario."/".$nombrealbum);
				chmod("/home/vol10_2/epizy.com/epiz_33830609/htdocs/picSpace/media/".$idusuario."/".$nombrealbum, 0755);
			}
			break;
		}
		// Cogemos el nombre del archivo
		$nombrearchivo = $_FILES['file']['full_path'];
		$nombreexplotado = explode(".",$nombrearchivo);
		
		$idusuario = $_POST['idUsuario'];
		$nombrealbum = $_POST['nombrealbum'];
		$tags = $_POST['tags'];
		// El nombre del archivo será nombrealbum_cover.extensionarchivo
		$titulo = $nombrealbum."_cover.".$nombreexplotado[1];

		$ruta = "/home/vol10_2/epizy.com/epiz_33830609/htdocs/picSpace/media/".$idusuario."/".$nombrealbum."/".$titulo;

		// Creamos la carpeta del album si no existe
		if (!file_exists("/home/vol10_2/epizy.com/epiz_33830609/htdocs/picSpace/media/".$idusuario."/".$nombrealbum)){
			mkdir("/home/vol10_2/epizy.com/epiz_33830609/htdocs/picSpace/media/".$idusuario."/".$nombrealbum);
			chmod("/home/vol10_2/epizy.com/epiz_33830609/htdocs/picSpace/media/".$idusuario."/".$nombrealbum, 0755);
		}

		//Guardamos el archivo en la ruta seleccionada
		if(move_uploaded_file($_FILES['file']['tmp_name'],$ruta)){
			// Si todo va bien, guardamos imagen en BBDD
			// Ponemos la ruta de la imagen
			$ruta = "http://picspace.epizy.com/picSpace/media/".$idusuario."/".$nombrealbum."/".$titulo;
			// Llamamos a guardar album para guardarlo en BBDD
			echo guardarAlbum($nombrealbum,$idusuario,$tags,$ruta);
		}
		else{

		}
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
		$tags = $_POST["tags"];
		echo modificarAlbum($idalbum,$nombre,$tags);
		break;
	case 'obtenerAlbum':
		$idalbum = $_POST["idalbum"];
		echo obtenerAlbum($idalbum);
		break;
	case 'obteneralbumes':
		$identificador = $_POST["identificador"];
		echo obteneralbumes($identificador);
		break;
	default:
		break;
};



// FUNCIONES

function guardarAlbum($nombre,$idusuario,$tags,$ruta = null){
// Registra un album en BBDD usando los params

	$fecha = date("Y-m-d");
	$objAlbum = new datAlbum();

	$result = $objAlbum->guardarAlbum($nombre,$idusuario,$tags,$fecha,$ruta);

	return $result;
}

function eliminarAlbum($idusuario,$idalbum,$nombrealbum){
// Elimina un album de BBDD

	$objAlbum = new datAlbum();
	
	$result = $objAlbum->eliminarAlbum($idusuario,$idalbum,$nombrealbum);

	return $result;
}

function modificarAlbum($idalbum,$nombre,$tags){
// Modifica datos de un album de BBDD utilizando los params

	$objAlbum = new datAlbum();
	
	$result = $objAlbum->modificarAlbum($idalbum,$nombre,$tags);

	return $result;
}

function obtenerAlbum($idalbum){

	$objAlbum = new datAlbum();

	$result = $objAlbum->obtenerAlbum($idalbum);

	return $result;
}

function obteneralbumes($identificador){
// Funcion que obtiene todos los álbums asignados a un usuario
	$objAlbum = new datAlbum();

	$result = $objAlbum->obteneralbumes($identificador);

	return $result;
}


?>