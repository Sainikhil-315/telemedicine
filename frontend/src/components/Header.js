import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, logout, darkMode, setDarkMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleToggleChange = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Navbar bg={`${darkMode ? "black" : "white"}`} expand="lg" fixed="top" className={`shadow-sm ${darkMode ? "navbar-dark" : "navbar-light"}`}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <i className={`fas fa-heartbeat me-2 ${darkMode ? "text-light" : "text-primary"}`}></i>
          <span className={`fw-bold ${darkMode ? "text-light" : "text-dark"}`}>TeleMed Connect</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/"
              className={`${location.pathname === '/' ? 'active' : ''} ${darkMode ? "text-light" : "text-dark"}`}
            >
              Home
            </Nav.Link>

            {isAuthenticated && (
              <>
                <Nav.Link
                  as={Link}
                  to="/dashboard"
                  className={`${location.pathname === '/dashboard' ? 'active' : ''} ${darkMode ? "text-light" : "text-dark"}`}
                >
                  Dashboard
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/doctors"
                  className={`${location.pathname === '/doctors' ? 'active' : ''} ${darkMode ? "text-light" : "text-dark"}`}
                >
                  Find Doctors
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/appointments"
                  className={`${location.pathname === '/appointments' ? 'active' : ''} ${darkMode ? "text-light" : "text-dark"}`}
                >
                  My Appointments
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/chat"
                  className={`${location.pathname === '/chat' ? 'active' : ''} ${darkMode ? "text-light" : "text-dark"}`}
                >
                  Chat & Assessment
                </Nav.Link>
              </>
            )}
          </Nav>

          <Nav>
            <div className="form-check form-switch me-4 mt-0.5">
              <input
                className="form-check-input"
                type="checkbox"
                id="flexSwitchCheckDefault"
                checked={darkMode}
                onChange={handleToggleChange}
              />
              <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                {darkMode ? (<i className="fa-solid fa-sun" style={{ color: "white" }}></i>
                ) : (<i className="fa-solid fa-moon"></i>)}
              </label>
            </div>
            {isAuthenticated ? (
              <Dropdown>
                <Dropdown.Toggle variant="light" id="profile-dropdown" className="d-flex align-items-center">
                  <i className="fa-solid fa-address-card"></i>
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
