CREATE TABLE fondos (
	id INT,
    nombre_fondo varchar(100)
);

CREATE TABLE fondos2 (
	id INT NOT NULL,
    nombre_fondo varchar(100)
);

CREATE TABLE fondos3 (
	id INT NOT NULL,
    nombre_fondo varchar(100)
    UNIQUE(id)
);

CREATE TABLE fondos4 (
	id int,
    nombre_fondo varchar(100)
    PRIMARY KEY (id)
    CHECK(id > 0)
);

CREATE TABLE fondos6 (
	id INT,
    fondoID INT DEFAULT 001,
    nombre_fondo varchar(100) DEFAULT "bosque-magico",
    PRIMARY KEY (id),
    CHECK(id > 0)
);

CREATE TABLE fondos6 (
	id INT,
    fondoID INT DEFAULT 001,
    nombre_fondo varchar(100) DEFAULT "bosque-magico",
    PRIMARY KEY (id),
    CHECK(id > 0)
);