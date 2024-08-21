import yfinance as yf
from datetime import datetime
from dateutil.relativedelta import relativedelta
from confluent_kafka import Producer
import json

def obtenerDatos(indice, desde, hasta):
    datos = yf.download(indice, start=desde.strftime('%Y-%m-%d'), end=hasta.strftime('%Y-%m-%d'),interval='1mo')
    for fecha, fila in datos.iterrows():
        fechaguarda = fecha +relativedelta(months=1) - relativedelta(days=1)
        mensaje = {'schema': {'type': 'struct', 'fields': [
            {'type': 'string', 'optional': 'false', 'field': 'indice'},
            {'type': 'string', 'optional': False, 'field': 'fecha'}, 
            {'type': 'float', 'optional': False, 'field': 'cierre'}], 
            'optional': False, 'name': 'cotizacion'}, 'payload': 
            {'indice': indice, 'fecha': fechaguarda.strftime('%Y-%m-%d %H:%M:%S'), 'cierre': float(fila['Close'])}}
        print(mensaje)
def leerIndices():
    lista = []
    with open('indices.txt', 'r') as file:
        indices = file.readlines()
        indices = [index.strip() for index in indices]
        for linea in indices:
            if linea.__contains__(','):
                diccionario = {'simbolo': linea.split(',')[0],'pais': linea.split(',')[1], 'indice': linea.split(',')[2]}
                
                lista.append(diccionario)
    return lista

hasta = datetime.now()-relativedelta(months=1)
desde =  datetime(2010, 1, 1)
indices = leerIndices()
for indice in indices:
    obtenerDatos(indice, desde, hasta)

