import cv2
import numpy as np
import tensorflow as tf
import mysql.connector
import serial
import time
from datetime import date
from keras.applications import MobileNetV2
from keras.applications.mobilenet_v2 import preprocess_input, decode_predictions

# === Load pre-trained model ===
model = MobileNetV2(weights='imagenet')
IMG_SIZE = 224

# === Arduino 1 Setup (COM7) ===
try:
    arduino = serial.Serial('COM7', 9600, timeout=1)
    print("✅ Connected to Arduino 1 (COM7)")
    time.sleep(2)
except Exception as e:
    print(f"❌ Arduino 1 error: {e}")
    arduino = None

# === Arduino 2 Setup (COM10) for Servo ===
try:
    arduino2 = serial.Serial('COM10', 9600, timeout=1)
    print("✅ Connected to Arduino 2 (COM10)")
    time.sleep(2)
except Exception as e:
    print(f"❌ Arduino 2 error: {e}")
    arduino2 = None

# === MySQL Config ===
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'db_global_help'
}

def save_to_database(category):
    today = date.today()
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT id, total FROM tbl_category_totals WHERE category=%s AND date=%s", (category, today))
        result = cursor.fetchone()

        if result:
            new_total = result[1] + 1
            cursor.execute("UPDATE tbl_category_totals SET total=%s WHERE id=%s", (new_total, result[0]))
        else:
            cursor.execute("INSERT INTO tbl_category_totals (category, total, date) VALUES (%s, %s, %s)", (category, 1, today))

        conn.commit()
        cursor.close()
        conn.close()
        print(f"✅ Saved to DB: {category} ({today})")
    except mysql.connector.Error as e:
        print(f"❌ Database error: {e}")

def trigger_motors(category):
    # Send to Arduino 1 (material logic)
    if arduino:
        if category == "glass":
            arduino.write(b'g')
        elif category == "plastic":
            arduino.write(b'p')
        elif category == "paper":
            arduino.write(b'a')
        print(f"⚙️ Sent '{category}' to Arduino 1.")

    # Send to Arduino 2 (servo)
    if arduino2:
        arduino2.write(b'1')  # Just send '1' to trigger servo
        print("⚙️ Sent trigger to Arduino 2 for servo.")
    else:
        print("⚠️ Arduino 2 not connected.")

def open_camera():
    for index in range(3):
        cap = cv2.VideoCapture(index)
        if cap.isOpened():
            print(f"📷 Camera opened at index {index}. Press 'q' to quit.")
            return cap
        cap.release()
    print("❌ No camera found.")
    exit()

# === Start Camera ===
cap = open_camera()
detected_timestamps = {}
COOLDOWN_SECONDS = 5

while True:
    ret, frame = cap.read()
    if not ret:
        print("❌ Failed to capture frame.")
        break

    # Preprocess
    img = cv2.resize(frame, (IMG_SIZE, IMG_SIZE))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    predictions = model.predict(img_array, verbose=0)
    decoded = decode_predictions(predictions, top=1)[0][0]
    label = decoded[1].lower()

    if "glass" in label:
        result = "glass"
        color = (0, 255, 0)
    elif "plastic" in label:
        result = "plastic"
        color = (255, 255, 0)
    elif "paper" in label or "envelope" in label:
        result = "paper"
        color = (255, 0, 0)
    else:
        result = "UNKNOWN"
        color = (0, 0, 255)

    current_time = time.time()
    last_time = detected_timestamps.get(result, 0)

    if result != "UNKNOWN" and (current_time - last_time) > COOLDOWN_SECONDS:
        save_to_database(result)
        trigger_motors(result)
        detected_timestamps[result] = current_time

    cv2.putText(frame, f"Detected: {result}", (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)
    cv2.imshow("Material Detector", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
