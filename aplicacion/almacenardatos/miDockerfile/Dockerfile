FROM ubuntu

# Actualizar los paquetes e instalar dependencias
RUN apt-get update && \
    apt-get install -y openjdk-11-jre-headless wget gnupg

# Descargar e instalar Kafka
RUN wget https://downloads.apache.org/kafka/3.7.1/kafka_2.12-3.7.1.tgz && \
    tar -xzf kafka_2.12-3.7.1.tgz && \
    mv kafka_2.12-3.7.1 /opt/kafka

# Descargar e instalar el conector MySQL
RUN wget https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-8.0.26.tar.gz && \
    tar -xzf mysql-connector-java-8.0.26.tar.gz && \
    mv mysql-connector-java-8.0.26/mysql-connector-java-8.0.26.jar /opt/kafka/libs/

# Descargar e instalar el conector JDBC de Confluent
RUN wget https://packages.confluent.io/maven/io/confluent/kafka-connect-jdbc/10.0.0/kafka-connect-jdbc-10.0.0.jar && \
    mv kafka-connect-jdbc-10.0.0.jar /opt/kafka/libs/

# Copiar archivos de configuración
COPY kafka-to-mysql.properties /opt/kafka/config/kafka-to-mysql.properties

# Configurar variables de entorno
ENV KAFKA_HOME=/opt/kafka
ENV PATH=$PATH:$KAFKA_HOME/bin

# Exponer los puertos necesarios
EXPOSE 9092 2181

# Comando para iniciar Kafka
CMD /bin/sh -c "$KAFKA_HOME/bin/zookeeper-server-start.sh $KAFKA_HOME/config/zookeeper.properties & \
                $KAFKA_HOME/bin/kafka-server-start.sh $KAFKA_HOME/config/server.properties & \
                sleep 5 && \
                $KAFKA_HOME/bin/connect-standalone.sh $KAFKA_HOME/config/connect-standalone.properties $KAFKA_HOME/config/kafka-to-mysql.properties"