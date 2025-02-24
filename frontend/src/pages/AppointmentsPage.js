import React, { useState, useEffect } from 'react';
import AppointmentList from '../components/AppointmentList';
import AppointmentForm from '../components/AppointmentForm';
import { doctorsAPI } from '../api/doctors';
import { Link } from 'react-router-dom';

const AppointmentsPage = (props) => {
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorsAPI.getAllDoctors();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleBookAppointment = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setShowNewAppointment(true);
  };

  const handleCancel = () => {
    setShowNewAppointment(false);
    setSelectedDoctorId(null);
  };
  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-md-8">
          <h2>My Appointments</h2>
        </div>
        <div className="col-md-4 text-end">
          <button
            className="btn btn-primary"
            onClick={() => {
              setSelectedDoctorId(null);
              setShowNewAppointment(true);
            }}
          >
            <Link className='text-light text-decoration-none' to='/doctors'>Schedule New Appointment</Link>
          </button>
        </div>
      </div>

      {showNewAppointment && (
        <div className="row mb-4">
          <div className="col">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Schedule Appointment</h5>
              </div>
              <div className="card-body">
                <AppointmentForm 
                  doctorId={props.doctorId}
                  onSubmit={handleBookAppointment}
                  onCancel={handleCancel}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <a className="nav-link active" href="#upcoming">Upcoming</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#past">Past</a>
                </li>
              </ul>
            </div>
            <div className="card-body">
              <AppointmentList doctors={doctors} onBookAppointment={handleBookAppointment} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
