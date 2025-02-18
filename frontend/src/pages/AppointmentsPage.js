
// AppointmentsPage.js
import React, { useState } from 'react';
import AppointmentList from '../components/AppointmentList';
import AppointmentForm from '../components/AppointmentForm';

const AppointmentsPage = () => {
  const [showNewAppointment, setShowNewAppointment] = useState(false);

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-md-8">
          <h2>My Appointments</h2>
        </div>
        <div className="col-md-4 text-end">
          <button
            className="btn btn-primary"
            onClick={() => setShowNewAppointment(true)}
          >
            Schedule New Appointment
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
                  onSubmit={() => setShowNewAppointment(false)}
                  onCancel={() => setShowNewAppointment(false)}
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
              <AppointmentList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AppointmentList;