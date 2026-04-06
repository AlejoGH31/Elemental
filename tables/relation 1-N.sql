/* por ahora esto es un ejemplo de como se crea una relacion 1-N para estudiarlo despues
pero realmente no cree lo necesario para esto, porque no era necesario en el DB de mi juego
asi que no se puede ejecutar porque no funcionará */
ALTER TABLE jugadores
ADD CONSTRAINT fk_empresas
FOREIGN KEY(empresa_id) REFERENCES empresas(empresa_id);

INSERT INTO mascotas_compradas (mascota_nombre) VALUES ("King");
INSERT INTO mascotas_compradas (mascota_nombre) VALUES ("Shadow");
INSERT INTO mascotas_compradas (mascota_nombre) VALUES ("Goblin");

UPDATE jugadores SET mascota_id = 1 WHERE jugador_id = 1;
UPDATE jugadores SET mascota_id = 3 WHERE jugador_id = 2;
UPDATE jugadores SET mascota_id = 2 WHERE jugador_id = 3;