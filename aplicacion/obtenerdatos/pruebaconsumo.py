from datetime import datetime
from dateutil import parser
import json
import requests
import auxiliar
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
    i=0
    for pais in paises:
        i+=1
        # if pais != 'Croatia':
        #     continue
        response = requests.get(f"{url_apises}/{pais}")
        if response.status_code == 200:
            consumo = response.json()
            for dato in consumo:
                tiempo = parser.parse(dato['Time']).strftime('%Y-%m-%d %H:%M:%S')
                tiempoid = parser.parse(dato['Time']).strftime('%y%m')
                productoid =auxiliar.convertir_texto_a_numeros(dato["Product"][:3])
                numero = str(i).zfill(2)
                id = tiempoid+numero
                mensaje = {'schema': {'type': 'struct', 'fields': [
                    {'type': 'float', 'optional': False, 'field': 'id'},
                    {'type': 'float', 'optional': False, 'field': 'idSeccond'},
                    {'type': 'string', 'optional': False, 'field': 'Time'},
                    {'type': 'float', 'optional': False, 'field': 'Value'},
                    {'type': 'string', 'optional': False, 'field': 'ProductKey'},
                    {'type': 'string', 'optional': False, 'field': 'Product'},
                    {'type': 'string', 'optional': False, 'field': 'Country'}], 
                    'optional': False, 'name': 'energia'}, 'payload': 
                    {'id':int(id),'idSeccond':int(productoid),'Time':tiempo, 'Value': float(dato['Value']),'ProductKey': dato['Product'][:3],'Product': dato['Product'], 'Country': pais, 'Balance': dato['Balance']}}
                producer.produce(topico, json.dumps(mensaje).encode("utf-8"))
                producer.flush() 
            print("%s: %d registros enviados" % (pais, len(consumo))) 
        else:
            print("Error en la solicitud:", response.status_code)
else:
    print("Error en la solicitud antes:", response.status_code)