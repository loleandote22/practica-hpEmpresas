def obtener_cotizaciones(conexion):
	if conexion.is_connected():
		cursor = conexion.cursor(dictionary=True)
		cursor.execute("SELECT pais, indice FROM indices")
		resultados = cursor.fetchall()
		return resultados
def obtener_cotizacion(conexion,pais):
	if conexion.is_connected():
		cursor = conexion.cursor(dictionary=True)
		query="""SELECT c.indice, fecha, cierre FROM cotizaciones_bolsa as c 
						join indices as i on c.simbolo = i.codigo 
				 		where i.pais =%s order by fecha"""
		cursor.execute(query, (pais,))
		resultados = cursor.fetchall()
		return resultados