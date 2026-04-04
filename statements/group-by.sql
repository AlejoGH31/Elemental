SELECT MAX(monedas) FROM jugadores GROUP BY monedas

SELECT COUNT(monedas), monedas FROM jugadores GROUP BY monedas

SELECT COUNT(monedas), monedas FROM jugadores GROUP BY monedas ORDER BY monedas ASC

SELECT COUNT(monedas), monedas FROM jugadores GROUP BY monedas ORDER BY monedas DESC

SELECT COUNT(monedas), monedas FROM jugadores WHERE monedas > 150 GROUP BY monedas ORDER BY monedas DESC

SELECT COUNT(monedas), monedas FROM jugadores WHERE monedas > 150 GROUP BY monedas ORDER BY monedas ASC