/* Basicamente el inner join solo devuelve los datos que son comunes en ambas tablas
no traerá datos que no se relacion entre si
ejm: No trae un id de jugador que no tenga id de mascota
tampoco trae id de mascota que no tenga id de jugador */
SELECT * FROM jugadores
INNER JOIN mascotas_compradas
ON jugadores.jugador_id = mascotas_compradas.mascota_id;

SELECT * FROM jugadores
JOIN mascotas_compradas
ON jugadores.jugador_id = mascotas_compradas.mascota_id;