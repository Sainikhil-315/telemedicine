import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Clock, User, Video, MapPin } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { doctorsAPI } from '../api/doctors';
import { appointmentsAPI } from '../api/appointments';
import { Modal } from 'react-bootstrap';

const AppointmentList = ({ onBookAppointment }) => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editType, setEditType] = useState('');

  useEffect(() => {
    fetchAppointmentsAndDoctors();
  }, []);

  const fetchAppointmentsAndDoctors = async () => {
    try {
      setLoading(true);
      
      const [appointmentsRes, doctorsRes] = await Promise.all([
        appointmentsAPI.getUserAppointments(),
        doctorsAPI.getAllDoctors()
      ]);
      
      const doctorsMap = doctorsRes.data.reduce((acc, doctor) => {
        acc[doctor._id] = doctor;
        return acc;
      }, {});

      const updatedAppointments = appointmentsRes.data.map(appointment => ({
        ...appointment,
        doctor: doctorsMap[appointment.doctorId] || {}
      }));
      
      setAppointments(updatedAppointments);
      setDoctors(doctorsRes.data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await appointmentsAPI.cancelAppointment(appointmentId);
      setAppointments(prevAppointments =>
        prevAppointments.map(apt =>
          apt._id === appointmentId ? { ...apt, status: 'cancelled' } : apt
        )
      );
      // Show success toast or message
      alert('Appointment cancelled successfully');
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      alert(err.message);
    }
  };

  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);
    setEditType(appointment.type);
    setShowEditModal(true);
  };

  const handleUpdateAppointment = async () => {
    try {
      if (!selectedAppointment) return;

      // Update the appointment type
      await appointmentsAPI.rescheduleAppointment(selectedAppointment._id, {
        ...selectedAppointment,
        type: editType
      });

      // Update local state
      setAppointments(prevAppointments =>
        prevAppointments.map(apt =>
          apt._id === selectedAppointment._id ? { ...apt, type: editType } : apt
        )
      );

      setShowEditModal(false);
      alert('Appointment updated successfully');
    } catch (err) {
      console.error('Error updating appointment:', err);
      alert(err.message);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-primary';
      case 'confirmed':
        return 'bg-success';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-4">
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
  console.log("Appointments: ",appointments);
  return (
    <>
      <div className="container">
        {appointments.map((appointment) => (
          <div key={appointment._id} className="card mb-3 shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-2 text-center">
                  <div className="h4 mb-0">{format(new Date(appointment.date), 'MMM dd')}</div>
                  <div className="text-muted">{format(new Date(appointment.date), 'yyyy')}</div>
                </div>
                
                <div className="col-md-4">
                  <h5 className="d-flex align-items-center mb-1">
                    <User className="me-2" size={16} />
                    Dr. {appointment.doctor.name || 'Unknown'}
                  </h5>
                  <p className="text-muted mb-0">{appointment.doctor.specialty || 'Specialty not available'}</p>
                  <div className="d-flex align-items-center text-muted mt-1">
                    <Clock className="me-1" size={14} />
                    {appointment.startTime}
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

                <div className="col-md-3">
                  <div className="d-flex justify-content-end align-items-center">
                    <span className={`badge ${getStatusBadgeClass(appointment.status)} me-2`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                    
                    {appointment.status === 'scheduled' && (
                      <div className="btn-group">
                        <button 
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => handleEditClick(appointment)}
                        >
                          <FontAwesomeIcon icon={faEdit} className="me-1" />
                          Edit
                        </button>
                        <button 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleCancelAppointment(appointment._id)}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} className="me-1" />
                          Cancel
                        </button>
                      </div>
                    )}
                    
                    {appointment.type === 'video' && appointment.videoLink && (
                      <a 
                        href={appointment.videoLink}
                        className="btn btn-primary btn-sm ms-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Join
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label className="form-label">Appointment Type</label>
            <div className="d-flex gap-3">
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  id="video"
                  value="video"
                  checked={editType === 'video'}
                  onChange={(e) => setEditType(e.target.value)}
                />
                <label className="form-check-label" htmlFor="video">
                  Video Consultation
                </label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  id="in-person"
                  value="in-person"
                  checked={editType === 'in-person'}
                  onChange={(e) => setEditType(e.target.value)}
                />
                <label className="form-check-label" htmlFor="in-person">
                  In-Person Visit
                </label>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowEditModal(false)}
          >
            <FontAwesomeIcon icon={faTimesCircle} className="me-1" />
            Cancel
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleUpdateAppointment}
          >
            <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
            Update
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AppointmentList;