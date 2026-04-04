CREATE TABLE mascotas_compradas (
	mascota_id INT AUTO_INCREMENT PRIMARY KEY,
    mascota_nombre VARCHAR(50),
    UNIQUE (mascota_id),
    FOREIGN KEY (mascota_id) REFERENCES jugadores(jugador_id)
);