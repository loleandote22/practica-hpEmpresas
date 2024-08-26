#!/bin/sh

# Ejecutar pruebaconsumo.py y pruebayahoo.py de forma concurrente
  python pruebaconsumo.py &
  python pruebayahoo.py 
  wait