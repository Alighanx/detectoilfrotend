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
from werkzeug.security import generate_password_hash, check_password_hash

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
                # Crear tabla historial
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
                # Crear tabla usuarios
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS usuarios (
                        id SERIAL PRIMARY KEY,
                        usuario VARCHAR(150) UNIQUE NOT NULL,
                        contrasena VARCHAR(256) NOT NULL,
                        nombre VARCHAR(150),
                        rol VARCHAR(50) DEFAULT 'usuario',
                        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                """)
                # Asegurar columna rol si la tabla ya existía
                try:
                    cur.execute("ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS rol VARCHAR(50) DEFAULT 'usuario';")
                except Exception as migration_e:
                    print(f"Migración de rol ignorada o no compatible: {migration_e}")
                
                # Semilla de usuario admin por defecto
                cur.execute("SELECT COUNT(*) FROM usuarios")
                if cur.fetchone()[0] == 0:
                    hashed_pw = generate_password_hash("1234")
                    cur.execute("""
                        INSERT INTO usuarios (usuario, contrasena, nombre, rol)
                        VALUES (%s, %s, %s, %s)
                    """, ("admin", hashed_pw, "Administrador", "admin"))
                else:
                    # Asegurar que admin tenga el rol 'admin'
                    cur.execute("UPDATE usuarios SET rol = 'admin' WHERE usuario = 'admin'")
                conn.commit()
            print("Base de datos inicializada correctamente (tablas historial y usuarios listas)")
        except Exception as e:
            print(f"Error al inicializar la base de datos: {e}")
        finally:
            conn.close()

# Inicializamos la base de datos al arrancar
init_db()

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
# RUTA LOGIN (Autenticación con Base de Datos)
# ============================================================

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()

    usuario = data.get("usuario")
    clave = data.get("clave")

    if not usuario or not clave:
        return jsonify({
            "success": False,
            "message": "Falta ingresar el usuario o la contraseña."
        }), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({
            "success": False,
            "message": "No se pudo establecer conexión con la base de datos."
        }), 500

    try:
        with conn.cursor() as cur:
            cur.execute("SELECT contrasena, nombre, rol FROM usuarios WHERE usuario = %s", (usuario,))
            row = cur.fetchone()
            if row:
                contrasena_hash, nombre, rol = row
                if check_password_hash(contrasena_hash, clave):
                    return jsonify({
                        "success": True,
                        "usuario": usuario,
                        "nombre": nombre,
                        "rol": rol or "usuario"
                    })
        return jsonify({
            "success": False,
            "message": "Usuario o contraseña incorrectos."
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al procesar la autenticación: {str(e)}"
        }), 500
    finally:
        conn.close()


# ============================================================
# ENDPOINTS PARA GESTIÓN DE USUARIOS
# ============================================================

@app.route("/api/usuarios", methods=["GET"])
def get_usuarios():
    conn = get_db_connection()
    if not conn:
        return jsonify({
            "success": False,
            "message": "No se pudo conectar a la base de datos."
        }), 500
    
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id, usuario, nombre, fecha_registro FROM usuarios ORDER BY id ASC")
            rows = cur.fetchall()
            
            usuarios_list = []
            for row in rows:
                usuarios_list.append({
                    "id": row[0],
                    "usuario": row[1],
                    "nombre": row[2] or "Sin nombre",
                    "fecha_registro": row[3].strftime("%Y-%m-%d %H:%M:%S") if row[3] else "No registrada"
                })
            
            return jsonify({
                "success": True,
                "data": usuarios_list
            })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al consultar usuarios: {str(e)}"
        }), 500
    finally:
        conn.close()


@app.route("/api/usuarios", methods=["POST"])
def create_usuario():
    data = request.get_json()
    usuario = data.get("usuario")
    contrasena = data.get("contrasena")
    nombre = data.get("nombre", "")

    if not usuario or not contrasena:
        return jsonify({
            "success": False,
            "message": "El nombre de usuario y la contraseña son requeridos."
        }), 400

    # Validar formato simple del usuario (sólo alfanumérico y guiones)
    if not re.match(r'^[a-zA-Z0-9_-]+$', usuario):
        return jsonify({
            "success": False,
            "message": "El nombre de usuario sólo puede contener letras, números, guiones y guiones bajos."
        }), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({
            "success": False,
            "message": "No se pudo conectar a la base de datos."
        }), 500

    try:
        hashed_pw = generate_password_hash(contrasena)
        with conn.cursor() as cur:
            # Verificar si ya existe
            cur.execute("SELECT COUNT(*) FROM usuarios WHERE usuario = %s", (usuario,))
            if cur.fetchone()[0] > 0:
                return jsonify({
                    "success": False,
                    "message": f"El nombre de usuario '{usuario}' ya está registrado."
                }), 400

            cur.execute("""
                INSERT INTO usuarios (usuario, contrasena, nombre)
                VALUES (%s, %s, %s)
            """, (usuario, hashed_pw, nombre))
            conn.commit()
            return jsonify({
                "success": True,
                "message": f"Usuario '{usuario}' registrado correctamente."
            })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al registrar usuario: {str(e)}"
        }), 500
    finally:
        conn.close()


@app.route("/api/usuarios/<int:user_id>", methods=["DELETE"])
def delete_usuario(user_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({
            "success": False,
            "message": "No se pudo conectar a la base de datos."
        }), 500

    try:
        with conn.cursor() as cur:
            # Obtener el nombre de usuario
            cur.execute("SELECT usuario FROM usuarios WHERE id = %s", (user_id,))
            row = cur.fetchone()
            if not row:
                return jsonify({
                    "success": False,
                    "message": "Usuario no encontrado."
                }), 404
            
            usuario = row[0]
            
            # Impedir eliminar el administrador principal
            if usuario == "admin":
                return jsonify({
                    "success": False,
                    "message": "El usuario administrador principal 'admin' no puede ser eliminado del sistema."
                }), 400

            cur.execute("DELETE FROM usuarios WHERE id = %s", (user_id,))
            conn.commit()
            return jsonify({
                "success": True,
                "message": f"Usuario '{usuario}' eliminado correctamente."
            })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al eliminar usuario: {str(e)}"
        }), 500
    finally:
        conn.close()


@app.route("/api/usuarios/change-password", methods=["POST"])
def change_password():
    data = request.get_json()
    usuario = data.get("usuario")
    clave_actual = data.get("clave_actual")
    clave_nueva = data.get("clave_nueva")

    if not usuario or not clave_actual or not clave_nueva:
        return jsonify({
            "success": False,
            "message": "Todos los campos son requeridos."
        }), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({
            "success": False,
            "message": "No se pudo conectar a la base de datos."
        }), 500

    try:
        with conn.cursor() as cur:
            # Buscar el usuario
            cur.execute("SELECT contrasena FROM usuarios WHERE usuario = %s", (usuario,))
            row = cur.fetchone()
            if not row:
                return jsonify({
                    "success": False,
                    "message": "Usuario no encontrado."
                }), 404
            
            hashed_pw = row[0]
            # Validar la contraseña antigua
            if not check_password_hash(hashed_pw, clave_actual):
                return jsonify({
                    "success": False,
                    "message": "La contraseña actual es incorrecta."
                }), 400
                
            # Generar hash de la nueva contraseña y actualizar
            new_hashed_pw = generate_password_hash(clave_nueva)
            cur.execute("UPDATE usuarios SET contrasena = %s WHERE usuario = %s", (new_hashed_pw, usuario))
            conn.commit()
            return jsonify({
                "success": True,
                "message": "Contraseña cambiada exitosamente."
            })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al cambiar la contraseña: {str(e)}"
        }), 500
    finally:
        conn.close()


# ============================================================
# ENDPOINTS PARA MÉTRICAS Y ACTIVIDAD (Dashboard Inicio)
# ============================================================

@app.route("/api/stats", methods=["GET"])
def get_stats():
    conn = get_db_connection()
    if not conn:
        return jsonify({
            "success": False,
            "message": "No se pudo conectar a la base de datos."
        }), 500
    
    try:
        with conn.cursor() as cur:
            # 1. Total derrames detectados (nivel alto o medio)
            cur.execute("SELECT COUNT(*) FROM historial WHERE nivel IN ('alto', 'medio')")
            derrames = cur.fetchone()[0]
            
            # 2. Alertas críticas (donde nivel = 'alto')
            cur.execute("SELECT COUNT(*) FROM historial WHERE nivel = 'alto'")
            alertas_criticas = cur.fetchone()[0]
            
            # 3. Suma de área afectada en km²
            # Extraemos la parte numérica (ej: '3.2 km²' -> 3.2)
            cur.execute("""
                SELECT SUM(
                    CAST(
                        NULLIF(
                            SPLIT_PART(area, ' ', 1), 
                            ''
                        ) AS NUMERIC
                    )
                ) 
                FROM historial 
                WHERE area IS NOT NULL AND area LIKE '%km%'
            """)
            area_sum = cur.fetchone()[0]
            area_sum = round(float(area_sum), 1) if area_sum is not None else 0.0
            
            # 4. Confianza promedio de la IA (ej: '91.23%' -> 91.23)
            cur.execute("""
                SELECT AVG(
                    CAST(
                        NULLIF(
                            RTRIM(confianza, '%'), 
                            ''
                        ) AS NUMERIC
                    )
                ) 
                FROM historial 
                WHERE confianza IS NOT NULL
            """)
            avg_conf = cur.fetchone()[0]
            avg_conf = round(float(avg_conf), 1) if avg_conf is not None else 0.0
            
            return jsonify({
                "success": True,
                "derrames": derrames,
                "alertas_criticas": alertas_criticas,
                "area_afectada": area_sum,
                "precision_promedio": avg_conf
            })
    except Exception as e:
        return jsonify({
            "success": True,
            "derrames": 0,
            "alertas_criticas": 0,
            "area_afectada": 0.0,
            "precision_promedio": 0.0,
            "note": f"Fallback: {str(e)}"
        })
    finally:
        conn.close()


@app.route("/api/actividad", methods=["GET"])
def get_actividad():
    conn = get_db_connection()
    if not conn:
        return jsonify({
            "success": False,
            "message": "No se pudo conectar a la base de datos."
        }), 500
    
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT fecha, lugar, area, nivel 
                FROM historial 
                ORDER BY id DESC 
                LIMIT 5
            """)
            rows = cur.fetchall()
            
            actividad_list = []
            for row in rows:
                actividad_list.append({
                    "fecha": row[0],
                    "lugar": row[1],
                    "area": row[2],
                    "nivel": row[3]
                })
            
            return jsonify({
                "success": True,
                "data": actividad_list
            })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al consultar la actividad: {str(e)}"
        }), 500
    finally:
        conn.close()


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
