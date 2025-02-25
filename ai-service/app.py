from flask import Flask, request, jsonify
import joblib
import random
import os
import json

app = Flask(__name__)

with open('diseases.json', 'r') as file:
    disease_data = json.load(file)

# Define file paths
model_path = "telemedicine_chatbot_model.pkl"

# Load the model
try:
    model = joblib.load(model_path)
    print("✅ Model loaded successfully.")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    print("Make sure the model file exists and is not corrupted.")

# Define disease categories with their specific symptoms and advice

def get_diagnosis_and_advice(symptom_description):
    """
    Process symptom description and return diagnosis with advice
    """
    try:
        # Predict disease
        predicted_disease = model.predict([symptom_description])[0]
        
        # Get disease probabilities
        disease_probs = model.predict_proba([symptom_description])[0]
        disease_names = model.classes_
        
        # Get top 3 predictions with probabilities
        top_indices = disease_probs.argsort()[-3:][::-1]
        top_diseases = [(disease_names[i], float(disease_probs[i])) for i in top_indices]
        
        # Get sample advice for the predicted disease
        possible_advice = disease_data[predicted_disease]["advice"]
        recommended_advice = random.choice(possible_advice)
        
        return {
            "success": True,
            "predicted_disease": predicted_disease,
            "confidence": float(max(disease_probs)),
            "top_diseases": top_diseases,
            "recommended_advice": recommended_advice
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": "Unable to process your symptoms. Please provide more details or try again."
        }

# API route for symptom prediction
@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        symptom_description = data.get('symptoms', '')
        
        if not symptom_description:
            return jsonify({
                "success": False,
                "message": "Please provide symptom description"
            }), 400
            
        result = get_diagnosis_and_advice(symptom_description)
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"An error occurred: {str(e)}"
        }), 500

# Simple test route
@app.route('/test', methods=['GET'])
def test():
    return jsonify({
        "status": "API is working",
        "model_loaded": model is not None
    })

if __name__ == '__main__':
    app.run(debug=True, port=5001)