SELECT mascotas_compradas AS 'mascotas_desbloqueadas' FROM jugadores WHERE monedas BETWEEN 0 AND 500;

SELECT mascotas_compradas AS 'mascotas_desbloqueadas' FROM jugadores

SELECT CONCAT("ID: ",jugador_id, ", Mascota: ", mascotas_compradas) AS "reconocer usuario" FROM jugadores