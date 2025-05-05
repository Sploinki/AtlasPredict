from flask import Flask, request, jsonify
import numpy as np
import joblib
from flask_cors import CORS
import os
import pandas as pd
import pymongo

# ✅ MongoDB Connection
MONGO_URI = "mongodb://localhost:27017/atlaspredict"
client = pymongo.MongoClient(MONGO_URI)
db = client["atlaspredict"]
collection = db["predictions"]

# ✅ Load all models at startup (Efficient for multiple requests)
models = {
    "flood": joblib.load(os.path.join("models", "flood_model.pkl")),
    "balochistan": joblib.load(os.path.join("models", "balochistan_model.pkl")),
    "punjab_sindh": joblib.load(os.path.join("models", "punjab_sindh_model.pkl"))
}

# ✅ Define correct expected features for each model
expected_features = {
    "flood": [
        "preFloodPrecip", "duringFloodPrecip", "avgTemp", 
        "laggedAvgTemp", "laggedDuringFloodPrecip"
    ],
    "balochistan": [
        "rainfall", "temperature", "humidity", "wind_speed", "soil_moisture"
    ],
    "punjab_sindh": [
        "river_flow", "soil_moisture", "air_pressure", "humidity", "wind_speed"
    ]
}

# ✅ Initialize Flask app
app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "ML API is running!"})

# ✅ Prediction Endpoint (Handles multiple models & logs in MongoDB)
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        print("📩 Received data:", data)  # ✅ Log input data

        # ✅ Extract model type
        model_type = data.get("model")  # Expected: "flood", "balochistan", "punjab_sindh"
        if model_type not in models:
            print("❌ Invalid model type:", model_type)
            return jsonify({"error": "Invalid model type"}), 400

        model = models[model_type]
        feature_keys = expected_features.get(model_type, [])

        # ✅ Check for missing features dynamically
        missing_keys = [key for key in feature_keys if key not in data]
        if missing_keys:
            print("❌ Missing required features:", missing_keys)
            return jsonify({"error": f"Missing required features: {', '.join(missing_keys)}"}), 400

        # ✅ **Map incoming feature names to match the trained model**
        feature_mapping = {
            "preFloodPrecip": "Pre-Flood Precipitation (mm)",
            "duringFloodPrecip": "During-Flood Precipitation (mm)",
            "avgTemp": "Average Temperature (°C)",
            "laggedAvgTemp": "Lagged_Average_Temperature",
            "laggedDuringFloodPrecip": "Lagged_During_Flood_Precipitation",
            "rainfall": "Rainfall (mm)",
            "temperature": "Temperature (°C)",
            "humidity": "Humidity (%)",
            "wind_speed": "Wind Speed (m/s)",
            "soil_moisture": "Soil Moisture (%)",
            "river_flow": "River Flow Rate",
            "air_pressure": "Air Pressure (hPa)"
        }

        # ✅ Convert input data into a DataFrame with correct column names
        features_df = pd.DataFrame([[data[key] for key in feature_keys]], 
                                   columns=[feature_mapping.get(key, key) for key in feature_keys])

        print("📊 Features DataFrame for Prediction:\n", features_df)  # ✅ Log transformed feature data

        # ✅ Make prediction
        prediction = model.predict(features_df)
        print("🔮 Prediction result:", prediction)  # ✅ Log prediction result

        # ✅ Map output to risk levels (only for "flood" model)
        if model_type == "flood":
            risk_levels = {0: 'Low Risk', 1: 'Medium Risk', 2: 'High Risk'}
            result = risk_levels.get(prediction[0], 'Unknown')
        else:
            result = prediction[0]  # Other models return a raw prediction value

        # ✅ Store Prediction in MongoDB
        prediction_entry = {
            "model": model_type,
            "features": data,
            "prediction": result
        }
        collection.insert_one(prediction_entry)

        return jsonify({"prediction": result})

    except Exception as e:
        print("❌ Error in prediction:", str(e))
        return jsonify({"error": str(e)}), 500

# ✅ Retrieve past predictions from MongoDB
@app.route('/history', methods=['GET'])
def get_history():
    try:
        history = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB ObjectID
        return jsonify(history)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Risk Data Endpoint
@app.route('/risk-data', methods=['GET'])
def get_risk_data():
    try:
        # Example risk data (replace with actual logic if needed)
        risk_data = [
            {"name": "Punjab", "risk": "High Risk"},
            {"name": "Sindh", "risk": "Medium Risk"},
            {"name": "KPK", "risk": "Low Risk"},
            {"name": "Balochistan", "risk": "Medium Risk"},
            {"name": "Gilgit-Baltistan", "risk": "Low Risk"}
        ]
        return jsonify(risk_data)
    except Exception as e:
        print("❌ Error fetching risk data:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)  # ✅ Supports external access when deployed