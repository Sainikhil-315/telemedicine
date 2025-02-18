// AppointmentForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';

const AppointmentForm = ({ doctorId, onSubmit, onCancel }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('video');
  const [reason, setReason] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (!doctorId) return;
      
      try {
        const response = await fetch(`/api/doctors/${doctorId}`);
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message);
        
        setDoctor(data);
      } catch (err) {
        setError('Failed to load doctor details');
        console.error(err);
      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDate || !doctorId) return;
      
      try {
        const response = await fetch(
          `/api/doctors/${doctorId}/availability?date=${selectedDate}`
        );
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message);
        
        setAvailableSlots(data);
      } catch (err) {
        setError('Failed to load available time slots');
        console.error(err);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate, doctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const appointmentData = {
        doctorId,
        date: `${selectedDate}T${selectedTime}`,
        type: appointmentType,
        reason,
        symptoms,
      };

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      onSubmit && onSubmit(data);
      navigate('/appointments');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get next 7 days for date selection
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  return (
    <form onSubmit={handleSubmit} className="appointment-form">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {doctor && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Doctor Details</h5>
            <p className="card-text">
              <strong>Name:</strong> Dr. {doctor.name}<br />
              <strong>Specialty:</strong> {doctor.specialty}<br />
              <strong>Consultation Fee:</strong> ${doctor.consultationFee}
            </p>
          </div>
        </div>
      )}

      <div className="row mb-4">
        <div className="col-md-6">
          <label className="form-label">
            <Calendar className="me-2" size={16} />
            Select Date
          </label>
          <select 
            className="form-select"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
          >
            <option value="">Choose a date</option>
            {getAvailableDates().map((date) => (
              <option 
                key={date.toISOString()} 
                value={date.toISOString().split('T')[0]}
              >
                {date.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">
            <Clock className="me-2" size={16} />
            Select Time
          </label>
          <select 
            className="form-select"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            required
            disabled={!selectedDate || availableSlots.length === 0}
          >
            <option value="">Choose a time</option>
            {availableSlots.map((slot) => (
              <option key={slot} value={slot}>
                {new Date(`2000-01-01T${slot}`).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true
                })}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="form-label">Appointment Type</label>
        <div className="row">
          <div className="col-md-6">
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                id="video"
                name="appointmentType"
                value="video"
                checked={appointmentType === 'video'}
                onChange={(e) => setAppointmentType(e.target.value)}
                required
              />
              <label className="form-check-label" htmlFor="video">
                Video Consultation
              </label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                id="inPerson"
                name="appointmentType"
                value="in-person"
                checked={appointmentType === 'in-person'}
                onChange={(e) => setAppointmentType(e.target.value)}
              />
              <label className="form-check-label" htmlFor="inPerson">
                In-Person Visit
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="form-label">Reason for Visit</label>
        <input
          type="text"
          className="form-control"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Brief description of your visit reason"
          required
        />
      </div>

      <div className="mb-4">
        <label className="form-label">Symptoms</label>
        <textarea
          className="form-control"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows="3"
          placeholder="Please describe your symptoms in detail"
          required
        ></textarea>
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Scheduling...
            </>
          ) : (
            'Schedule Appointment'
          )}
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;