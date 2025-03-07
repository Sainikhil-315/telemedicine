// DashboardPage.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AppointmentList from '../components/AppointmentList';

const DashboardPage = () => {
  const { user, darkMode } = useAuth();
  const [stats, ] = useState({
    upcomingAppointments: 0,
    completedAppointments: 0,
    notifications: 0
  });

  useEffect(() => {
    /*eslint-disable */
    // Fetch dashboard stats
    // Implementation depends on your API
  }, []);

  return (
    <div className={`container-fluid py-4 bg-${darkMode ? 'dark' : 'light'}`}>
      <h2 className={`mb-4 text-${darkMode? "light":"dark"}`}>Welcome back, {user?.name}</h2>
      
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Upcoming Appointments</h5>
              <p className="card-text display-6">{stats.upcomingAppointments}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Completed Consultations</h5>
              <p className="card-text display-6">{stats.completedAppointments}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">New Notifications</h5>
              <p className="card-text display-6">{stats.notifications}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className={`card border-${darkMode? "light" : "dark"}`}>
            <div className={`card-header bg-${darkMode? "dark" : "light"}`}>
              <h5 className={`card-title mb-0 text-${darkMode? "light" : "dark"}`}>Recent Appointments</h5>
            </div>
            <div className={`card-body bg-${darkMode? "dark" : "light"}`}>
              <AppointmentList limit={5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;