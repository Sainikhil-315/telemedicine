import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isValidEmail, isStrongPassword } from '../utils';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dateOfBirth: '',
    phone: '',
    role: '',
    // Doctor specific fields
    specialty: '',
    qualifications: '',
    hospital: '',
    experience: '',
    consultationFee: '',
    imageUrl: '',
    availability: [],
    agreeToTerms: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    // Basic validation for all users
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.username.trim()) errors.username = 'Username is required';

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!isStrongPassword(formData.password)) {
      errors.password = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.gender) errors.gender = 'Please select your gender';
    if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!formData.phone) errors.phone = 'Phone number is required';
    if (!formData.role) errors.role = 'Please select your role';

    // Additional validation for doctors
    if (formData.role === 'doctor') {
      if (!formData.specialty) errors.specialty = 'Specialty is required';
      if (!formData.qualifications) errors.qualifications = 'Qualifications are required';
      if (!formData.hospital) errors.hospital = 'Hospital name is required';
      if (!formData.experience) errors.experience = 'Years of experience is required';
      if (!formData.consultationFee) errors.consultationFee = 'Consultation fee is required';
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the Terms and Privacy Policy';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        phone: formData.phone,
        role: formData.role
      };

      // Add doctor-specific fields if role is doctor
      if (formData.role === 'doctor') {
        Object.assign(userData, {
          specialty: formData.specialty,
          qualifications: formData.qualifications,
          hospital: formData.hospital,
          experience: parseInt(formData.experience),
          consultationFee: parseFloat(formData.consultationFee),
          imageUrl: formData.imageUrl,
          availability: [] // You might want to add a UI for setting availability
        });
      }

      await register(userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form">
      <h2 className="mb-4 text-center">Create Your Account</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                isInvalid={!!validationErrors.firstName}
                placeholder="Enter your first name"
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.firstName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3" controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                isInvalid={!!validationErrors.lastName}
                placeholder="Enter your last name"
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.lastName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            isInvalid={!!validationErrors.username}
            placeholder="Choose a username"
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.username}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            isInvalid={!!validationErrors.email}
            placeholder="Enter your email"
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                isInvalid={!!validationErrors.password}
                placeholder="Create a password"
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.password}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                isInvalid={!!validationErrors.confirmPassword}
                placeholder="Confirm your password"
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="gender">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                isInvalid={!!validationErrors.gender}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {validationErrors.gender}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3" controlId="dateOfBirth">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                isInvalid={!!validationErrors.dateOfBirth}
                max={new Date().toISOString().split('T')[0]}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.dateOfBirth}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="phone">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            isInvalid={!!validationErrors.phone}
            placeholder="Enter your phone number"
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.phone}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="role">
          <Form.Label>Are you a doctor or a patient?</Form.Label>
          <Form.Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            isInvalid={!!validationErrors.role}
          >
            <option value="">Select Role</option>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {validationErrors.role}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Doctor-specific fields */}
        {formData.role === 'doctor' && (
          <>
            <Form.Group className="mb-3" controlId="specialty">
              <Form.Label>Specialty</Form.Label>
              <Form.Select
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                isInvalid={!!validationErrors.specialty}
              >
                <option value="">Select Specialty</option>
                <option value="cardiologist">Cardiologist</option>
                <option value="dermatologist">Dermatologist</option>
                <option value="neurologist">Neurologist</option>
                <option value="orthopedic">Orthopedic</option>
                <option value="pediatrician">Pediatrician</option>
                <option value="psychiatrist">Psychiatrist</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {validationErrors.specialty}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="qualifications">
              <Form.Label>Qualifications</Form.Label>
              <Form.Control
                type="text"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                isInvalid={!!validationErrors.qualifications}
                placeholder="Enter your qualifications"
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.qualifications}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="hospital">
              <Form.Label>Hospital</Form.Label>
              <Form.Control
                type="text"
                name="hospital"
                value={formData.hospital}
                onChange={handleChange}
                isInvalid={!!validationErrors.hospital}
                placeholder="Enter your hospital"
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.hospital}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="experience">
                  <Form.Label>Years of Experience</Form.Label>
                  <Form.Control
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    isInvalid={!!validationErrors.experience}
                    min="0"
                    placeholder="Enter years of experience"
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.experience}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3" controlId="consultationFee">
                  <Form.Label>Consultation Fee</Form.Label>
                  <Form.Control
                    type="number"
                    name="consultationFee"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    isInvalid={!!validationErrors.consultationFee}
                    min="0"
                    step="0.01"
                    placeholder="Enter consultation fee"
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.consultationFee}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="imageUrl">
              <Form.Label>Profile Image URL (Optional)</Form.Label>
              <Form.Control
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="Enter image URL"
              />
            </Form.Group>
          </>
        )}

        <Form.Group className="mb-4" controlId="agreeToTerms">
          <Form.Check
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange} 
            isInvalid={!!validationErrors.agreeToTerms}
            label={
              <span>
                I agree to the{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
              </span>
            }
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.agreeToTerms}
          </Form.Control.Feedback>
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="w-100 py-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </Form>

      <div className="mt-4 text-center">
        <p className="mb-0">
          Already have an account?{' '}
          <span className="text-primary" role="button" onClick={() => navigate('/auth', { state: { tab: 'login' } })}>
            Login instead
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;