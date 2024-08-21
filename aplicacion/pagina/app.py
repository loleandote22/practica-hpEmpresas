from flask import Flask, render_template   
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')
@app.route('/inicio')
def inicio():
    return render_template('index.html')
@app.route('/coal')
def coal():
    return render_template('carbon/coal.html')
@app.route('/<producto>/<pais>')
def carbon_indice(producto,pais):
    return render_template(f'carbon/carbonGrafico.html')
@app.route('/eolica')
def eolica():
    return render_template('eolica.html')
@app.route('/gasNatural')
def gasNatural():
    return render_template('gasNatural.html')
@app.route('/hidraulica')
def hidraulica():
    return render_template('hidraulica.html')
@app.route('/nuclear')
def nuclear():
    return render_template('nuclear.html')
@app.route('/petroleo')
def petroleo():
    return render_template('petroleo.html')
@app.route('/solar')
def solar():
    return render_template('solar.html')
app.run(debug=True)
