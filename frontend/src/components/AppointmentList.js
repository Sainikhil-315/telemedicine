// AppointmentList.js
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, User, Video, MapPin } from 'lucide-react';

const AppointmentList = ({ limit, filter = 'upcoming' }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        // Replace with your actual API call
        const response = await fetch(`/api/appointments?filter=${filter}&limit=${limit}`);
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message);
        
        setAppointments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [filter, limit]);

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      scheduled: 'bg-primary',
      confirmed: 'bg-success',
      completed: 'bg-info',
      cancelled: 'bg-danger',
      'no-show': 'bg-warning'
    };
    return `badge ${statusClasses[status] || 'bg-secondary'}`;
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (!response.ok) throw new Error('Failed to cancel appointment');

      // Update local state
      setAppointments(appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
      ));
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      alert('Failed to cancel appointment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error loading appointments: {error}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted">No appointments found.</p>
      </div>
    );
  }

  return (
    <div className="appointment-list">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="card mb-3">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-2">
                <div className="text-center mb-3 mb-md-0">
                  <div className="h5 mb-0">
                    {format(new Date(appointment.date), 'MMM dd')}
                  </div>
                  <div className="small text-muted">
                    {format(new Date(appointment.date), 'yyyy')}
                  </div>
                </div>
              </div>
              
              <div className="col-md-5">
                <h5 className="card-title mb-1">
                  <User className="me-2" size={16} />
                  Dr. {appointment.doctorName}
                </h5>
                <p className="card-text text-muted mb-0">
                  {appointment.specialty}
                </p>
                <div className="small text-muted mt-1">
                  <Clock className="me-1" size={14} />
                  {format(new Date(appointment.date), 'hh:mm a')}
                </div>
              </div>

              <div className="col-md-3">
                <div className="d-flex align-items-center mb-2">
                  <Video className="me-2" size={16} />
                  <span className="text-muted">
                    {appointment.type === 'video' ? 'Video Consultation' : 'In-person Visit'}
                  </span>
                </div>
                {appointment.location && (
                  <div className="d-flex align-items-center">
                    <MapPin className="me-2" size={16} />
                    <span className="text-muted">{appointment.location}</span>
                  </div>
                )}
              </div>

              <div className="col-md-2 text-md-end mt-3 mt-md-0">
                <span className={`${getStatusBadgeClass(appointment.status)} mb-2 d-block`}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
                
                {appointment.status === 'scheduled' && (
                  <div className="btn-group">
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleCancelAppointment(appointment.id)}
                    >
                      Cancel
                    </button>
                    {appointment.type === 'video' && (
                      <a 
                        href={appointment.videoLink} 
                        className="btn btn-sm btn-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Join
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default AppointmentList;