import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  const menuItems = [
    {
      path: '/dashboard',
      icon: 'fas fa-home',
      label: 'Dashboard'
    },
    {
      path: '/appointments',
      icon: 'fas fa-calendar-alt',
      label: 'My Appointments'
    },
    {
      path: '/doctors',
      icon: 'fas fa-user-md',
      label: 'Find Doctors'
    },
    {
      path: '/chat',
      icon: 'fas fa-comment-medical',
      label: 'Chat & Assessments'
    },
    {
      path: '/profile',
      icon: 'fas fa-user-circle',
      label: 'My Profile'
    }
  ];
  
  // Add doctor-specific menu items
  if (currentUser?.role === 'doctor') {
    menuItems.push(
      {
        path: '/doctor/appointments',
        icon: 'fas fa-calendar-check',
        label: 'Appointment Requests'
      },
      {
        path: '/doctor/patients',
        icon: 'fas fa-users',
        label: 'My Patients'
      },
      {
        path: '/doctor/availability',
        icon: 'fas fa-clock',
        label: 'Set Availability'
      }
    );
  }
  
  return (
    <div className="sidebar bg-white shadow-sm rounded p-3">
      <div className="d-flex align-items-center justify-content-center mb-4">
        <div className="user-profile text-center">
          {currentUser?.profilePicture ? (
            <img
              src={currentUser.profilePicture}
              alt="User"
              className="rounded-circle mb-2 img-thumbnail"
              width="80"
              height="80"
            />
          ) : (
            <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
              {currentUser?.name?.charAt(0)}
            </div>
          )}
          <h6 className="mb-1">{currentUser?.name}</h6>
          <p className="text-muted small mb-0">
            {currentUser?.role === 'doctor' ? 'Doctor' : 'Patient'}
          </p>
        </div>
      </div>
      
      <Nav className="flex-column">
        {menuItems.map((item) => (
          <Nav.Link
            key={item.path}
            as={Link}
            to={item.path}
            className={`d-flex align-items-center ps-3 py-3 ${
              location.pathname === item.path ? 'active bg-light rounded' : ''
            }`}
          >
            <i className={`${item.icon} me-3`}></i>
            {item.label}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;