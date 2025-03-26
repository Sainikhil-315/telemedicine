import React, { useState, useEffect, useContext } from 'react';
import { Calendar, Clock, AlertCircle, UserRound, Stethoscope, IndianRupee } from 'lucide-react';
import { doctorsAPI } from '../api/doctors';
import { appointmentsAPI } from '../api/appointments';
import { useAuth } from '../context/AuthContext';

const AppointmentForm = ({ doctorId, onSubmit, onCancel }) => {
  const { darkMode } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  
  const [formData, setFormData] = useState({
    doctor: doctorId,
    date: '',
    startTime: '',
    endTime: '',
    type: 'in-person',
    symptoms: '',
    notes: '',
    status: 'scheduled',
    paymentStatus: 'pending'
  });

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await doctorsAPI.getDoctorById(doctorId);
        setDoctorDetails(response.data);
      } catch (err) {
        setError('Failed to load doctor details');
      }
    };

    if (doctorId) {
      fetchDoctorDetails();
    }
  }, [doctorId]);

  const getAvailableDates = () => {
    if (!doctorDetails?.availability) return [];
    
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.getDay() || 7; // Convert Sunday from 0 to 7
      
      // Check if doctor is available on this day
      const isDoctorAvailable = doctorDetails.availability.some(
        slot => slot.dayOfWeek === dayOfWeek
      );
      
      if (isDoctorAvailable) {
        dates.push(date);
      }
    }
    
    return dates;
  };

  const generateTimeSlots = (date) => {
    if (!date || !doctorDetails?.availability) return [];
    
    const selectedDay = new Date(date).getDay() || 7; // Convert Sunday from 0 to 7
    const doctorSlot = doctorDetails.availability.find(
      slot => slot.dayOfWeek === selectedDay
    );
    
    if (!doctorSlot) return [];

    const slots = [];
    const [startHour, startMinute] = doctorSlot.startTime.split(':').map(Number);
    const [endHour, endMinute] = doctorSlot.endTime.split(':').map(Number);
    
    const startTime = new Date();
    startTime.setHours(startHour, startMinute, 0);
    
    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0);

    while (startTime < endTime) {
      const slotStart = startTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      startTime.setMinutes(startTime.getMinutes() + 30);
      const slotEnd = startTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      slots.push({
        startTime: slotStart,
        endTime: slotEnd
      });
    }

    return slots;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFormData(prev => ({
      ...prev,
      date,
      startTime: '',
      endTime: ''
    }));
    const slots = generateTimeSlots(date);
    setAvailableSlots(slots);
  };

  const handleTimeSlotSelect = (value) => {
    const [start, end] = value.split('-');
    setFormData(prev => ({
      ...prev,
      startTime: start,
      endTime: end
    }));
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await appointmentsAPI.createAppointment(formData);
      setSuccess(true);
      if (onSubmit) {
        onSubmit(formData);
      }
    } catch (err) {
      setError('No time slot available at that time');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  return (
    <div className="container py-4">
      <form onSubmit={handleSubmit} className="card">
        <div className="card-body">
          {error && (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <AlertCircle className="me-2" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success" role="alert">
              Appointment scheduled successfully!
            </div>
          )}

          {doctorDetails && (
            <div className="card mb-4">
              <div className="card-header">
                <h3 className="mb-0 d-flex align-items-center">
                  <UserRound className="me-2" />
                  Doctor Details
                </h3>
              </div>
              <div className="card-body">
                <div className="d-flex mb-2">
                  <Stethoscope className="me-2" />
                  <span className="fw-bold">Dr. {doctorDetails.name}</span>
                </div>
                <div className="d-flex mb-2">
                  <UserRound className="me-2" />
                  <span>{doctorDetails.specialty}</span>
                </div>
                <div className="d-flex">
                  <IndianRupee className="me-2" />
                  <span>{doctorDetails.consultationFee}</span>
                </div>
              </div>
            </div>
          )}

          <div className="row mb-4">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label d-flex align-items-center">
                  <Calendar className="me-2" />
                  Select Date
                </label>
                <select
                  className="form-select"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
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
              <div className="form-group">
                <label className="form-label d-flex align-items-center">
                  <Clock className="me-2" />
                  Select Time Slot
                </label>
                <select
                  className="form-select"
                  value={formData.startTime && formData.endTime ? `${formData.startTime}-${formData.endTime}` : ''}
                  onChange={(e) => handleTimeSlotSelect(e.target.value)}
                  required
                  disabled={!selectedDate}
                >
                  <option value="">
                    {selectedDate ? 'Choose a time' : 'Select a date first'}
                  </option>
                  {availableSlots.map((slot) => (
                    <option
                      key={`${slot.startTime}-${slot.endTime}`}
                      value={`${slot.startTime}-${slot.endTime}`}
                    >
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
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
                    id="video"
                    name="type"
                    value="video"
                    checked={formData.type === 'video'}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="form-check-input"
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
                    id="in-person"
                    name="type"
                    value="in-person"
                    checked={formData.type === 'in-person'}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="form-check-input"
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
              value={formData.symptoms}
              onChange={(e) => handleInputChange('symptoms', e.target.value)}
              placeholder="Please describe your symptoms in detail"
              rows="4"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Additional Notes</label>
            <textarea
              className="form-control"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional information you'd like to share"
              rows="3"
            />
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary d-flex align-items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>Scheduling...</span>
                </>
              ) : (
                <span>Schedule Appointment</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;