-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: http://picspace.epizy.com
-- Tiempo de generación: 10-03-2023 a las 10:57:24
-- Versión del servidor: 10.4.25-MariaDB
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `picspace`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `album`
--

CREATE TABLE `album` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `fecha` date NOT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `ruta` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `album`
--

INSERT INTO `album` (`id`, `id_usuario`, `nombre`, `fecha`, `tags`, `ruta`) VALUES
(49, 20, 'testalbum', '2023-02-20', NULL, '/picspace/media/20/testalbum/testimagen.jpg'),
(53, 47, 'testing', '2023-02-27', 'programacion,testing,coches', ''),
(54, 22, 'Prueba Javier', '2023-03-03', 'coches,politica', ''),
(55, 44, 'Test Marcos', '2023-03-03', 'marcos', ''),
(71, 20, 'Prueba cover album', '2023-03-10', 'prueba,cover', '/picspace/media/20/Prueba cover album/Prueba cover album_cover.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagen`
--

CREATE TABLE `imagen` (
  `id` int(11) NOT NULL,
  `id_album` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `titulo` varchar(50) NOT NULL,
  `fecha` date NOT NULL,
  `puntos` int(11) NOT NULL DEFAULT 0,
  `descripcion` varchar(100) DEFAULT NULL,
  `ruta` varchar(255) NOT NULL,
  `tags` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `imagen`
--

INSERT INTO `imagen` (`id`, `id_album`, `id_usuario`, `titulo`, `fecha`, `puntos`, `descripcion`, `ruta`, `tags`) VALUES
(97, 49, 20, 'testimagen', '2023-02-20', 1, 'testdescripcion', '/picspace/media/20/testalbum/testimagen.jpg', ''),
(98, 49, 20, 'Gato', '2023-02-20', 0, 'Gato negro', '/picspace/media/20/testalbum/Gato.jpg', ''),
(100, 53, 47, 'ffds', '2023-02-27', 0, 'sdfdsf', '/picspace/media/47/testing/ffds.jpg', 'gato,halloween,festival,negro'),
(101, 54, 22, 'gato blanco', '2023-03-03', 1, 'es un gato blanco', '/picspace/media/22/Prueba Javier/gato blanco.jpeg', 'gato, cute'),
(102, 55, 44, 'Chico anime', '2023-03-03', 0, 'Chico de anime', '/picspace/media/44/Test Marcos/Chico anime.jpg', 'dibujo, anime, chico'),
(103, 54, 22, 'gato negro', '2023-03-03', 0, 'Es un gato negro', '/picspace/media/22/Prueba Javier/gato negro.jpeg', 'cat, gato, negro'),
(104, 55, 44, 'Bosque mágico', '2023-03-03', 0, 'Un bosque muy chulo', '/picspace/media/44/Test Marcos/Bosque mágico.jpg', 'bosque'),
(105, 55, 44, 'Fondo de pantalla', '2023-03-03', 0, 'Un fondo que uso en varios ordenadores', '/picspace/media/44/Test Marcos/Fondo de pantalla.png', ''),
(106, 55, 44, 'Naturaleza', '2023-03-03', 0, 'Montaña y valle en estado puro', '/picspace/media/44/Test Marcos/Naturaleza.jpg', 'nature, naturaleza');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagen_comentario`
--

CREATE TABLE `imagen_comentario` (
  `id` int(11) NOT NULL,
  `idimagen` int(250) NOT NULL,
  `idusuario` int(250) NOT NULL,
  `texto` varchar(250) NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `imagen_comentario`
--

INSERT INTO `imagen_comentario` (`id`, `idimagen`, `idusuario`, `texto`, `fecha`) VALUES
(1, 84, 20, 'Esta imagen me gusta mucho!', '2023-01-09'),
(2, 84, 44, 'Esta imagen es excelente', '2023-02-01'),
(3, 84, 20, 'sadasd', '2023-01-18'),
(4, 84, 20, 'Hurra! Funciona a la primera!!', '2023-02-04'),
(5, 84, 20, 'Hey', '2023-02-16'),
(6, 84, 20, 'Hola!', '2023-02-16'),
(7, 84, 20, 'Esto es una prueba', '2023-02-16'),
(8, 84, 20, 'Gema mola', '2023-02-16'),
(9, 96, 20, 'hola', '2023-02-20'),
(10, 97, 20, 'Hola', '2023-02-20'),
(11, 97, 20, 'Esto es una prueba de un comentario con bastantes carácteres', '2023-02-26'),
(12, 97, 20, '¡Que buena imagen!', '2023-02-27'),
(13, 101, 20, 'Que imagen más bonita!', '2023-03-03'),
(14, 98, 20, 'hola', '2023-03-03'),
(15, 101, 20, 'hola', '2023-03-03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagen_punto`
--

CREATE TABLE `imagen_punto` (
  `idimagen` int(250) NOT NULL,
  `idusuario` int(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `imagen_punto`
--

INSERT INTO `imagen_punto` (`idimagen`, `idusuario`) VALUES
(101, 20),
(97, 20);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificacion`
--

CREATE TABLE `notificacion` (
  `id` int(11) NOT NULL,
  `idusuario` int(11) NOT NULL,
  `idnotificado` int(11) NOT NULL COMMENT 'Se refiere a la ID del usuario al que le llega la notificación',
  `imagen` int(11) NOT NULL,
  `texto` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `identificador` varchar(20) NOT NULL,
  `contrasenya` varchar(50) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `email` varchar(250) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `ruta` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `identificador`, `contrasenya`, `nombre`, `email`, `descripcion`, `tags`, `ruta`) VALUES
(19, 'admin', 'admin', 'Admin', 'admin@gmail.com', NULL, NULL, NULL),
(20, 'picSpace', 'picSpace', 'picSpace', 'picSpace@picSpace.com', NULL, NULL, NULL),
(22, 'Javier', 'javier', 'Javier', 'javier@gmail.com', NULL, NULL, NULL),
(43, 'jav', 'jav', 'Jav', 'jav@jav.es', NULL, NULL, NULL),
(44, 'marcos', '1234', 'Marcos', '1234@123.com', NULL, NULL, NULL),
(45, 'you', 'you', 'you', 'yoasd@asmd.com', NULL, NULL, NULL),
(47, 'alecatillo', 'alecatillo', 'Alex Castillo', 'alecatillo@bmail.com', NULL, 'coches,futbol,politica,economia,guerra,policia', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_seguidor`
--

CREATE TABLE `usuario_seguidor` (
  `id_seguidor` int(11) NOT NULL,
  `id_seguido` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuario_seguidor`
--

INSERT INTO `usuario_seguidor` (`id_seguidor`, `id_seguido`) VALUES
(20, 22),
(20, 44);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `album`
--
ALTER TABLE `album`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `imagen`
--
ALTER TABLE `imagen`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `imagen_comentario`
--
ALTER TABLE `imagen_comentario`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `identificador` (`identificador`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `album`
--
ALTER TABLE `album`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT de la tabla `imagen`
--
ALTER TABLE `imagen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

--
-- AUTO_INCREMENT de la tabla `imagen_comentario`
--
ALTER TABLE `imagen_comentario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
