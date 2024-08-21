from datetime import datetime
from dateutil import parser
import json
import requests
from confluent_kafka import Producer

# Configuración inicial de Kafka
config_kafka = {
    "bootstrap.servers": "almacenardatos-kafka-1:9092"
}
producer = Producer(**config_kafka)
topico = "energia"
url_apises = "http://apises:5000"
response = requests.get(url_apises)
if response.status_code == 200:
    paises = response.json()
    print("Datos recibidos:", paises)
    for pais in paises:
        response = requests.get(f"{url_apises}/{pais}")
        if response.status_code == 200:
            consumo = response.json()
            for dato in consumo:
                mensaje = {'schema': {'type': 'struct', 'fields': [
                    {'type': 'string', 'optional': False, 'field': 'Time'},
                    {'type': 'float', 'optional': False, 'field': 'Value'},
                    {'type': 'string', 'optional': False, 'field': 'Product'},
                    {'type': 'string', 'optional': False, 'field': 'Country'},
                    {'type': 'string', 'optional': False, 'field': 'Balance'}], 
                    'optional': False, 'name': 'energia'}, 'payload': 
                    {'Time':parser.parse(dato['Time']).strftime('%Y-%m-%d %H:%M:%S'), 'Value': float(dato['Value']),'Product': dato['Product'], 'Country': pais, 'Balance': dato['Balance']}}
                producer.produce(topico, json.dumps(mensaje).encode("utf-8"))
                producer.flush() 
            print("%s: %d registros enviados" % (pais, len(consumo))) 
        else:
            print("Error en la solicitud:", response.status_code)
else:
    print("Error en la solicitud antes:", response.status_code)