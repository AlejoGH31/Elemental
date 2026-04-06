/* por ahora esto es un ejemplo de como se crea una relacion 1-N para estudiarlo despues
pero realmente no cree lo necesario para esto, porque no era necesario en el DB de mi juego
asi que no se puede ejecutar porque no funcionará */
CREATE TABLE mascotas_compradas (
	mascota_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    mascota_nombre VARCHAR(50) NOT NULL,
    UNIQUE(mascota_id),
    FOREIGN KEY(mascota_id) REFERENCES jugadores(jugador_id)
);

INSERT INTO mascotas_compradas (mascota_id, jugador_id) VALUES (1, 1);
INSERT INTO mascotas_compradas (mascota_id, jugador_id) VALUES (2, 2);
INSERT INTO mascotas_compradas (mascota_id, jugador_id) VALUES (3, 3);

