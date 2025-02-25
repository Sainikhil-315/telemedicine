// services/geminiService.js
const axios = require("axios");
require('dotenv').config(); // Ensure environment variables are loaded

// Function to check if a query is medical-related using keywords
function isMedicalQueryBasic(text) {
  const medicalKeywords = [ 'hi', 'hello', 'what is the cause of my symptoms?', 'how can I improve my health?', 'can you help me find a specialist?',
    'what should I do next?', 'do I need medication?', 'how can I manage my condition?', 'when should I see a doctor?',
    'where is the nearest hospital?', 'what are the side effects?', 'is this treatment safe?', 'can you explain my diagnosis?',
    'what are the treatment options?', 'do I need a follow-up?', 'how long will recovery take?', 'can you recommend a treatment?',
    'should I get a second opinion?', 'what are the risks?', 'can this condition be cured?', 'how can I prevent this?',
    'is there an alternative treatment?', 'can you explain the procedure?', 'how often should I get check-ups?', 'what are the symptoms?',
    'is it hereditary?', 'can lifestyle changes help?', 'do I need to change my diet?', 'can you recommend a specialist?', 
    'how urgent is this?', 'can I treat this at home?', 'what should I avoid?', 'is this condition contagious?', 
    'how can I support a family member with this condition?', 'are there any support groups?', 'how much will it cost?',
    'is it covered by insurance?',
    'primary care', 'diagnosis', 'treatment', 'prescription', 'prevention', 'health check-up',
    'blood test', 'x-ray', 'vaccination', 'physical examination', 'heart', 'cardiovascular',
    'EKG', 'angiogram', 'echocardiogram', 'hypertension', 'cholesterol', 'heart disease',
    'arrhythmia', 'pacemaker', 'skin', 'eczema', 'psoriasis', 'acne', 'biopsy', 'mole removal',
    'rash', 'dermatitis', 'melanoma', 'skin cancer', 'brain', 'neurology', 'seizure', 'stroke',
    'Parkinson\'s', 'Alzheimer\'s', 'multiple sclerosis', 'migraine', 'EEG', 'nerve', 'mental health',
    'therapy', 'depression', 'anxiety', 'schizophrenia', 'bipolar disorder', 'counseling', 'psychotherapy',
    'medication', 'DSM-5', 'child health', 'pediatrics', 'immunization', 'growth chart', 'developmental milestones',
    'newborn', 'infant', 'adolescent', 'well-child visit', 'ear infection', 'bones', 'joints', 'arthritis', 
    'fracture', 'rehabilitation', 'prosthetics', 'spine', 'orthopedic surgery', 'musculoskeletal', 'tendon',
    'health', 'doctor', 'medicine', 'medical', 'hospital', 'clinic', 'nurse', 'appointment', 'treatment', 
    'patient', 'emergency', 'surgery', 'symptom', 'diagnosis', 'prescription', 'pharmacy', 'specialist',
    'fever', 'cold', 'cough', 'flu', 'infection', 'virus', 'bacteria', 'chronic illness', 'acute illness',
    'asthma', 'allergy', 'bronchitis', 'pneumonia', 'tuberculosis', 'sinusitis', 'common cold', 
    'influenza', 'covid-19', 'diabetes', 'hypertension', 'heart attack', 'stroke', 'cancer', 
    'tumor', 'chemotherapy', 'radiation therapy', 'leukemia', 'lymphoma', 'breast cancer', 
    'prostate cancer', 'lung cancer', 'colon cancer', 'diarrhea', 'constipation', 'gastroenteritis', 
    'irritable bowel syndrome', 'inflammatory bowel disease', 'ulcerative colitis', 'Crohn\'s disease', 
    'celiac disease', 'hepatitis', 'cirrhosis', 'jaundice', 'kidney stones', 'urinary tract infection', 
    'bladder infection', 'nephritis', 'renal failure', 'dialysis', 'anemia', 'sickle cell disease', 
    'hemophilia', 'thrombosis', 'deep vein thrombosis', 'pulmonary embolism', 'varicose veins', 
    'liver disease', 'gallstones', 'pancreatitis', 'hyperthyroidism', 'hypothyroidism', 'goiter',
    'osteoporosis', 'osteoarthritis', 'rheumatoid arthritis', 'gout', 'fibromyalgia', 'lupus', 
    'scleroderma', 'multiple sclerosis', 'epilepsy', 'Alzheimer\'s disease', 'Parkinson\'s disease', 
    'Huntington\'s disease', 'migraine', 'cluster headache', 'tension headache', 'vertigo', 
    'dizziness', 'fainting', 'seizure disorder', 'insomnia', 'sleep apnea', 'restless legs syndrome', 
    'narcolepsy', 'schizophrenia', 'bipolar disorder', 'depression', 'anxiety disorder', 'panic attack',
    'obsessive-compulsive disorder', 'post-traumatic stress disorder', 'eating disorders', 'anorexia', 
    'bulimia', 'binge-eating disorder', 'ADHD', 'autism', 'learning disabilities', 'speech delay', 
    'developmental delay', 'Down syndrome', 'cerebral palsy', 'muscular dystrophy', 'spina bifida', 
    'congenital heart defect', 'cleft lip', 'cleft palate', 'fetal alcohol syndrome', 'prematurity',
    'low birth weight', 'SIDS', 'childhood obesity', 'juvenile diabetes', 'infant jaundice', 'eczema', 
    'diaper rash', 'ear infection', 'strep throat', 'tonsillitis', 'measles', 'mumps', 'rubella',
    'chickenpox', 'whooping cough', 'scarlet fever', 'hand-foot-and-mouth disease', 'mononucleosis', 
    'hepatitis A', 'hepatitis B', 'hepatitis C', 'malaria', 'dengue fever', 'yellow fever', 'Zika virus',
    'Ebola virus', 'HIV/AIDS', 'sexually transmitted infections', 'gonorrhea', 'chlamydia', 'syphilis',
    'herpes', 'HPV', 'genital warts', 'cervical cancer', 'ovarian cancer', 'endometriosis', 'PCOS', 
    'menstrual disorders', 'menopause', 'pelvic inflammatory disease', 'ectopic pregnancy', 'miscarriage', 
    'stillbirth', 'preterm labor', 'preeclampsia', 'gestational diabetes', 'postpartum depression', 'infertility',
    'male infertility', 'erectile dysfunction', 'prostate problems', 'testicular cancer', 'breast cancer',
    'ovarian cancer', 'endometrial cancer', 'skin cancer', 'melanoma', 'basal cell carcinoma', 'squamous cell carcinoma',
    'psoriasis', 'eczema', 'acne', 'rosacea', 'dermatitis', 'hives', 'skin allergies', 'skin infection', 'abscess', 
    'boil', 'cellulitis', 'impetigo', 'wound care', 'burn care', 'cuts', 'bruises', 'sprains', 'strains', 'fractures',
    'dislocations', 'spinal injuries', 'head injuries', 'concussions', 'sports injuries', 'rehabilitation', 'physical therapy',
    'occupational therapy', 'speech therapy', 'cognitive therapy', 'behavioral therapy', 'counseling', 'support groups',
    'chronic pain', 'pain management', 'palliative care', 'hospice care', 'end-of-life care', 'grief counseling',
    'mental health services', 'emergency services', 'urgent care', 'telemedicine', 'virtual consultation', 'home care',
    'nursing home care', 'assisted living', 'rehabilitation center', 'medical equipment', 'durable medical equipment',
    'assistive devices', 'mobility aids', 'wheelchairs', 'walkers', 'crutches', 'prosthetics', 'orthotics'
];



  const textLower = text.toLowerCase();
  return medicalKeywords.some(keyword => textLower.includes(keyword));
}

