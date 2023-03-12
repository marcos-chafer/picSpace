<?php
class datImagen {
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

	public function comentarImagen($idimagen,$idusuario,$comentarioTexto,$fecha){
		// montamos la consulta
		$inicio = "INSERT INTO imagen_comentario (`idimagen`, `idusuario`, `texto`, `fecha`) ";
		$values = " VALUES ('".$idimagen."','".$idusuario."','".$comentarioTexto."','".$fecha."') ";
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

	public function comprobarPunto($idimagen,$idusuario){
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
		// Si el resultado va vacío, significa que el usuario no ha puntuado esta imagen
		if (empty($jsondata)) {
			return json_encode(array('punto'=>false));	

		}
		else {
			return json_encode(array('punto'=>true));	
		}
	}

	public function eliminarImagen($idusuario,$idimagen,$nombreimagen,$nombrealbum){
		// montamos la consulta
		$inicio = "DELETE FROM imagen  ";
		$where = " WHERE id = '".$idimagen."'";
		$sql = $inicio.$where;

		// ejecutamos consulta
		$result = $this->conn->query($sql);
		// Si el resultado es true está bien
		if ($result == TRUE) {
			$ruta = "/XAMPP/htdocs/picspace/media/".$idusuario."/".$nombrealbum;
			// Cogemos todos los archivos de la ruta
			$archivos = glob($ruta . '/*');
			$arrayprueba = array ();
			foreach ($archivos as $archivo) {
				if (explode(".",basename($archivo))[0] == $nombreimagen){
					unlink($archivo);
				}
			}
			return json_encode(array('exito'=>true));
		}
		// si no hay ningun resultado
		else {
			return json_encode(array('exito'=>false));
		}
	}

	public function guardarImagenBBDD($idusuario,$idalbum,$nombrealbum,$titulo,$ruta,$descripcion,$tags,$fecha){

		$ruta = "/picspace/media/".$idusuario."/".$nombrealbum."/".$titulo;

		// No queremos guardar la extensión de la imagen, así que la descartamos
		$titulo = explode(".",$titulo);

		// montamos la consulta
		$inicio = "INSERT INTO imagen (`id_album`,`id_usuario`, `titulo`, `fecha`,`descripcion`,`ruta`, `tags`) ";
		$values = " VALUES ('".$idalbum."','".$idusuario."','".$titulo[0]."','".$fecha."','".$descripcion."','".$ruta."','".$tags."') ";
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

	public function modificarImagen($idimagen,$nombre,$descripcion,$tags){
		// montamos la consulta
		$inicio = "UPDATE imagen  ";
		$values = " SET `titulo` = '".$nombre."', descripcion = '".$descripcion."', tags = '".$tags."' ";
		$where = " WHERE `id` = '".$idimagen."' ";
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

	public function obtenerComentarios($idimagen){
		// motamos la consulta
		$inicio = "SELECT ic.id,ic.idimagen,ic.idusuario,ic.texto,ic.fecha,u.nombre FROM imagen_comentario AS ic LEFT JOIN usuario as u ON ic.idusuario=u.id";
		$where = " WHERE ic.idimagen = '".$idimagen."' ORDER BY ic.fecha ASC";
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

	public function puntuarImagen($idimagen,$idusuario,$punto){


		if ($punto=='quitar'){
			// Quitamos el registro de imagen y le bajamos un punto a la imagen
			// Montamos consulta
			$inicio = "DELETE FROM imagen_punto";
			$where = " WHERE idimagen = '".$idimagen."' AND idusuario = '".$idusuario."'";
			$sql = $inicio.$where;

			// ejecutamos consulta
			$result = $this->conn->query($sql);

			// Bajamos el punto a la imagen
			// montamos la consulta
			$inicio = "UPDATE imagen SET puntos = puntos - 1";
			$where = " WHERE id = '".$idimagen."'";
			$sql = $inicio.$where;

			// ejecutamos consulta
			$result = $this->conn->query($sql);
			return json_encode(array("exito"=>true));

		}

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

	public function obtenerInicio($idusuario) {
		// montamos la consulta
		$inicio = "SELECT u2.id as idusuario, u2.identificador, u2.nombre AS nombreusuario, u2.tags as tagsusuario, i.id as idimagen, i.id_album, i.titulo, i.fecha, i.puntos, i.tags AS tagsimagen, i.descripcion, i.ruta, a.nombre as nombrealbum";
		$where = " 
		FROM usuario u1
		INNER JOIN usuario_seguidor us ON u1.id = us.id_seguidor
		INNER JOIN usuario u2 ON us.id_seguido = u2.id
		INNER JOIN imagen i ON u2.id = i.id_usuario
		INNER JOIN album a on i.id_album = a.id
		WHERE u1.id = $idusuario
		ORDER BY i.fecha;
		 ";
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

}
