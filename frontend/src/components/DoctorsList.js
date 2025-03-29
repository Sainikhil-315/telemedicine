import React from 'react';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getThemeClasses } from '../utils/themeUtils';

const DoctorList = ({ doctors, loading, onDoctorSelect }) => {
  const { darkMode } = useAuth();
  const theme = getThemeClasses(darkMode);

  if (loading) {
    return (
      <div className={`text-center py-5 ${theme.text}`}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!doctors.length) {
    return (
      <div className={`text-center py-5 ${theme.text}`}>
        <h4>No doctors found matching your criteria</h4>
        <p className={darkMode ? 'text-secondary' : 'text-muted'}>Try adjusting your search or filters</p>
      </div>
    );
  }

  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fas fa-star ${i <= rating ? 'text-warning' : darkMode ? 'text-secondary' : 'text-muted'}`}
        ></i>
      );
    }
    return stars;
  };

  return (
    <Row className="g-4">
      {doctors.map((doctor) => (
        <Col key={doctor._id} xs={12} md={6} lg={4}>
          <Card className={`h-100 shadow-sm hover-shadow ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}>
            <Card.Body>
              <div className="d-flex mb-3">
                <div className="flex-shrink-0">
                  <img
                    src={doctor.imageUrl || 'https://th.bing.com/th/id/OIP.L6V0OaJPJC-q8jM_5enilQHaHw?w=189&h=197&c=7&r=0&o=5&dpr=1.5&pid=1.7'}
                    alt={doctor.name}
                    className="rounded-circle"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5 className="mb-1">{doctor.name}</h5>
                  <p className={`mb-1 ${darkMode ? 'text-secondary' : 'text-muted'}`}>{doctor.specialty}</p>
                  <div className="mb-1">
                    {renderStarRating(doctor.rating)}
                    <span className={`ms-2 ${darkMode ? 'text-secondary' : 'text-muted'}`}>({doctor.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <p className="mb-2">
                  <i className="fas fa-graduation-cap me-2 text-primary"></i>
                  {doctor.qualifications}
                </p>
                <p className="mb-2">
                  <i className="fas fa-hospital me-2 text-primary"></i>
                  {doctor.hospital}
                </p>
                <p className="mb-2">
                  <i className="fas fa-briefcase me-2 text-primary"></i>
                  {doctor.experience} years experience
                </p>
              </div>

              <div className="mb-3">
                <Badge bg="info" className="me-2">
                  ${doctor.consultationFee} / visit
                </Badge>
                {doctor.availableToday && (
                  <Badge bg="success">Available Today</Badge>
                )}
              </div>

              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  onClick={() => onDoctorSelect(doctor._id)}
                >
                  Book Appointment
                </Button>
                <Link
                  to={`/doctors/${doctor._id}`}
                  className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-secondary'}`}
                >
                  View Profile
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default DoctorList;