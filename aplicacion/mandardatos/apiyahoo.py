def obtener_cotizaciones(conexion):
	if conexion.is_connected():
		cursor = conexion.cursor(dictionary=True)
		cursor.execute("SELECT distinct indice, pais FROM cotizaciones_bolsa")
		resultados = cursor.fetchall()
		return resultados
def obtener_cotizacion(conexion,pais):
	if conexion.is_connected():
		cursor = conexion.cursor(dictionary=True)
		cursor.execute("SELECT * FROM cotizaciones_bolsa WHERE pais = %s", (pais,))
		resultados = cursor.fetchall()
		return resultados