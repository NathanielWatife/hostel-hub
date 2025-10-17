import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { COMPLAINT_CATEGORIES, COMPLAINT_PRIORITIES, HOSTEL_BLOCKS } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import './ComplaintForm.css';

const ComplaintForm = ({ onSubmit, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    location: {
      block: user?.hostelBlock || '',
      floor: '',
      roomNumber: user?.roomNumber || ''
    },
    priority: 'medium',
    anonymous: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="complaint-form-container">
      <div className="complaint-form-card">
        <h2>Create New Complaint</h2>
        
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select Category</option>
              {COMPLAINT_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              placeholder="Brief description of the issue"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              rows="4"
              placeholder="Detailed description of the problem..."
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Hostel Block *</label>
              <select
                name="location.block"
                value={formData.location.block}
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
              <label className="form-label">Floor *</label>
              <input
                type="text"
                name="location.floor"
                value={formData.location.floor}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., 1st Floor"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Room Number *</label>
              <input
                type="text"
                name="location.roomNumber"
                value={formData.location.roomNumber}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., 101"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="form-control"
            >
              {COMPLAINT_PRIORITIES.map(priority => (
                <option key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="anonymous"
                checked={formData.anonymous}
                onChange={handleChange}
              />
              Submit anonymously
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="small" /> : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;