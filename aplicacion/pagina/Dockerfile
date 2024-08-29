FROM python:3.10

# Copiar la carpeta 'static' al contenedor
COPY static /app/static
COPY templates /app/templates
COPY requirements.txt /app/requirements.txt
COPY app.py /app/app.py
WORKDIR /app
RUN pip3 install -r requirements.txt
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
