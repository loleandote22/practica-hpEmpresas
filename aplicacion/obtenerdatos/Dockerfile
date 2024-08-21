FROM python:3.10
RUN pip install requests
RUN pip install yfinance
RUN pip install confluent-kafka
RUN pip install DateTime
RUN pip install python-dateutil

RUN mkdir /home/obtenerdatos
COPY pruebaconsumo.py pruebaconsumo.py
COPY pruebayahoo.py pruebayahoo.py
COPY indices.txt indices.txt
COPY start.sh start.sh

CMD ["./start.sh"]