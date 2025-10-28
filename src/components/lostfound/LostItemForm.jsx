import React, { useState } from 'react';
import { ITEM_CATEGORIES } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import './ItemForms.css';

const LostItemForm = ({ onSubmit, onCancel }) => {
  // const { user } = useAuth(); // not used in this form currently
  const [formData, setFormData] = useState({
    category: '',
    itemName: '',
    description: '',
    brand: '',
    color: '',
    locationLost: '',
    dateLost: '',
    identifyingFeatures: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to report lost item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="item-form-container">
      <div className="item-form-card">
        <h2>Report Lost Item</h2>
        
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
              {ITEM_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Item Name *</label>
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., iPhone 13, Calculus Textbook, Wallet"
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
              placeholder="Detailed description of the item, including any specific features..."
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., Apple, Nike, Samsung"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Color</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., Black, Blue, Red"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Identifying Features</label>
            <textarea
              name="identifyingFeatures"
              value={formData.identifyingFeatures}
              onChange={handleChange}
              className="form-control"
              rows="3"
              placeholder="Scratches, stickers, unique marks, contents, etc."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Where did you lose it? *</label>
            <select
              name="locationLost"
              value={formData.locationLost}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select Location</option>
              <option value="hostel-room">Hostel Room</option>
              <option value="hostel-corridor">Hostel Corridor</option>
              <option value="hostel-lobby">Hostel Lobby</option>
              <option value="hostel-mess">Hostel Mess/Cafeteria</option>
              <option value="hostel-garden">Hostel Garden</option>
              <option value="academic-block">Academic Block</option>
              <option value="library">Library</option>
              <option value="sports-complex">Sports Complex</option>
              <option value="parking-area">Parking Area</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">When did you lose it? *</label>
            <input
              type="datetime-local"
              name="dateLost"
              value={formData.dateLost}
              onChange={handleChange}
              className="form-control"
              required
            />
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
              {loading ? <LoadingSpinner size="small" /> : 'Report Lost Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LostItemForm;