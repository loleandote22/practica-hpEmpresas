def obtener_energia(conexion,pais,producto):
    resultados = []
    if conexion.is_connected():
        cursor = conexion.cursor(dictionary=True)
        cursor.execute("SELECT * FROM energia WHERE Country = %s AND Product = %s", (pais,producto,))
        resultados = cursor.fetchall()
    return resultados