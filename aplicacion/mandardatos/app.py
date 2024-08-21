from flask import Flask, jsonify, request
import mysql.connector
from mysql.connector import Error
import apiyahoo
import apienergia
app = Flask(__name__)
def conectar():
	conexion = None
	try:
		conexion = mysql.connector.connect(
			host='mi-mysql',
			user='root',
			password='1234',
			database='aplicacionkafka'
		)
	except Error as e:
		print("Error al conectar a MySQL", e)
	return conexion
@app.route('/')
def inicio():
	return "API para obtener datos de cotizaciones de bolsa y de energía funcionando"
@app.route('/cotizaciones')
def cotizaciones():
	conexion = conectar()
	datos = apiyahoo.obtener_cotizaciones(conexion)
	response = jsonify(datos)
	response.headers.add("Access-Control-Allow-Origin", "*")
	return response
@app.route('/cotizacion/<pais>')
def cotizacion(pais):
	conexion = conectar()
	datos = apiyahoo.obtener_cotizacion(conexion,pais)
	response = jsonify(datos)
	response.headers.add("Access-Control-Allow-Origin", "*")
	return response
@app.route('/energia/<pais>/<producto>')
def energia(pais,producto):
	conexion = conectar()
	datos = apienergia.obtener_energia(conexion,pais,producto)
	response = jsonify(datos)
	response.headers.add("Access-Control-Allow-Origin", "*")
	return response
if __name__ == '__main__':
	app.run(debug=True)