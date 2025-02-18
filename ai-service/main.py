from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from frontend

# Load the trained SVM model (Ensure model.pkl exists)
try:
    with open("model.pkl", "rb") as model_file:
        model = pickle.load(model_file)
except FileNotFoundError:
    model = None
    print("Warning: model.pkl not found! Train and save the model first.")

@app.route("/chat", methods=["POST"])
def chatbot_response():
    data = request.json
    symptoms = data.get("symptoms", [])
    
    if not symptoms:
        return jsonify({"error": "No symptoms provided"}), 400
    
    # Convert symptoms to numerical format (example: dummy encoding)
    symptoms_vector = np.array(symptoms).reshape(1, -1)  # Modify based on preprocessing
    
    if model:
        prediction = model.predict(symptoms_vector)[0]
        response = f"Based on your symptoms, you might have {prediction}. Please consult a doctor."
    else:
        response = "AI model is not available. Try again later."
    
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True, port=5001)  # Running on port 5001
