FROM python:3.10
COPY apiyahoo.py apiyahoo.py
COPY requirements.txt requirements.txt
COPY apienergia.py apienergia.py
COPY app.py app.py

RUN pip3 install -r requirements.txt
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