// Alternative function using Gemini API to classify if a query is medical-related
async function isMedicalQueryAdvanced(text) {
  try {
    const API_KEY = 'AIzaSyB4KVSHFZANOCgJbuCsDtw7bJxooTApdRc';
    if (!API_KEY) {
      console.error("Gemini API key is missing");
      return true; // Default to accepting the query if we can't check
    }

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
      {
        contents: [
          {
            parts: [
              { text: `Classify if the following query is related to medical topics, health concerns, symptoms, treatments, or healthcare. Only respond with "YES" if it's medical-related, or "NO" if it's not: "${text}"` }
            ]
          }
        ]
      },
      {
        headers: { "Content-Type": "application/json" },
        params: { key: API_KEY }
      }
    );

    if (response.data &&
      response.data.candidates &&
      response.data.candidates[0] &&
      response.data.candidates[0].content &&
      response.data.candidates[0].content.parts &&
      response.data.candidates[0].content.parts[0]) {
      const answer = response.data.candidates[0].content.parts[0].text.trim().toUpperCase();
      return answer.includes("YES");
    }

    return true; // Default to accepting if we can't parse the response
  } catch (error) {
    console.error("Error classifying query:", error.message);
    return true; // Default to accepting the query if classification fails
  }
}

exports.getGeminiResponse = async (text) => {
  try {
    // Choose which method to use for checking medical relevance
    // For faster responses but less accurate: isMedicalQueryBasic(text)
    // For more accurate but slower (requires API call): await isMedicalQueryAdvanced(text)
    if (!isMedicalQueryBasic(text)) {
      return "I'm specialized in medical assistance and can only respond to health-related inquiries. Some examples of questions I can help with include:\n\n- 'What are the symptoms of the flu?'\n- 'How can I manage my diabetes?'\n- 'What should I know about this medication?'\n- 'When should I see a doctor about this pain?'\n\nPlease feel free to ask any medical or health-related question.";
    }

    const API_KEY = 'AIzaSyB4KVSHFZANOCgJbuCsDtw7bJxooTApdRc';
    if (!API_KEY) {
      console.error("Gemini API key is missing");
      return "Error: API key is missing. Please check server configuration.";
    }

    console.log("Sending request to Gemini API with text:", text);

    // Enhance the prompt to focus on medical responses
    const medicalPrompt = `You are a medical assistant. Please provide information about the following health-related query: ${text}`;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
      {
        contents: [
          {
            parts: [
              { text: medicalPrompt }
            ]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        },
        params: {
          key: 'AIzaSyB4KVSHFZANOCgJbuCsDtw7bJxooTApdRc'
        }
      }
    );

    console.log("Received response from Gemini API");

    // Parse response based on Gemini API structure
    if (response.data &&
      response.data.candidates &&
      response.data.candidates[0] &&
      response.data.candidates[0].content &&
      response.data.candidates[0].content.parts &&
      response.data.candidates[0].content.parts[0]) {
      return response.data.candidates[0].content.parts[0].text;
    }

    console.error("Unexpected response structure from Gemini API:", JSON.stringify(response.data, null, 2));
    return "Sorry, I received an unexpected response format.";
  } catch (error) {
    console.error("Error fetching response from Gemini API:", error.message);
    if (error.response) {
      console.error("API response error data:", JSON.stringify(error.response.data, null, 2));
      console.error("API response status:", error.response.status);

      // More specific error messages based on status codes
      if (error.response.status === 400) {
        return "Sorry, there was an issue with the request format.";
      } else if (error.response.status === 401 || error.response.status === 403) {
        return "Sorry, there was an authentication issue with the AI service.";
      } else if (error.response.status === 429) {
        return "Sorry, we've hit the rate limit for the AI service. Please try again later.";
      }
    }
    return "Sorry, I couldn't process your request.";
  }
};