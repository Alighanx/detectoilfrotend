# ============================================================
# app.py — Backend principal DetectOil IA
# Framework: Flask
# ============================================================

import os
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import tensorflow as tf
import numpy as np
import json
import re
from pathlib import Path

# Creamos la aplicación Flask
app = Flask(__name__)

# Habilitamos CORS para conectar React con Flask
# Permitir orígenes específicos (vuelve a configurar con tus dominios reales)
ALLOWED_ORIGINS = [
    "https://detectoilfrotend.onrender.com",
    re.compile(r"^https://.*\.vercel\.app$"),
]

# Para pruebas rápidas puedes usar '*' pero en producción restringe a tus dominios.
CORS(app, resources={r"/api/*": {"origins": ALLOWED_ORIGINS}}, supports_credentials=True)

# ============================================================
# CREDENCIALES DE PRUEBA
# ============================================================

USUARIO_VALIDO = "admin"
CLAVE_VALIDA = "1234"

# ============================================================
# CARGA DEL MODELO ENTRENADO (Lazy Loading)
# ============================================================

MODEL_PATH = Path("models/detectoil_model.keras")
CLASSES_PATH = Path("models/class_names.json")

model = None
class_names = None

def load_model_if_needed():
    """Carga el modelo solo cuando se necesita (lazy loading)"""
    global model, class_names
    if model is None:
        print("Cargando modelo...")
        model = tf.keras.models.load_model(MODEL_PATH)
        with open(CLASSES_PATH, "r") as f:
            class_names = json.load(f)
        print("Modelo cargado correctamente")
        print("Clases:", class_names)


# ============================================================
# RUTA DE PRUEBA
# ============================================================

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Backend DetectOil IA funcionando correctamente"
    })


# ============================================================
# RUTA LOGIN
# ============================================================

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()

    usuario = data.get("usuario")
    clave = data.get("clave")

    if usuario == USUARIO_VALIDO and clave == CLAVE_VALIDA:
        return jsonify({
            "success": True,
            "usuario": usuario
        })

    return jsonify({
        "success": False,
        "message": "Usuario o contraseña incorrectos."
    })

# ============================================================
# RUTA DE PREDICCIÓN
# ============================================================

@app.route("/api/predict", methods=["POST"])
def predict():
    # Cargar modelo solo cuando se necesita
    load_model_if_needed()
    
    if "imagen" not in request.files:
        return jsonify({
            "success": False,
            "message": "No se envió ninguna imagen."
        }), 400

    file = request.files["imagen"]

    # Datos opcionales enviados desde el frontend
    fecha = request.form.get("fecha", "No especificada")
    zona = request.form.get("zona", "No especificada")

    try:
        # Abrimos la imagen, la convertimos a escala de grises y la redimensionamos
        img = Image.open(file).convert("L")
        img = img.resize((128, 128))

        # Convertimos la imagen a arreglo numérico
        img_array = np.array(img)
        img_array = np.expand_dims(img_array, axis=-1)
        img_array = np.expand_dims(img_array, axis=0)

        # Predicción del modelo
        prediccion = model.predict(img_array)[0][0]

        # Como el modelo usa sigmoid:
        # cercano a 0 = no_oil
        # cercano a 1 = oil
        probabilidad_derrame = float(prediccion)
        probabilidad_sin_derrame = 1 - probabilidad_derrame

        if probabilidad_derrame >= 0.5:
            resultado = "Derrame detectado"
            clase_tecnica = "oil"
            confianza = probabilidad_derrame
        else:
            resultado = "Sin indicios de derrame"
            clase_tecnica = "no_oil"
            confianza = probabilidad_sin_derrame

        # Nivel de alerta según probabilidad
        if probabilidad_derrame >= 0.75:
            nivel_alerta = "Alto"
            recomendacion = "Se recomienda realizar una verificación adicional y reportar la posible presencia de hidrocarburos en la zona monitoreada."
        elif probabilidad_derrame >= 0.5:
            nivel_alerta = "Medio"
            recomendacion = "Se identifican posibles indicios de derrame. Se recomienda continuar con el monitoreo y validar la imagen."
        else:
            nivel_alerta = "Bajo"
            recomendacion = "No se identifican indicios relevantes de derrame. Se recomienda mantener el monitoreo preventivo."

        return jsonify({
            "success": True,
            "resultado": resultado,
            "clase_tecnica": clase_tecnica,
            "confianza": round(confianza * 100, 2),
            "probabilidad_derrame": round(probabilidad_derrame * 100, 2),
            "probabilidad_sin_derrame": round(probabilidad_sin_derrame * 100, 2),
            "nivel_alerta": nivel_alerta,
            "fecha": fecha,
            "zona": zona,
            "recomendacion": recomendacion
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al procesar la imagen: {str(e)}"
        }), 500


# ============================================================
# EJECUCIÓN DEL SERVIDOR
# ============================================================

if __name__ == "__main__":
    app.run(debug=True)
