// HomePage.js
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  console.log("Is auth : ",isAuthenticated)
  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        <div className="col-md-6 d-flex align-items-center bg-light">
          <div className="p-5">
            <h1 className="display-4 mb-4">Virtual Healthcare for You</h1>
            <p className="lead mb-4">
              Get instant medical advice, schedule appointments, and chat with healthcare professionals
              from the comfort of your home.
            </p>
            <div className="d-grid gap-3 d-md-flex">
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/Dashboard')}
              >
                Get Started
              </button>
              <button 
                className="btn btn-outline-primary btn-lg"
                onClick={() => navigate('/doctors')}
              >
                Find Doctors
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6 bg-primary d-none d-md-flex align-items-center justify-content-center">
          <div className="text-white text-center p-5">
            <h2 className="mb-4">Our Services</h2>
            <div className="row g-4">
              <div className="col-6">
                <i className="bi bi-chat-dots-fill fs-1 mb-3"></i>
                <h5>24/7 Chat Support</h5>
              </div>
              <div className="col-6">
                <i className="bi bi-calendar-check-fill fs-1 mb-3"></i>
                <h5>Online Booking</h5>
              </div>
              <div className="col-6">
                <i className="bi bi-journal-medical fs-1 mb-3"></i>
                <h5>Health Records</h5>
              </div>
              <div className="col-6">
                <i className="bi bi-person-badge-fill fs-1 mb-3"></i>
                <h5>Expert Doctors</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;