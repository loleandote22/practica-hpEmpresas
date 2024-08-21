import csv
import os
from pymongo import MongoClient
import json
from datetime import datetime, timedelta

# Obtener la ruta absoluta del archivo CSV
absolutepath = os.path.abspath(__file__)
fileDirectory = os.path.dirname(absolutepath)
csv_file_path = os.path.join(fileDirectory, 'Archivos/Electricidad24.csv')
#config_file_path = os.path.join(fileDirectory, 'Configuracion\configuracion.json')

#with open(config_file_path, mode='r', encoding='utf-8') as configfile:
#    config_data = json.load(configfile)
#print(config_data)
client = MongoClient('mongodb://mi_mongodb_cont:27017/')
db = client['datos_energia']
collection = db['Paises']
meses = ["january","february","march","april","may","june","july","august","september","october","november","december"]

def insertarPaises():
    with open(csv_file_path, mode='r', newline='', encoding='utf-8') as csvfile:
        # Crear un lector de CSV
        csvreader = csv.reader(csvfile)
        for _ in range(8):
            next(csvreader)
        headers = next(csvreader)
        indice_columna = headers.index("Country")
        valores_columna = [row[indice_columna] for row in csvreader]
        valores_unicos = set(valores_columna)
        collection.insert_many([{"Country": pais} for pais in valores_unicos])
        print(valores_unicos)
    return valores_unicos

def insertarDatos(paises):
    with open(csv_file_path, mode='r', newline='', encoding='utf-8') as csvfile:
        # Crear un lector de CSV
        csvreader = csv.reader(csvfile)
        # Saltar las primeras 8 líneas
        for _ in range(8):
            next(csvreader)
        # Leer la línea 9 para obtener las cabeceras
        headers = next(csvreader)
        # Leer el resto del archivo utilizando las cabeceras
        data = [dict(zip(headers, row)) for row in csvreader]
        # Insertar los datos en MongoDB
        if data:
            for pais in paises:
                datos_pais = [dato for dato in data if dato["Country"] == pais and not dato["Product"].startswith("Total") and (dato["Balance"].startswith("Final Consumption") or dato["Balance"].startswith("Net Electricity Production"))]
                datos_insercion = []
                for dato in datos_pais:
                    if "Time" in dato:
                        try:
                            año = int(dato["Time"].split()[1])
                            mes = meses.index(dato["Time"].split()[0].lower())+2
                            dia = 1
                            if mes == 13:
                                fecha = datetime(año+1, 1, dia)
                            else:
                                fecha = datetime(año, mes, dia)
                            fecha = fecha - timedelta(days=1)
                            dato_insercion= dato.copy()
                            dato_insercion["Time"] = fecha
                            if dato_insercion["Value"] == "":
                                continue
                            else:
                                dato_insercion["Value"] = float(dato_insercion["Value"])
                            dato_insercion.pop("Country")
                            datos_insercion.append(dato_insercion)
                        except ValueError:
                            print(f"Error al formatear la fecha: {dato['Time']}")
                            print(dato)
                    else:
                        print("La columna 'Time' no existe en los datos.")
                if datos_insercion != []:
                    db[pais].insert_many(datos_insercion)
                    print(f"Datos insertados para {pais}.")
                elif db[pais].count_documents({}) == 0:
                    db["Paises"].delete_one({"Country": pais})
                    print(f"No hay datos para {pais}.")
db["Paises"].drop()
paises = insertarPaises()
print("Paises insertados en MongoDB con éxito.")
for pais in paises:
    db[pais].drop()
insertarDatos(paises)
print("Datos insertados en MongoDB con éxito.")