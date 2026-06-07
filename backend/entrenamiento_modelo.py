# ============================================================
# train_model.py — Entrenamiento del modelo DetectOil IA
# Clasificación binaria: no_oil vs oil
# ============================================================

import tensorflow as tf
from tensorflow.keras import layers, models
from pathlib import Path
import json
import os

# Ruta del dataset limpio
DATASET_DIR = Path("dataset/dataset_modelo")

# Configuración de imágenes
IMG_SIZE = (128, 128)
BATCH_SIZE = 32
EPOCHS = 10

# Verificamos que exista el dataset
if not DATASET_DIR.exists():
    raise FileNotFoundError(f"No se encontró la carpeta: {DATASET_DIR}")

# Cargamos dataset de entrenamiento
train_ds = tf.keras.utils.image_dataset_from_directory(
    DATASET_DIR,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    color_mode="grayscale"
)

# Cargamos dataset de validación
val_ds = tf.keras.utils.image_dataset_from_directory(
    DATASET_DIR,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    color_mode="grayscale"
)

# Nombres de clases detectados por TensorFlow
class_names = train_ds.class_names
print("Clases detectadas:", class_names)

# Debe salir algo como:
# ['no_oil', 'oil']

# Creamos carpeta para guardar el modelo
os.makedirs("models", exist_ok=True)

# Guardamos las clases en un JSON
with open("models/class_names.json", "w") as f:
    json.dump(class_names, f)

# Optimizamos la carga de datos
AUTOTUNE = tf.data.AUTOTUNE

train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

# Modelo CNN simple
model = models.Sequential([
    layers.Input(shape=(128, 128, 1)),

    # Normalización: convierte valores de 0-255 a 0-1
    layers.Rescaling(1./255),

    layers.Conv2D(32, (3, 3), activation="relu"),
    layers.MaxPooling2D(),

    layers.Conv2D(64, (3, 3), activation="relu"),
    layers.MaxPooling2D(),

    layers.Conv2D(128, (3, 3), activation="relu"),
    layers.MaxPooling2D(),

    layers.Flatten(),

    layers.Dense(128, activation="relu"),
    layers.Dropout(0.4),

    # Salida binaria:
    # cercano a 0 = no_oil
    # cercano a 1 = oil
    layers.Dense(1, activation="sigmoid")
])

# Compilamos el modelo
model.compile(
    optimizer="adam",
    loss="binary_crossentropy",
    metrics=["accuracy"]
)

# Mostramos resumen del modelo
model.summary()

# Entrenamos el modelo
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS
)

# Guardamos el modelo entrenado
model.save("models/detectoil_model.keras")

print("====================================")
print("Modelo entrenado y guardado con éxito")
print("Archivo: models/detectoil_model.keras")
print("Clases:", class_names)
print("====================================")