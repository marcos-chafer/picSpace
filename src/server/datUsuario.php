<?php
class datUsuario {
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



}
