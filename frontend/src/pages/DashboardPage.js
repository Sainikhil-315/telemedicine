import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AppointmentList from '../components/AppointmentList';
import { appointmentsAPI } from '../api/appointments';
import { isAfter, isBefore } from 'date-fns';

const DashboardPage = () => {
  const { user, darkMode } = useAuth();
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    completedAppointments: 0,
    notifications: 0
  });
  const [ , setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointmentsAndCalculateStats = async () => {
      try {
        // Fetch all user appointments
        const response = await appointmentsAPI.getUserAppointments();
        const fetchedAppointments = response.data;
        setAppointments(fetchedAppointments);

        // Calculate stats based on current date
        const now = new Date();
        const upcomingCount = fetchedAppointments.filter(apt => 
          // Consider an appointment upcoming if its date is in the future 
          // and it's not cancelled
          isAfter(new Date(apt.date), now) && apt.status !== 'cancelled'
        ).length;

        const completedCount = fetchedAppointments.filter(apt => 
          // Consider an appointment completed if its date is in the past 
          // and it's not cancelled
          isBefore(new Date(apt.date), now) && apt.status !== 'cancelled'
        ).length;

        setStats({
          upcomingAppointments: upcomingCount,
          completedAppointments: completedCount,
          notifications: 0 // You might want to fetch this from a notifications API
        });
      } catch (error) {
        console.error('Error fetching appointments:', error);
        // Optionally set an error state or show a toast
      }
    };

    fetchAppointmentsAndCalculateStats();
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