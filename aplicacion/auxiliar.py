import requests
import json

# URL de la API REST de Kafka Connect
url = 'http://localhost:8083/connectors'

# Datos de configuración del conector
connector_config = {
	"name": "jdbc-source-connector",
	"config": {
		"connector.class": "io.confluent.connect.jdbc.JdbcSourceConnector",
		"tasks.max": "1",
		"connection.url": "jdbc:mysql://mysql:3306/aplicacionkafka",
		"connection.user": "root",
		"connection.password": "1234",
		"mode": "incrementing",
		"incrementing.column.name": "id",
		"topic.prefix": "jdbc_",
		"poll.interval.ms": "1000"
	}
}

# Hacer la solicitud POST para crear el conector
response = requests.post(url, data=json.dumps(connector_config), headers={'Content-Type': 'application/json'})

# Verificar la respuesta
if response.status_code == 201:
	print("Conector creado exitosamente.")
else:
	print(f"Error al crear el conector: {response.text}")