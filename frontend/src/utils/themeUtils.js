// First, let's create a utility file to manage dark mode classes
// src/utils/themeUtils.js

export const getThemeClasses = (darkMode) => {
    return {
      // Background classes
      bgMain: darkMode ? 'bg-dark' : 'bg-light',
      bgCard: darkMode ? 'bg-dark' : 'bg-white',
      bgHeader: darkMode ? 'bg-dark' : 'bg-light',
      
      // Text classes
      text: darkMode ? 'text-light' : 'text-dark',
      
      // Border classes
      border: darkMode ? 'border-secondary' : 'border',
      
      // Form control classes
      formControl: darkMode ? 'form-control bg-dark text-light border-secondary' : 'form-control',
      formSelect: darkMode ? 'form-select bg-dark text-light border-secondary' : 'form-select',
      formCheckInput: darkMode ? 'form-check-input bg-dark border-secondary' : 'form-check-input',
      
      // Button classes
      btnOutline: darkMode ? 'btn-outline-light' : 'btn-outline-dark',
      btnSecondary: darkMode ? 'btn-outline-light' : 'btn-secondary',
      
      // Card classes
      card: darkMode ? 'card bg-dark text-light border-secondary' : 'card',
      cardHeader: darkMode ? 'card-header bg-dark border-secondary' : 'card-header',
      cardBody: darkMode ? 'card-body bg-dark' : 'card-body',
  
      // Alert classes
      alertDanger: darkMode ? 'alert alert-danger bg-danger text-light' : 'alert alert-danger',
      alertSuccess: darkMode ? 'alert alert-success bg-success text-light' : 'alert alert-success'
    };
  };