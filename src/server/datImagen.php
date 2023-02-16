<?php
class datImagen {
	// definimos constructor, que se ejecutará cada vez que iniciemos un objeto de la clase
	function __construct()
	{
		$this->conn = new mysqli("localhost","server","server","picspace");
		// Comprobamos conexión

		if ($this->conn->connect_errno) {
			echo "Ha fallado la conexión a la base de datos ".$this->conn->connect_error;
			exit();
		}
	}

	public function guardarImagenBBDD($idusuario,$idalbum,$nombrealbum,$titulo,$ruta,$descripcion,$fecha){

		$ruta = "/picspace/media/".$idusuario."/".$nombrealbum."/".$titulo;

		// montamos la consulta
		$inicio = "INSERT INTO imagen (`id_album`,`id_usuario`, `titulo`, `fecha`,`descripcion`,`ruta`) ";
		$values = " VALUES ('".$idalbum."','".$idusuario."','".$titulo."','".$fecha."','".$descripcion."','".$ruta."') ";
		$sql = $inicio.$values;

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

	public function obtenerImagen($idimagen){
		// motamos la consulta
		$inicio = "SELECT * FROM imagen AS i ";
		$where = " WHERE i.id = '".$idimagen."'";
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

	public function obtenerImagenes($idalbum){
		// motamos la consulta
		$inicio = "SELECT i.id, i.titulo, i.fecha, i.ruta FROM imagen AS i JOIN album AS a ON a.id = i.id_album ";
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

	public function puntuarImagen($idimagen,$idusuario){
		// motamos la consulta
		// Comprobamos si hay registro de esta imagen con este usuario
		$inicio = "SELECT * FROM imagen_punto AS ip";
		$where = " WHERE ip.idimagen = '".$idimagen."' AND ip.idusuario = '".$idusuario."'";
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
		// Si el resultado va vacío, significa que el usuario no ha puntuado esta imagen, le subimos un punto
		if (empty($jsondata)) {
			// motamos la consulta
			$inicio = "UPDATE imagen SET puntos = puntos + 1";
			$where = " WHERE id = '".$idimagen."'";
			$sql = $inicio.$where;

			// ejecutamos consulta
			$result = $this->conn->query($sql);

			// Añadimos relacion en imagen_punto

			// motamos la consulta
			$inicio = "INSERT INTO imagen_punto (idimagen, idusuario)";
			$where = " VALUES ('".$idimagen."','".$idusuario."')";
			$sql = $inicio.$where;

			// ejecutamos consulta
			$result = $this->conn->query($sql);

			// devolvemos los datos como json
			return json_encode($jsondata);	

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
