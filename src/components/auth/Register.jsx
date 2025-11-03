import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { HOSTEL_BLOCKS } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    matricNo: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    hostelBlock: '',
    roomNumber: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] });
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  // Password strength helpers (no external deps)
  const passwordRequirements = [
    { id: 1, text: 'At least 8 characters' },
    { id: 2, text: 'Contains uppercase letter' },
    { id: 3, text: 'Contains lowercase letter' },
    { id: 4, text: 'Contains number' },
    { id: 5, text: 'Contains special character' }
  ];

  const checkPasswordStrength = (password) => {
    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    ];
    const met = checks.filter(Boolean).length;
    const score = (met / checks.length) * 100;
    const feedback = passwordRequirements.map((req, i) => ({ ...req, met: checks[i] }));
    return { score, feedback };
  };

  const strengthColor = (score) => {
    if (score < 40) return '#dc3545'; // red
    if (score < 70) return '#fd7e14'; // orange
    return '#28a745'; // green
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register for Yaba-HostelHub</h2>
        <p className="auth-subtitle">Create your account to manage complaints and lost & found</p>
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">MatricNo</label>
            <input
              type="text"
              name="matricNo"
              value={formData.matricNo}
              onChange={handleChange}
              className="form-control"
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="form-control"
              autoComplete="name"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Hostel Block</label>
              <select
                name="hostelBlock"
                value={formData.hostelBlock}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Select Block</option>
                {HOSTEL_BLOCKS.map(block => (
                  <option key={block} value={block}>Block {block}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Room Number</label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                className="form-control"
                autoComplete="section"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-control"
              autoComplete="tel"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="btn btn-sm btn-outline"
                style={{ position: 'absolute', right: 8, top: 8, padding: '4px 8px' }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Strength meter */}
            {formData.password && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6c757d' }}>
                  <span>Password strength</span>
                  <span style={{ color: strengthColor(passwordStrength.score), fontWeight: 600 }}>
                    {passwordStrength.score < 40 ? 'Weak' : passwordStrength.score < 70 ? 'Medium' : 'Strong'}
                  </span>
                </div>
                <div style={{ height: 6, background: '#e9ecef', borderRadius: 4 }}>
                  <div
                    style={{
                      height: 6,
                      width: `${passwordStrength.score}%`,
                      background: strengthColor(passwordStrength.score),
                      borderRadius: 4,
                      transition: 'width 200ms ease'
                    }}
                  />
                </div>
                {/* Requirements list */}
                <ul style={{ marginTop: 8, paddingLeft: 16 }}>
                  {(passwordStrength.feedback || passwordRequirements).map((req) => (
                    <li key={req.id} style={{ fontSize: 12, color: req.met ? '#28a745' : '#6c757d' }}>
                      {req.met ? '✓' : '•'} {req.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-control"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(v => !v)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                className="btn btn-sm btn-outline"
                style={{ position: 'absolute', right: 8, top: 8, padding: '4px 8px' }}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="small" /> : 'Register'}
          </button>
        </form>
        
        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;