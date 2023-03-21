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
		// montamos la consulta
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

	public function eliminarCuenta($idusuario){
		// montamos la consulta
		$inicio = "DELETE a, i, ic, n, u, us, us2
		FROM usuario u
		LEFT JOIN album a ON a.id_usuario = u.id
		LEFT JOIN imagen i ON i.id_usuario = u.id
		LEFT JOIN imagen_comentario ic ON ic.idusuario = u.id
		LEFT JOIN notificacion n ON n.idnotificado = u.id
		LEFT JOIN usuario_seguidor us ON us.id_seguidor = u.id
		LEFT JOIN usuario_seguidor us2 ON us.id_seguido = u.id ";

		$where = " WHERE u.id = '$idusuario'";
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
		// montamos la consulta
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
		// montamos la consulta
		$inicio = "SELECT u.nombre, u.id, u.identificador, u.ruta FROM usuario AS u ";
		$where = " WHERE identificador='".$identificador."' AND contrasenya='".$contrasenya."' ";
		$sql = $inicio.$where;
		// ejecutamos consulta
		$result = $this->conn->query($sql);
		// Si nos vienen resultados significa que coincide
		if ($result->num_rows > 0) {
			return json_encode(array("login"=>true
			,"usuario"=>$result->fetch_object()
			));
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

	public function obtenerEstadisticas() {
		// Montamos las consultas y las ejecutamos
		$sql = "SELECT COUNT(*) FROM usuario";
		$result_usuario = $this->conn->query($sql);
		$sql = "SELECT COUNT(*) FROM album";
		$result_album = $this->conn->query($sql);
		$sql = "SELECT COUNT(*) FROM imagen";
		$result_imagen = $this->conn->query($sql);
		$sql = "SELECT COUNT(*) FROM imagen_comentario";
		$result_imagen_comentario = $this->conn->query($sql);

		$num_usuarios = mysqli_fetch_array($result_usuario)[0];
		$num_albumes = mysqli_fetch_array($result_album)[0];
		$num_imagenes = mysqli_fetch_array($result_imagen)[0];
		$num_comentarios = mysqli_fetch_array($result_imagen_comentario)[0];

		// Creamos array donde iran los resultados
		$jsondata = array('num_usuarios'=>$num_usuarios,'num_albumes'=>$num_albumes,'num_imagenes'=>$num_imagenes,'num_comentarios'=>$num_comentarios);
		
		// Devolvemos el array codificado en json
		return json_encode($jsondata);

	}

	public function obtenerEstadisticasUsuarios() {
		// Montamos la consulta
		$sql = "SELECT * FROM usuario u ";
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

	public function obtenerIdUsuario($identificador) {
		// montamos la consulta
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
		$inicio = "SELECT n.*, u.ruta, u.id as usuarioid, u.nombre FROM notificacion AS n JOIN usuario u on n.idusuario = u.id ";
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

	public function obtenerUsuario($idusuario,$idseguidor = null) {
		// montamos la consulta
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

		// Si nos viene idseguidor, debemos comprobar si el idseguidor sigue al idusuario
		if ($idseguidor != null){
			// montamos la consulta
			$inicio = "SELECT * FROM usuario_seguidor us ";
			$where = " WHERE us.id_seguido ='".$idusuario."' AND  us.id_seguidor = '".$idseguidor."'";
			$sql = $inicio.$where;
			// ejecutamos consulta
			$result = $this->conn->query($sql);
			// Si nos vienen resultados significa que coincide
			if ($result->num_rows > 0) {
				$jsondata['seSiguen'] = true;
			}
			// si no hay ningun resultado...
			else {
				$jsondata['seSiguen'] = false;
			}
		}

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
		$albumes = $objAlbum->obteneralbumes($jsondata[0]->identificador);
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

	public function seguirUsuario($idusuario,$identificador,$idseguidor) {
		// montamos la consulta
		$inicio = "INSERT INTO `usuario_seguidor`(`id_seguidor`, `id_seguido`) VALUES ";
		$where = " ('".$idseguidor."', '".$idusuario."')";
		$sql = $inicio.$where;
		// ejecutamos consulta
		$result = $this->conn->query($sql);
		// Si el resultado es true está bien
		if ($result == TRUE) {
			// Registramos notificación			
			// Montamos la consulta
			$inicio = "INSERT INTO notificacion (`idusuario`, `idnotificado`, `texto`) ";
			$values = " VALUES ('".$idseguidor."','".$idusuario."','$identificador te ha seguido') ";
			$sql = $inicio.$values;

			// ejecutamos consulta
			$result = $this->conn->query($sql);

			return json_encode(array('exito'=>true));
		}
		// si no hay ningun resultado
		else {
			return json_encode(array('exito'=>false));
		}
	}

	public function noSeguirUsuario($idusuario,$idseguidor) {
		// montamos la consulta
		$inicio = "DELETE FROM `usuario_seguidor` ";
		$where = " WHERE id_seguidor = '".$idseguidor."' AND id_seguido = '".$idusuario."' ";
		$sql = $inicio.$where;
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



}
