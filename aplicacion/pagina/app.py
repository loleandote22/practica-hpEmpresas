from flask import Flask, render_template   
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')
@app.route('/inicio')
def inicio():
    return render_template('index.html')
@app.route('/<producto>/<pais>')
def carbon_indice(producto,pais):
    return render_template(f'grafico.html')
@app.route('/coal')
def coal():
    return render_template('producto.html')
@app.route('/wind')
def wind():
    return render_template('producto.html')
@app.route('/natural')
def natural():
    return render_template('producto.html')
@app.route('/hydro')
def hydro():
    return render_template('producto.html')
@app.route('/nuclear')
def nuclear():
    return render_template('producto.html')
@app.route('/oil')
def oil():
    return render_template('producto.html')
@app.route('/solar')
def solar():
    return render_template('producto.html')
app.run(debug=True)
