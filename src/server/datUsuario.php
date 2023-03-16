<?php
// Requerimos que estén los archivos donde esta el dat que realiza conexiones a BBDD
require_once('./datAlbum.php');
class datUsuario {
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


	
	public function buscarIdentificador($identificador){
		// motamos la consulta
		$inicio = "SELECT u.identificador FROM usuario AS u ";
		$where = " WHERE identificador = '".$identificador."'";
		$sql = $inicio.$where;

		// ejecutamos consulta
		$result = $this->conn->query($sql);
		// Si nos vienen resultados significa que existe
		if ($result->num_rows > 0) {
			return json_encode(array('identificadorExiste'=>true));
		}
		// si no hay ningun resultado
		else {
			return json_encode(array('identificadorExiste'=>false));
		}
	}

	public function eliminarNotificacion($idusuario,$idnotificacion){
		// montamos la consulta
		$inicio = "DELETE FROM notificacion";
		$where = " WHERE idnotificado = '".$idusuario."' AND id = '".$idnotificacion."'";
		$sql = $inicio.$where;

		// ejecutamos consulta
		$result = $this->conn->query($sql);
		// Si nos vienen resultados significa que todo ha ido bien
		if ($result == 1) {
			return json_encode(array('exito'=>true));
		}
		// si no hay ningun resultado
		else {
			return json_encode(array('exito'=>false));
		}
	}

	public function guardarUsuario($nombre,$identificador,$contrasenya,$email,$tags){
		// motamos la consulta
		$inicio = "INSERT INTO usuario (`identificador`, `contrasenya`, `nombre`, `email`, `tags`) ";
		$values = " VALUES ('".$identificador."','".$contrasenya."','".$nombre."','".$email."','".$tags."') ";
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

	public function login($identificador, $contrasenya){
		// motamos la consulta
		$inicio = "SELECT u.identificador, u.contrasenya FROM usuario AS u ";
		$where = " WHERE identificador='".$identificador."' AND contrasenya='".$contrasenya."' ";
		$sql = $inicio.$where;
		// ejecutamos consulta
		$result = $this->conn->query($sql);
		// Si nos vienen resultados significa que coincide
		if ($result->num_rows > 0) {
			return json_encode(array("login"=>true));
		}
		// si no hay ningun resultado...
		else {
			return json_encode(array("login"=>false));
		}
	}

	public function modificarUsuario($idusuario,$nombre,$contrasenya,$descripcion,$tags,$ruta = null){
		// montamos la consulta
		$inicio = "UPDATE `usuario` SET `nombre` = '".$nombre."', `contrasenya` = '".$contrasenya."', `descripcion` = '".$descripcion."',`tags` = '".$tags."' ";
		$where = " WHERE id = ".$idusuario;
		$sql = $inicio.$where;
		if ($ruta != null){
			$inicio .= ", `ruta` = '".$ruta."' ";
			$sql = $inicio.$where;
		}
		// ejecutamos consulta
		$result = $this->conn->query($sql);
		// Si nos vienen resultados significa que coincide
		if ($result->num_rows > 0) {
			return (json_encode(array("exito"=>true)));
		}
		// si no hay ningun resultado...
		else {
			return (json_encode(array("exito"=>false)));
		}
	}

	public function obtenerIdUsuario($identificador) {
		// motamos la consulta
		$inicio = "SELECT u.id FROM usuario AS u ";
		$where = " WHERE u.identificador='".$identificador."'";
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
		// Devolvemos el array codificado en json
		return json_encode($jsondata);

	}

	public function obtenerNotificaciones($idusuario) {
		// montamos la consulta
		$inicio = "SELECT * FROM notificacion AS n ";
		$where = " WHERE n.idnotificado= '".$idusuario."'";
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
		// Devolvemos el array codificado en json
		return json_encode($jsondata);
	}

	public function obtenerSeguidores($idusuario) {
		// montamos la consulta
		$inicio = "SELECT * FROM usuario_seguidor us JOIN usuario as u ON u.id = us.id_seguidor";
		$where = " WHERE us.id_seguido = '".$idusuario."'";
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
		// Devolvemos el array codificado en json
		return json_encode($jsondata);
	}

	public function obtenerSeguidos($idusuario) {
		// montamos la consulta
		$inicio = "SELECT * FROM usuario_seguidor us JOIN usuario as u ON u.id = us.id_seguido";
		$where = " WHERE us.id_seguidor = '".$idusuario."'";
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
		// Devolvemos el array codificado en json
		return json_encode($jsondata);
	}

	public function obtenerUsuario($idusuario) {
		// motamos la consulta
		$inicio = "SELECT * FROM usuario AS u ";
		$where = " WHERE u.id ='".$idusuario."'";
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
		// Eliminamos contrasenya del array jsondata
		unset($jsondata[0]->contrasenya);

		// Obtenemos número de seguidos y seguidores

		//Seguidores
		// montamos la consulta
		$inicio = "SELECT COUNT(*) AS num_seguidores FROM usuario_seguidor ";
		$where = " WHERE id_seguido ='".$idusuario."'";
		$sql = $inicio.$where;
		// ejecutamos consulta
		$result = $this->conn->query($sql);
		// Sacamos la fila en un array asociativo, y luego seleccionamos el elemento num_seguidores y lo guardamos
		$row = mysqli_fetch_assoc($result);
		$num_seguidores = $row['num_seguidores'];
		$jsondata['seguidores'] = $num_seguidores;

		//Seguidos
		// montamos la consulta
		$inicio = "SELECT COUNT(*) AS num_seguidos FROM usuario_seguidor ";
		$where = " WHERE id_seguidor ='".$idusuario."'";
		$sql = $inicio.$where;
		// ejecutamos consulta
		$result = $this->conn->query($sql);
		// Sacamos la fila en un array asociativo, y luego seleccionamos el elemento num_seguidos y lo guardamos
		$row = mysqli_fetch_assoc($result);
		$num_seguidos = $row['num_seguidos'];
		$jsondata['seguidos'] = $num_seguidos;

		//Necesitamos saber datos sobre los albumes, así que preguntamos a album.php
		$objAlbum = new datAlbum();
		// Buscamos por el identificador
		$albumes = $objAlbum->obtenerAlbums($jsondata[0]->identificador);
		// Añadimos los albumes a los datos
		$jsondata['albumes'] = $albumes;

		// Devolvemos el array codificado en json
		return json_encode($jsondata);
	}

	public function obtenerUsuarioContrasenya($idusuario) {
		// montamos la consulta
		$inicio = "SELECT u.contrasenya FROM usuario u";
		$where = " WHERE u.id= '".$idusuario."'";
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
		// Devolvemos el array codificado en json
		return json_encode($jsondata);
	}



}
