def convertir_texto_a_numeros(texto):
    texto = texto.upper()
    textoDevuelto = ""
    for char in texto:
        if char.isalpha():
            numero = ord(char) - ord('A') + 1
            textoDevuelto+=str(numero)
    return textoDevuelto