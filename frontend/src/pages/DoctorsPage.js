
// DoctorsPage.js
import React, { useState, useEffect } from 'react';
import DoctorList from '../components/DoctorsList';
import { useNavigate } from 'react-router-dom';

const DoctorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const navigate = useNavigate();

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <h2>Find a Doctor</h2>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Search doctors by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
          >
            <option value="">All Specialties</option>
            <option value="general">General Physician</option>
            <option value="cardiology">Cardiologist</option>
            <option value="dermatology">Dermatologist</option>
            {/* Add more specialties */}
          </select>
        </div>
      </div>

      <DoctorList 
        searchTerm={searchTerm}
        specialtyFilter={specialtyFilter}
        onDoctorSelect={(doctorId) => navigate(`/appointments/new/${doctorId}`)}
      />
    </div>
  );
};
export default DoctorsPage;