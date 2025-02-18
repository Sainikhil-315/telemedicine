import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="mb-3 mb-md-0">
            <h5 className="d-flex align-items-center mb-3">
              <i className="fas fa-heartbeat me-2"></i>
              TeleMed Connect
            </h5>
            <p className="mb-0 small">
              Connecting patients with healthcare professionals through secure virtual consultations.
            </p>
          </Col>
          
          <Col md={3} className="mb-3 mb-md-0">
            <h6 className="mb-3">Quick Links</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <Link to="/" className="text-light text-decoration-none">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/doctors" className="text-light text-decoration-none">Find Doctors</Link>
              </li>
              <li className="mb-2">
                <Link to="/chat" className="text-light text-decoration-none">Symptom Assessment</Link>
              </li>
              <li>
                <Link to="/auth" className="text-light text-decoration-none">Login/Register</Link>
              </li>
            </ul>
          </Col>
          
          <Col md={3}>
            <h6 className="mb-3">Contact Us</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <i className="fas fa-envelope me-2"></i>
                <a href="mailto:support@telemedconnect.com" className="text-light text-decoration-none">
                  support@telemedconnect.com
                </a>
              </li>
              <li className="mb-2">
                <i className="fas fa-phone me-2"></i>
                <a href="tel:+18005551234" className="text-light text-decoration-none">
                  1-800-555-1234
                </a>
              </li>
              <li>
                <div className="d-flex mt-3">
                  <a href="https://facebook.com" className="text-light me-3" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="https://twitter.com" className="text-light me-3" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="https://instagram.com" className="text-light" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </li>
            </ul>
          </Col>
        </Row>
        
        <hr className="my-3 bg-light" />
        
        <Row>
          <Col className="text-center">
            <p className="small mb-0">
              &copy; {currentYear} TeleMed Connect. All rights reserved.
              <span className="mx-2">|</span>
              <Link to="/privacy" className="text-light text-decoration-none">Privacy Policy</Link>
              <span className="mx-2">|</span>
              <Link to="/terms" className="text-light text-decoration-none">Terms of Service</Link>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;