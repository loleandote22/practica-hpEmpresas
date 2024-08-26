import yfinance as yf
from datetime import datetime
from dateutil.relativedelta import relativedelta
from confluent_kafka import Producer
import auxiliar
import json

# Configuración inicial de Kafka
config_kafka = {
    'bootstrap.servers': 'almacenardatos-kafka-1:9092'
}
producer = Producer(**config_kafka)
topic = 'cotizaciones_bolsa'

def enviar_a_kafka(mensaje):
    producer.produce(topic, json.dumps(mensaje).encode('utf-8'))
    producer.flush()

def leerIndices():
    lista = []
    with open('indices.txt', 'r') as file:
        indices = file.readlines()
        indices = [index.strip() for index in indices]
        for linea in indices:
            if linea.__contains__(','):
                try:
                    diccionario = {'simbolo': linea.split(',')[0],'pais': linea.split(',')[1], 'indice': linea.split(',')[2]}
                    lista.append(diccionario)
                except:
                    print('Error en la línea: ' + linea)
    return lista

def obtenerDatos(indice, desde, hasta,idSeccond):
    datos = yf.download(indice["simbolo"], start=desde.strftime('%Y-%m-%d'), end=hasta.strftime('%Y-%m-%d'),interval='1mo')
    for fecha, fila in datos.iterrows():
        fechaguarda = fecha
        idFecha = (fechaguarda).strftime('%y%m')
        id = idFecha
        mensaje = {'schema': {'type': 'struct', 'fields': [
            {'type': 'float', 'optional': 'false', 'field': 'id'},
            {'type': 'float', 'optional': 'false', 'field': 'idSeccond'},
            {'type': 'string', 'optional': 'false', 'field': 'simbolo'},
            {'type': 'string', 'optional': 'false', 'field': 'indice'},
            {'type': 'string', 'optional': False, 'field': 'fecha'}, 
            {'type': 'float', 'optional': False, 'field': 'cierre'}], 
            'optional': False, 'name': 'cotizacion'}, 'payload': 
            {'id':int(id),'idSeccond':idSeccond,'simbolo': indice["simbolo"],'indice' : indice["indice"] , 'fecha': fechaguarda.strftime('%Y-%m-%d %H:%M:%S'), 'cierre': float(fila['Close'])}}
        enviar_a_kafka(mensaje)

hasta = datetime.now()-relativedelta(months=1)
desde =  datetime(2010, 1, 1)
indices = leerIndices()
idSeccond = 0
for indice in indices:
    obtenerDatos(indice, desde, hasta,idSeccond)
    idSeccond += 1