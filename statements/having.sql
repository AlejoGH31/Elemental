SELECT * FROM jugadores HAVING mascotas_compradas = "tralalero";

SELECT * FROM jugadores HAVING mascotas_compradas = "tung-sahur";

SELECT * FROM jugadores HAVING monedas > 100;

SELECT * FROM jugadores HAVING monedas > 150;

SELECT * FROM jugadores HAVING monedas > 500;

SELECT * FROM jugadores HAVING monedas > 450;

SELECT * FROM jugadores HAVING monedas = 500;

SELECT COUNT(monedas) FROM jugadores HAVING COUNT(monedas) > 3;