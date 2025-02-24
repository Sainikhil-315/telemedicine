from flask import Flask, request, jsonify
from predict import predict_symptom
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from React/Express

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json  # Get JSON input from frontend
        user_text = data.get("text", "")  # Extract text input
        
        if not user_text:
            return jsonify({"error": "No text provided"}), 400
        
        # Predict the symptom
        predicted_symptom = predict_symptom(user_text)
        
        return jsonify({"predicted_symptom": predicted_symptom})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
