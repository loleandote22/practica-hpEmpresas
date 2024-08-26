def obtener_energia(conexion,pais,producto):
    resultados = []
    if conexion.is_connected():
        cursor = conexion.cursor(dictionary=True)
        query = """
                SELECT * FROM energia 
                WHERE Country = %s 
                AND lower(ProductKey) = %s
                ORDER BY Time
            """
        cursor.execute(query, (pais, f"{producto.lower()}"))        
        resultados = cursor.fetchall()
    return resultados