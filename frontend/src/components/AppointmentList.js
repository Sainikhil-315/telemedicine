import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Clock, User, Video, MapPin } from 'lucide-react';

const AppointmentList = ({ limit, filter = 'upcoming' }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    /*eslint-disable*/
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        console.log(token);
        // Fixed URL with proper protocol and slash
        const response = await fetch(`http://localhost:5000/api/appointments`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Session expired. Please login again.');
          }
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || 'Failed to fetch appointments');
        }
    
        const data = await response.json();
        setAppointments(data.data || []);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      scheduled: 'bg-blue-500',
      confirmed: 'bg-green-500',
      completed: 'bg-purple-500',
      cancelled: 'bg-red-500',
      'no-show': 'bg-yellow-500'
    };
    return `inline-block px-2 py-1 text-xs font-semibold text-white rounded-full ${statusClasses[status] || 'bg-gray-500'}`;
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to cancel appointment');
      }

      setAppointments(appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
      ));
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg" role="alert">
        Error loading appointments: {error}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">No appointments found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="bg-white rounded-lg shadow-sm border p-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-2 text-center">
              <div className="text-lg font-semibold">
                {format(new Date(appointment.date), 'MMM dd')}
              </div>
              <div className="text-sm text-gray-500">
                {format(new Date(appointment.date), 'yyyy')}
              </div>
            </div>
            
            <div className="md:col-span-5">
              <h5 className="flex items-center text-lg font-semibold mb-1">
                <User className="mr-2" size={16} />
                Dr. {appointment.doctorName}
              </h5>
              <p className="text-gray-600 mb-0">
                {appointment.specialty}
              </p>
              <div className="flex items-center text-gray-500 mt-1">
                <Clock className="mr-1" size={14} />
                {format(new Date(appointment.date), 'hh:mm a')}
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="flex items-center mb-2">
                <Video className="mr-2" size={16} />
                <span className="text-gray-600">
                  {/* {appointment.type === 'video' ? 'Video Consultation' : 'In-person Visit'} */}
                  In-person Visit
                </span>
              </div>
              {appointment.location && (
                <div className="flex items-center">
                  <MapPin className="mr-2" size={16} />
                  <span className="text-gray-600">{appointment.location}</span>
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex flex-col items-end space-y-2">
              <span className={getStatusBadgeClass(appointment.status)}>
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </span>
              
              {appointment.status === 'scheduled' && (
                <div className="flex space-x-2">
                  <button 
                    className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50"
                    onClick={() => handleCancelAppointment(appointment.id)}
                  >
                    Cancel
                  </button>
                  {appointment.type === 'video' && (
                    <a 
                      href={appointment.videoLink} 
                      className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
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
      ))}
    </div>
  );
};

export default AppointmentList;