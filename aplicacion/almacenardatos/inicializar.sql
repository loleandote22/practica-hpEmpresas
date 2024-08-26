CREATE DATABASE IF NOT EXISTS aplicacionkafka;
USE aplicacionkafka;
CREATE TABLE IF NOT EXISTS indices (
    codigo VARCHAR(50),
    pais VARCHAR(255) PRIMARY KEY,
    indice VARCHAR(255)
);
CREATE TEMPORARY TABLE temp_indices (
    codigo VARCHAR(50),
    pais VARCHAR(255) PRIMARY KEY,
    indice VARCHAR(255)
);

-- Cargar los datos del archivo en la tabla temporal
LOAD DATA INFILE '/var/lib/mysql-files/indices.txt'
INTO TABLE temp_indices
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
(codigo, pais, indice);

-- Insertar los datos de la tabla temporal en la tabla indices
INSERT INTO indices (codigo, pais, indice)
SELECT codigo, pais, indice FROM temp_indices;

-- Eliminar la tabla temporal
DROP TEMPORARY TABLE temp_indices;
