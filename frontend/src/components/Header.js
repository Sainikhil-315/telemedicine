import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  return (
    <Navbar bg="white" expand="lg" fixed="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <i className="fas fa-heartbeat text-primary me-2"></i>
          <span className="fw-bold">TeleMed Connect</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbar-nav" />
        
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              Home
            </Nav.Link>
            
            {isAuthenticated && (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/dashboard" 
                  className={location.pathname === '/dashboard' ? 'active' : ''}
                >
                  Dashboard
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/doctors" 
                  className={location.pathname === '/doctors' ? 'active' : ''}
                >
                  Find Doctors
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/appointments" 
                  className={location.pathname === '/appointments' ? 'active' : ''}
                >
                  My Appointments
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/chat" 
                  className={location.pathname === '/chat' ? 'active' : ''}
                >
                  Chat & Assessment
                </Nav.Link>
              </>
            )}
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <Dropdown>
                <Dropdown.Toggle variant="light" id="profile-dropdown" className="d-flex align-items-center">
                  {currentUser ? (
                    <i className="fa-solid fa-address-card"></i>
                  ) : (
                    <div className="avatar rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" style={{width: '30px', height: '30px'}}>
                      {/* {getInitials(currentUser.name)} */}
                    </div>
                  )}
                  {/* <span className="d-none d-md-inline">{currentUser.name}</span> */}
                </Dropdown.Toggle>
                
                <Dropdown.Menu align="end">
                  <Dropdown.Item as={Link} to="/profile">My Profile</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button 
                as={Link} 
                to="/auth" 
                variant="primary"
                className="my-2 my-lg-0"
              >
                Login / Register
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;