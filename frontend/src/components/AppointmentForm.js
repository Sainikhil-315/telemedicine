import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import {
  appointmentsAPI
} from '../api/appointments';

const AppointmentForm = ({ doctorId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    doctor: doctorId,
    date: '',
    startTime: '',
    endTime: '',
    type: 'in-person',
    symptoms: '',
    notes: '',
  });
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await fetch(`/api/doctors/${doctorId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setDoctorDetails(data);
      } catch (err) {
        setError('Failed to load doctor details');
        console.error(err);
      }
    };

    if (doctorId) {
      fetchDoctorDetails();
    }
  }, [doctorId]);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!formData.date || !doctorId) return;
      
      try {
        const response = await fetch(
          `/api/doctors/${doctorId}/availability?date=${formData.date}`
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        
        // Transform slots into start and end times
        const formattedSlots = data.map(slot => ({
          startTime: slot.split('-')[0],
          endTime: slot.split('-')[1]
        }));
        
        setAvailableSlots(formattedSlots);
      } catch (err) {
        setError('Failed to load available time slots');
        console.error(err);
      }
    };

    fetchAvailableSlots();
  }, [formData.date, doctorId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTimeSlotSelect = (slot) => {
    setFormData(prev => ({
      ...prev,
      startTime: slot.startTime,
      endTime: slot.endTime
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await appointmentsAPI.createAppointment(formData);
      navigate('/appointments', { 
        state: { 
          message: 'Appointment scheduled successfully',
          appointmentId: response.data._id 
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule appointment');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Exclude weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date);
      }
    }
    
    return dates;
  };

  return (
    <div className="container py-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        {error && (
          <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
            <AlertCircle className="me-2" size={20} />
            {error}
          </div>
        )}

        {doctorDetails && (
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Doctor Details</h5>
            </div>
            <div className="card-body">
              <div className="mb-2">
                <strong>Name:</strong> Dr. {doctorDetails.name}
              </div>
              <div className="mb-2">
                <strong>Specialty:</strong> {doctorDetails.specialty}
              </div>
              <div>
                <strong>Consultation Fee:</strong> ${doctorDetails.consultationFee}
              </div>
            </div>
          </div>
        )}

        <div className="row mb-4">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label d-flex align-items-center">
                <Calendar className="me-2" size={18} />
                Select Date
              </label>
              <select
                className="form-select"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
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
          </div>

          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label d-flex align-items-center">
                <Clock className="me-2" size={18} />
                Select Time Slot
              </label>
              <select
                className="form-select"
                name="timeSlot"
                value={`${formData.startTime}-${formData.endTime}`}
                onChange={(e) => {
                  const [start, end] = e.target.value.split('-');
                  handleTimeSlotSelect({ startTime: start, endTime: end });
                }}
                required
                disabled={!formData.date || availableSlots.length === 0}
              >
                <option value="">Choose a time</option>
                {availableSlots.map((slot) => (
                  <option 
                    key={`${slot.startTime}-${slot.endTime}`} 
                    value={`${slot.startTime}-${slot.endTime}`}
                  >
                    {new Date(`2000-01-01T${slot.startTime}`).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                    })}
                    {' - '}
                    {new Date(`2000-01-01T${slot.endTime}`).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                    })}
                  </option>
                ))}
              </select>
            </div>
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
                  name="type"
                  value="video"
                  checked={formData.type === 'video'}
                  onChange={handleInputChange}
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
                  id="in-person"
                  name="type"
                  value="in-person"
                  checked={formData.type === 'in-person'}
                  onChange={handleInputChange}
                />
                <label className="form-check-label" htmlFor="in-person">
                  In-Person Visit
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Symptoms</label>
          <textarea
            className="form-control"
            name="symptoms"
            value={formData.symptoms}
            onChange={handleInputChange}
            placeholder="Please describe your symptoms in detail"
            required
            rows={4}
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Additional Notes</label>
          <textarea
            className="form-control"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Any additional information you'd like to share"
            rows={3}
          />
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary d-flex align-items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                <span>Scheduling...</span>
              </>
            ) : (
                <span>Schedule</span>
              
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;