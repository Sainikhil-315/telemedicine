import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DoctorList from '../components/DoctorsList';
import { doctorsAPI } from '../api/doctors'; // Import getAllDoctors

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    specialty: '',
    // sortBy: 'rating'
  });

  const navigate = useNavigate();

  useEffect(() => {
    /*eslint-disable*/
    fetchDoctors();
  }, [filters]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      // If no filters are specified, get all doctors
      let response;
      if (!filters.searchTerm && !filters.specialty) {
        response = await doctorsAPI.getAllDoctors();
        console.log("response if no filters ",response);
      } else {
        response = await doctorsAPI.searchDoctors({
          name: filters.searchTerm,
          specialty: filters.specialty,
          // sortBy: filters.sortBy
        },console.log("response if filter applied: ",response));
      }
      setDoctors(response.data || []);
      console.log("Doctors in response: ", doctors)
      setError(null);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to fetch doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDoctorSelect = (doctorId) => {
    navigate(`/appointment/${doctorId}`);
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-4">Find a Doctor</h2>
          <Row className="g-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  name="searchTerm"
                  placeholder="Search doctors by name..."
                  value={filters.searchTerm}
                  onChange={handleFilterChange}
                />
              </InputGroup>
            </Col>

            <Col md={3}>
              <Form.Select
                name="specialty"
                value={filters.specialty}
                onChange={handleFilterChange}
              >
                <option value="">All Specialties</option>
                <option value="General Physician">General Physician</option>
                <option value="cardiologist">Cardiologist</option>
                <option value="dermatologist">Dermatologist</option>
                <option value="neurologist">Neurologist</option>
                <option value="psychiatrist">Psychiatrist</option>
                <option value="pediatrician">Pediatrician</option>
                <option value="orthopedic">Orthopedic</option>
              </Form.Select>
            </Col>

            <Col md={3}>
              {/* <Form.Select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
              >
                <option value="rating">Highest Rated</option>
                <option value="experience">Most Experienced</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </Form.Select> */}
            </Col>
          </Row>
        </Col>
      </Row>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <DoctorList
        doctors={doctors}
        loading={loading}
        onDoctorSelect={handleDoctorSelect}
      />
    </Container>
  );
};

export default DoctorsPage;
