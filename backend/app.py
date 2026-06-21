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
import psycopg2
from urllib.parse import urlparse, parse_qs
import random

# Creamos la aplicación Flask
app = Flask(__name__)

# Habilitamos CORS para conectar React con Flask
# Permitir orígenes específicos (vuelve a configurar con tus dominios reales)
ALLOWED_ORIGINS = [
    "https://detectoilfrotend.onrender.com",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    re.compile(r"^https://.*\.vercel\.app$"),
]

# Para pruebas rápidas puedes usar '*' pero en producción restringe a tus dominios.
CORS(app, resources={r"/api/*": {"origins": ALLOWED_ORIGINS}}, supports_credentials=True)

# ============================================================
# CONFIGURACIÓN DE BASE DE DATOS POSTGRESQL
# ============================================================

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://postgres:LTVkJ42YAvaGLCK3zreh@158.220.114.139:5566/historialdb?schema=public"
)

def get_db_connection():
    try:
        parsed = urlparse(DATABASE_URL)
        queries = parse_qs(parsed.query)
        schema = queries.get('schema', ['public'])[0]
        
        # Limpiamos el parámetro 'schema' para evitar que falle libpq
        clean_query = ""
        query_params = []
        for k, v in queries.items():
            if k != 'schema':
                for val in v:
                    query_params.append(f"{k}={val}")
        if query_params:
            clean_query = "?" + "&".join(query_params)
            
        clean_url = parsed._replace(query=clean_query.lstrip('?')).geturl()
        
        conn = psycopg2.connect(clean_url)
        
        if schema:
            with conn.cursor() as cur:
                if re.match(r'^[a-zA-Z0-9_]+$', schema):
                    cur.execute(f'SET search_path TO "{schema}";')
                else:
                    cur.execute('SET search_path TO "public";')
        return conn
    except Exception as e:
        print(f"Error de conexión a la base de datos: {e}")
        return None

def init_db():
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cur:
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS historial (
                        id SERIAL PRIMARY KEY,
                        fecha VARCHAR(100),
                        lugar VARCHAR(255),
                        area VARCHAR(50),
                        confianza VARCHAR(50),
                        nivel VARCHAR(50),
                        resultado VARCHAR(100),
                        probabilidad_derrame NUMERIC,
                        probabilidad_sin_derrame NUMERIC,
                        recomendacion TEXT,
                        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                """)
                conn.commit()
            print("Base de datos inicializada correctamente (tabla historial creada o ya existente)")
        except Exception as e:
            print(f"Error al inicializar la base de datos: {e}")
        finally:
            conn.close()

# Inicializamos la base de datos al arrancar
init_db()

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

        # Guardar en base de datos de historial
        conn = get_db_connection()
        if conn:
            try:
                with conn.cursor() as cur:
                    # Si es derrame, generamos un área simulada realista (e.g. 1.0 a 6.0 km²), de lo contrario 0 km²
                    if clase_tecnica == 'oil':
                        area_val = f"{round(random.uniform(1.0, 6.0), 1)} km²"
                    else:
                        area_val = "0 km²"
                    
                    confianza_str = f"{round(confianza * 100, 2)}%"
                    nivel_val = nivel_alerta.lower()
                    
                    cur.execute("""
                        INSERT INTO historial (fecha, lugar, area, confianza, nivel, resultado, probabilidad_derrame, probabilidad_sin_derrame, recomendacion)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        fecha if fecha and fecha != "No especificada" else "No especificada",
                        zona if zona and zona != "No especificada" else "No especificada",
                        area_val,
                        confianza_str,
                        nivel_val,
                        resultado,
                        round(probabilidad_derrame * 100, 2),
                        round(probabilidad_sin_derrame * 100, 2),
                        recomendacion
                    ))
                    conn.commit()
            except Exception as e:
                print(f"Error al guardar historial en BD: {e}")
            finally:
                conn.close()

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
# RUTA DE HISTORIAL
# ============================================================

@app.route("/api/historial", methods=["GET"])
def get_historial():
    conn = get_db_connection()
    if not conn:
        return jsonify({
            "success": False,
            "message": "No se pudo conectar a la base de datos de historial."
        }), 500
    
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, fecha, lugar, area, confianza, nivel, resultado, probabilidad_derrame, probabilidad_sin_derrame, recomendacion 
                FROM historial 
                ORDER BY id DESC
            """)
            rows = cur.fetchall()
            
            historial_list = []
            for row in rows:
                historial_list.append({
                    "id": f"#{row[0]:03d}" if isinstance(row[0], int) else f"#{row[0]}",
                    "fecha": row[1],
                    "lugar": row[2],
                    "area": row[3],
                    "confianza": row[4],
                    "nivel": row[5],
                    "resultado": row[6],
                    "probabilidad_derrame": float(row[7]) if row[7] is not None else 0.0,
                    "probabilidad_sin_derrame": float(row[8]) if row[8] is not None else 0.0,
                    "recomendacion": row[9]
                })
            
            return jsonify({
                "success": True,
                "data": historial_list
            })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al consultar el historial: {str(e)}"
        }), 500
    finally:
        conn.close()


# ============================================================
# EJECUCIÓN DEL SERVIDOR
# ============================================================

if __name__ == "__main__":
    app.run(debug=True)
