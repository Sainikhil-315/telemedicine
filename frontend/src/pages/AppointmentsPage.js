import React, { useState, useEffect } from 'react';
import AppointmentList from '../components/AppointmentList';
import AppointmentForm from '../components/AppointmentForm';
import { doctorsAPI } from '../api/doctors';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAfter, isBefore } from 'date-fns';

const AppointmentsPage = (props) => {
  const { darkMode } = useAuth();
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [, setSelectedDoctorId] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState({
    upcoming: [],
    past: []
  });

  useEffect(() => {
    /*eslint-disable */
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

  useEffect(() => {
    // Filter appointments when appointments or activeTab changes
    if (appointments.length > 0) {
      const now = new Date();
      const upcomingAppts = appointments.filter(apt => 
        (isAfter(new Date(apt.date), now) || 
         (new Date(apt.date).toDateString() === now.toDateString())) && 
        apt.status !== 'cancelled'
      );

      const pastAppts = appointments.filter(apt => 
        isBefore(new Date(apt.date), now) && 
        apt.status !== 'cancelled'
      );

      setFilteredAppointments({
        upcoming: upcomingAppts,
        past: pastAppts
      });
    }
  }, [appointments]);

  const handleBookAppointment = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setShowNewAppointment(true);
  };

  const handleCancel = () => {
    setShowNewAppointment(false);
    setSelectedDoctorId(null);
  };

  const handleAppointmentsFetched = (fetchedAppointments) => {
    setAppointments(fetchedAppointments);
  };

  return (
    <div className={`container-fluid py-4 bg-${darkMode? "dark":"light"} text-${darkMode? "light":"dark"}`}>
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
            <div className={`card-header bg-${darkMode? "dark":"light"}`}>
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <a 
                    className={`nav-link ${activeTab === 'upcoming' ? 'active' : ''}`} 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('upcoming');
                    }}
                  >
                    Upcoming ({filteredAppointments.upcoming.length})
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    className={`nav-link ${activeTab === 'past' ? 'active' : ''}`} 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('past');
                    }}
                  >
                    Past ({filteredAppointments.past.length})
                  </a>
                </li>
              </ul>
            </div>
            <div className={`card-body bg-${darkMode? "dark":"light"} text-${darkMode? "light":"dark"}`}>
              <AppointmentList 
                doctors={doctors} 
                onBookAppointment={handleBookAppointment}
                onAppointmentsFetched={handleAppointmentsFetched}
                filterStatus={activeTab === 'upcoming' ? 'upcoming' : 'past'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;