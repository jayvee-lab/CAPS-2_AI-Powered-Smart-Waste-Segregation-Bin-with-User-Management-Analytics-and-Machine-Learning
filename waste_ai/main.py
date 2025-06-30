import cv2
import numpy as np
from tensorflow.keras.models import load_model

# ✅ Load the trained CNN model
model = load_model("glass_paper_plastic_model.h5")

# ✅ Define class names in the same order as training
class_names = ['glass', 'paper', 'plastic']  # adjust if trained differently

# ✅ Image size expected by model
IMG_SIZE = 224

# ✅ Start webcam
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("❌ Could not open camera.")
    exit()

print("✅ Camera started. Press 'q' to quit.")

while True:
    ret, frame = cap.read()
    if not ret:
        print("❌ Failed to grab frame.")
        break

    # ✅ Preprocess frame
    img = cv2.resize(frame, (IMG_SIZE, IMG_SIZE))
    img = img.astype("float32") / 255.0
    img = np.expand_dims(img, axis=0)

    # ✅ Make prediction
    prediction = model.predict(img)
    class_index = np.argmax(prediction)
    confidence = prediction[0][class_index]

    if confidence >= 0.8:
        label = f"{class_names[class_index]} ({confidence*100:.1f}%)"
        print(f"✅ Detected: {class_names[class_index]} ({confidence*100:.1f}%)")
    else:
        label = "Uncertain"
        print("⚠️ Uncertain prediction")

    # ✅ Display on camera frame
    cv2.putText(frame, label, (10, 40),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.imshow("Glass / Paper / Plastic Detector", frame)

    # ✅ Exit with 'q' key
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
