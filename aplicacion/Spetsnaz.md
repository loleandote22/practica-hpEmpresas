Ir a donde están los comandos
``` bash
cd opt/kafka/bin
```
Ver topics
``` bash
kafka-topics.sh --list --bootstrap-server almacenardatos-kafka-1:9092
```

Consumir un topic
``` bash
kafka-console-consumer.sh  --topic cotizaciones_bolsa --bootstrap-server almacenardatos-kafka-1:9092
```