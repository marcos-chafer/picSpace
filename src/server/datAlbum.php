<?php
class datAlbum {
	// definimos constructor, que se ejecutará cada vez que iniciemos un objeto de la clase
	function __construct()
	{
		$this->conn = new mysqli("localhost","hrzn","2488","picspace");
		// Comprobamos conexión

		if ($this->conn->connect_errno) {
			echo "Ha fallado la conexión a la base de datos ".$this->conn->connect_error;
			exit();
		}
	}




	public function guardarAlbum($nombre,$idusuario,$tags,$fecha,$ruta){
		// motamos la consulta
		$inicio = "INSERT INTO album (`id_usuario`, `nombre`, `tags`, `fecha`, `ruta`) ";
		$values = " VALUES ('".$idusuario."','".$nombre."','".$tags."','".$fecha."','".$ruta."') ";
		$sql = $inicio.$values;

		// ejecutamos consulta
		$result = $this->conn->query($sql);
		// Si el resultado es true está bien
		if ($result == TRUE) {
			return json_encode(array('exito'=>true,'noti'=>'guardarAlbum'));
		}
		// si no hay ningun resultado
		else {
			return json_encode(array('exito'=>false));
		}
	}


	public function eliminarAlbum($idusuario,$idalbum,$nombrealbum){
		// motamos la consulta
		$inicio = "DELETE FROM album  ";
		$where = " WHERE id = '".$idalbum."'";
		$sql = $inicio.$where;

		// ejecutamos consulta
		$result = $this->conn->query($sql);
		// Si el resultado es true está bien
		if ($result == TRUE) {
			$ruta = "/XAMPP/htdocs/picspace/media/".$idusuario."/".$nombrealbum;
			// Cogemos todos los archivos de la ruta
			$archivos = glob($ruta . '/*');
			foreach ($archivos as $archivo) {
				if(is_file($archivo)){
					unlink($archivo);
				}
			}
			rmdir($ruta);
			return json_encode(array('exito'=>true));
		}
		// si no hay ningun resultado
		else {
			return json_encode(array('exito'=>false));
		}
	}

	public function modificarAlbum($idalbum,$nombre,$tags){
		// motamos la consulta
		$inicio = "UPDATE album  ";
		$values = " SET `nombre` = '".$nombre."', `tags` = '".$tags."' ";
		$where = " WHERE `id` = '".$idalbum."' ";
		$sql = $inicio.$values.$where;

		// ejecutamos consulta
		$result = $this->conn->query($sql);
		// Si el resultado es true está bien
		if ($result == TRUE) {
			return json_encode(array('exito'=>true));
		}
		// si no hay ningun resultado
		else {
			return json_encode(array('exito'=>false));
		}
	}

	public function obtenerAlbum($idalbum){
		// montamos la consulta
		$inicio = "SELECT * FROM album AS a ";
		$where = " WHERE a.id = '".$idalbum."'";
		$sql = $inicio.$where;

		// ejecutamos consulta
		$result = $this->conn->query($sql);
		// Preparamos array donde iran los resultados
		$jsondata = array();
		// Mientras haya resultados, montaremos una row por cada fila, y la transformaremos en un objeto
		while($row = $result->fetch_object()){
			// Añadimos el objeto row al array
			array_push($jsondata,$row);
		}
		// devolvemos los datos como json
		return json_encode($jsondata);		

	}

	
	public function obteneralbumes($identificador){
		// motamos la consulta
		$inicio = "SELECT a.id, a.id_usuario, a.nombre, a.fecha, a.tags, a.ruta FROM album AS a LEFT JOIN usuario AS u ON a.id_usuario = u.id ";
		$where = " WHERE u.identificador = '".$identificador."'";
		$sql = $inicio.$where;

		// ejecutamos consulta
		$result = $this->conn->query($sql);
		// Preparamos array donde iran los resultados
		$jsondata = array();
		// Mientras haya resultados, montaremos una row por cada fila, y la transformaremos en un objeto
		while($row = $result->fetch_object()){
			// Añadimos el objeto row al array
			array_push($jsondata,$row);
		}
		// devolvemos los datos como json
		return json_encode($jsondata);		



	}















	// public function login($identificador, $contrasenya){
	// 	// motamos la consulta
	// 	$inicio = "SELECT u.identificador, u.contrasenya FROM usuario AS u ";
	// 	$where = " WHERE identificador='".$identificador."' AND contrasenya='".$contrasenya."' ";
	// 	$sql = $inicio.$where;
	// 	// ejecutamos consulta
	// 	$result = $this->conn->query($sql);
	// 	// Si nos vienen resultados significa que coincide
	// 	if ($result->num_rows > 0) {
	// 		return json_encode(array("login"=>true));
	// 	}
	// 	// si no hay ningun resultado...
	// 	else {
	// 		return json_encode(array("login"=>false));
	// 	}
	// }

	// public function obtenerInicio($identificador) {
	// 	// motamos la consulta
	// 	$inicio = "SELECT u.identificador, u.contrasenya FROM usuario AS u ";
	// 	$where = " WHERE identificador='".$identificador;
	// 	$sql = $inicio.$where;
	// 	// ejecutamos consulta
	// 	$result = $this->conn->query($sql);
	// 	// Si nos vienen resultados significa que coincide
	// 	if ($result->num_rows > 0) {
	// 		return json_encode(array("login"=>true));
	// 	}
	// 	// si no hay ningun resultado...
	// 	else {
	// 		return json_encode(array("login"=>false));
	// 	}
	// }



}
