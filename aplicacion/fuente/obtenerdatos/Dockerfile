FROM python:3.10
RUN pip install DateTime
RUN pip install pymongo

RUN mkdir /home/obtenerdatos
COPY  leercsv.py leercsv.py
COPY Archivos/ Archivos/
CMD ["python", "leercsv.py"]