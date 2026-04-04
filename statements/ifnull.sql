SELECT jugador_id, monedas, mascotas_compradas IFNULL (monedas,"") FROM jugadores

SELECT jugador_id, monedas, mascotas_compradas IFNULL (monedas, 0) FROM jugadores

SELECT jugador_id, monedas, mascotas_compradas IFNULL (monedas,"Sin monedas") AS "Tiene?" FROM jugadores