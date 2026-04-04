SELECT *, CASE
	WHEN monedas >= 150 THEN 'Tienes saldo suficiente'
	ELSE 'Saldo insuficiente'
END AS 'Revisar saldo'
FROM jugadores;