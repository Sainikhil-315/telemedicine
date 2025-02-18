import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Pagination, Form, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAllDoctors, searchDoctors } from '../api/doctors';
import { formatCurrency } from '../utils';

const DoctorList = ({ specialty = '', location = '' }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    specialty: specialty || '',
    location: location || '',
    sortBy: 'rating',
    availability: false
  });
  
  const pageSize = 6;
  
  useEffect(() => {
    fetchDoctors();
  }, [page, filters]);
  
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await searchDoctors({
        ...filters,
        page,
        limit: pageSize
      });
      
      setDoctors(response.doctors);
      setTotalPages(Math.ceil(response.total / pageSize));
    } catch (err) {
      setError('Failed to fetch doctors. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
    setPage(1); // Reset to first page on filter change
  };
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <Pagination className="justify-content-center mt-4">
        <Pagination.Prev
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        />
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <Pagination.Item
            key={pageNum}
            active={pageNum === page}
            onClick={() => handlePageChange(pageNum)}
          >
            {pageNum}
          </Pagination.Item>
        ))}
        
        <Pagination.Next
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        />
      </Pagination>
    );
  };
  
  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    return (
      <div className="text-warning d-inline-flex align-items-center">
        {[...Array(5)].map((_, i) => (
          <i
            key={i}
            className={`${
              i < fullStars
                ? 'fas fa-star'
                : i === fullStars && hasHalfStar
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
            } fa-sm me-1`}
          ></i>
        ))}
        <span className="text-dark ms-1">({rating.toFixed(1)})</span>
      </div>
    );
  };
  
  return (
    <div className="doctor-list">
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="mb-3">Filter Results</h5>
              <Form>
                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3" controlId="specialty">
                      <Form.Label>Specialty</Form.Label>
                      <Form.Select
                        name="specialty"
                        value={filters.specialty}
                        onChange={handleFilterChange}
                      >
                        <option value="">All Specialties</option>
                        <option value="general-physician">General Physician</option>
                        <option value="cardiologist">Cardiologist</option>
                        <option value="dermatologist">Dermatologist</option>
                        <option value="neurologist">Neurologist</option>
                        <option value="psychiatrist">Psychiatrist</option>
                        <option value="pediatrician">Pediatrician</option>
                        <option value="orthopedic">Orthopedic</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Group className="mb-3" controlId="location">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        placeholder="City or ZIP code"
                        value={filters.location}
                        onChange={handleFilterChange}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Group className="mb-3" controlId="sortBy">
                      <Form.Label>Sort By</Form.Label>
                      <Form.Select
                        name="sortBy"
                        value={filters.sortBy}
                        onChange={handleFilterChange}
                      >
                        <option value="rating">Highest Rated</option>
                        <option value="experience">Most Experienced</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={3} className="d-flex align-items-end">
                    <Form.Group className="mb-3 w-100" controlId="availability">
                      <Form.Check
                        type="checkbox"
                        name="availability"
                        label="Available Today"
                        checked={filters.availability}
                        onChange={handleFilterChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
export default DoctorList;