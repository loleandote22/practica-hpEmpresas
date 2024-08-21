CREATE DATABASE IF NOT EXISTS aplicacionkafka;
USE aplicacionkafka;
CREATE TABLE IF NOT EXISTS paises (
    nombre VARCHAR(50) PRIMARY KEY,
    capital VARCHAR(50)
);
CREATE TEMPORARY TABLE temp_paises (
    nombre VARCHAR(50),
    capital VARCHAR(50),
    indice VARCHAR(50)
);

-- Cargar los datos del archivo en la tabla temporal
LOAD DATA INFILE '/var/lib/mysql-files/paises.txt'
INTO TABLE temp_paises
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
(nombre, capital, indice);

-- Insertar los datos de la tabla temporal en la tabla paises
INSERT INTO paises (nombre, capital)
SELECT nombre, capital FROM temp_paises;

-- Eliminar la tabla temporal
DROP TEMPORARY TABLE temp_paises;
