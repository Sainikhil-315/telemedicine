import pickle
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

# Load the trained SVM model
with open("symptom_prediction_model.pkl", "rb") as file:
    model = pickle.load(file)

# Load the same TF-IDF vectorizer used during training
with open("tfidf_vectorizer.pkl", "rb") as file:
    vectorizer = pickle.load(file)

def predict_symptom(user_input_text):
    """
    Predicts the symptom based on user input text.

    Args:
        user_input_text (str): The user's symptom description.

    Returns:
        str: Predicted symptom label.
    """
    # Convert user input text to TF-IDF features
    input_features = vectorizer.transform([user_input_text])
    
    # Make prediction
    prediction = model.predict(input_features)
    
    return prediction[0]  # Return predicted symptom
