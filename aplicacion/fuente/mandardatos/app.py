from flask import Flask, jsonify, request
from pymongo import MongoClient

app = Flask(__name__)

# Conectar a MongoDB
client = MongoClient('mongodb://mi_mongodb_cont:27017/')
db = client['datos_energia']

@app.route('/<pais>')
def hello(pais):
    collection = db[pais]
    documentos = collection.find()
    # Convertir los documentos a una lista de diccionarios
    lista_documentos = [{"Time": doc["Time"],"Balance": doc["Balance"],"Product": doc["Product"], "Value": doc["Value"]} for doc in documentos]
    # Convertir la lista de diccionarios a JSON
    return jsonify(lista_documentos)

@app.route('/')
def principal():
    collection = db['Paises']
    paises = [pais["Country"] for pais in collection.find()]
    print(paises)
    return jsonify(paises)

if __name__ == '__main__':
    app.run(debug=True)