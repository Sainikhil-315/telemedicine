import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    medicalHistory: '',
    preferences: {
      timezone: 'UTC'
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        address: user.address || '',
        medicalHistory: user.medicalHistory || '',
        preferences: {
          timezone: user.preferences?.timezone || 'UTC'
        }
      });
    }
  }, [user]);

  const handleInputChange = (e, section = null) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [e.target.name]: e.target.value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateUser(formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Profile Settings</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      className="form-control"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Gender</label>
                    <select
                      name="gender"
                      className="form-select"
                      value={formData.gender}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Address</label>
                    <textarea
                      name="address"
                      className="form-control"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    ></textarea>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Medical History</label>
                    <textarea
                      name="medicalHistory"
                      className="form-control"
                      value={formData.medicalHistory}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    ></textarea>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Timezone</label>
                    <select
                      name="timezone"
                      className="form-select"
                      value={formData.preferences.timezone}
                      onChange={(e) => handleInputChange(e, 'preferences')}
                      disabled={!isEditing}
                    >
                      <option value="UTC">UTC (GMT+0)</option>
                      <option value="EST">Eastern Time (GMT-5)</option>
                      <option value="CST">Central Time (GMT-6)</option>
                      <option value="MST">Mountain Time (GMT-7)</option>
                      <option value="PST">Pacific Time (GMT-8)</option>
                      <option value="IST">India (GMT+5:30)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 d-flex justify-content-end gap-2">
                  {!isEditing ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({...user}); // Reset form data
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </>
                  )}
                </div>
              </form>

              {/* Password Change Section */}
              <div className="mt-4 pt-4 border-top">
                <h5 className="mb-4">Change Password</h5>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const passwords = {
                    currentPassword: formData.get('currentPassword'),
                    newPassword: formData.get('newPassword'),
                    confirmPassword: formData.get('confirmPassword')
                  };

                  if (passwords.newPassword !== passwords.confirmPassword) {
                    toast.error('New passwords do not match');
                    return;
                  }

                  try {
                    setLoading(true);
                    const response = await fetch('/api/user/change-password', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(passwords)
                    });

                    if (!response.ok) {
                      throw new Error('Failed to change password');
                    }

                    toast.success('Password changed successfully');
                    e.target.reset();
                  } catch (error) {
                    toast.error(error.message);
                  } finally {
                    setLoading(false);
                  }
                }}>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        className="form-control"
                        required
                        minLength="8"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        className="form-control"
                        required
                        minLength="8"
                      />
                    </div>
                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-warning"
                        disabled={loading}
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Account Deletion Section */}
              <div className="mt-4 pt-4 border-top">
                <h5 className="text-danger mb-4">Delete Account</h5>
                <p className="text-muted">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  className="btn btn-outline-danger"
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                      try {
                        setLoading(true);
                        const response = await fetch('/api/user', {
                          method: 'DELETE'
                        });

                        if (!response.ok) {
                          throw new Error('Failed to delete account');
                        }

                        await logout();
                        navigate('/');
                      } catch (error) {
                        toast.error(error.message);
                      } finally {
                        setLoading(false);
                      }
                    }
                  }}
                  disabled={loading}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;