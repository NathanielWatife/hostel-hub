import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import './ClaimModal.css';

const ClaimModal = ({ item, onClose, onClaim }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [claimDetails, setClaimDetails] = useState({
    proofOfOwnership: '',
    additionalDetails: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClaimDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onClaim(item._id, claimDetails);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to claim item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Claim Found Item</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="item-summary">
            <h3>Item Details</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <label>Item Name:</label>
                <span>{item.itemName}</span>
              </div>
              <div className="summary-item">
                <label>Category:</label>
                <span>
                  {item.category.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </span>
              </div>
              <div className="summary-item">
                <label>Found Location:</label>
                <span>{item.locationFound}</span>
              </div>
              <div className="summary-item">
                <label>Found Date:</label>
                <span>{new Date(item.dateFound).toLocaleDateString()}</span>
              </div>
              {item.brand && (
                <div className="summary-item">
                  <label>Brand:</label>
                  <span>{item.brand}</span>
                </div>
              )}
              {item.color && (
                <div className="summary-item">
                  <label>Color:</label>
                  <span>{item.color}</span>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="claim-form">
            <div className="form-group">
              <label className="form-label">
                Proof of Ownership *
              </label>
              <textarea
                name="proofOfOwnership"
                value={claimDetails.proofOfOwnership}
                onChange={handleChange}
                className="form-control"
                rows="3"
                placeholder="Please provide details that prove this item belongs to you. Include specific features, serial numbers, or any other identifying information."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Additional Details
              </label>
              <textarea
                name="additionalDetails"
                value={claimDetails.additionalDetails}
                onChange={handleChange}
                className="form-control"
                rows="2"
                placeholder="Any additional information that might help verify your claim..."
              />
            </div>

            <div className="claimer-info">
              <h4>Your Information</h4>
              <div className="claimer-details">
                <div className="detail">
                  <label>Name:</label>
                  <span>{user.fullName}</span>
                </div>
                <div className="detail">
                  <label>MatricNo:</label>
                  <span>{user.matricNo}</span>
                </div>
                <div className="detail">
                  <label>Room:</label>
                  <span>Block {user.hostelBlock}, Room {user.roomNumber}</span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? <LoadingSpinner size="small" /> : 'Submit Claim'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClaimModal;