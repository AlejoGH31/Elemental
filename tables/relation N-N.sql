CREATE TABLE jugadores_mascotas_compradas (
	jugadores_mascotas_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    jugadores_id INT,
    mascota_id INT,
    FOREIGN KEY(jugador_id) REFERENCES jugadores(jugador_id),
    FOREIGN KEY(mascota_id) REFERENCES mascotas_compradas(mascota_id)
);

INSERT INTO jugadores_mascotas_compradas (jugador_id, mascota_id) VALUES (1, 1);
INSERT INTO jugadores_mascotas_compradas (jugador_id, mascota_id) VALUES (2, 3);
INSERT INTO jugadores_mascotas_compradas (jugador_id, mascota_id) VALUES (5, 2);