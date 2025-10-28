import React from 'react';
import { formatDate } from '../../utils/helpers';
import './ItemCard.css';

const ItemCard = ({ item, type, onClaim, showUserItems = false }) => {
  const isLost = type === 'lost';
  const isFound = type === 'found';
  const canClaim = isFound && item.status === 'found' && !showUserItems;

  const handleClaimClick = (e) => {
    e.stopPropagation();
    if (canClaim) {
      onClaim(item);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      lost: '#dc3545',
      found: '#28a745',
      returned: '#6c757d',
      claimed: '#ffc107'
    };
    return colors[status] || '#6c757d';
  };

  return (
    <div className={`item-card ${type}`}>
      <div className="item-header">
        <div className="item-type-badge">
          {type.toUpperCase()}
        </div>
        <div 
          className="item-status"
          style={{ backgroundColor: getStatusColor(item.status) }}
        >
          {item.status}
        </div>
      </div>

      <div className="item-content">
        <h3 className="item-name">{item.itemName}</h3>
        
        <div className="item-category">
          {item.category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </div>

        <p className="item-description">
          {item.description.length > 100 
            ? `${item.description.substring(0, 100)}...` 
            : item.description
          }
        </p>

        <div className="item-details">
          {item.brand && (
            <div className="detail-item">
              <span className="detail-label">Brand:</span>
              <span className="detail-value">{item.brand}</span>
            </div>
          )}
          
          {item.color && (
            <div className="detail-item">
              <span className="detail-label">Color:</span>
              <span className="detail-value">{item.color}</span>
            </div>
          )}

          <div className="detail-item">
            <span className="detail-label">
              {isLost ? 'Lost Location:' : 'Found Location:'}
            </span>
            <span className="detail-value">
              {isLost ? item.locationLost : item.locationFound}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              {isLost ? 'Lost Date:' : 'Found Date:'}
            </span>
            <span className="detail-value">
              {formatDate(isLost ? item.dateLost : item.dateFound)}
            </span>
          </div>

          {isFound && item.currentCustody && (
            <div className="detail-item">
              <span className="detail-label">Current Location:</span>
              <span className="detail-value">{item.currentCustody}</span>
            </div>
          )}

          {isFound && item.contactInfo && (
            <div className="detail-item">
              <span className="detail-label">Contact:</span>
              <span className="detail-value">{item.contactInfo}</span>
            </div>
          )}

          {isLost && item.identifyingFeatures && (
            <div className="detail-item">
              <span className="detail-label">Identifying Features:</span>
              <span className="detail-value">{item.identifyingFeatures}</span>
            </div>
          )}
        </div>

        {showUserItems && (
          <div className="item-owner">
            Reported by: {item.userId?.fullName || 'You'}
          </div>
        )}
      </div>

      <div className="item-footer">
        {canClaim ? (
          <button 
            className="btn btn-primary btn-claim"
            onClick={handleClaimClick}
          >
            Claim This Item
          </button>
        ) : (
          <div className="item-date">
            Reported {formatDate(item.createdAt)}
          </div>
        )}
      </div>

      {item.images && item.images.length > 0 && (
        <div className="item-image-preview">
          <img 
            src={item.images[0]} 
            alt={item.itemName}
            className="preview-image"
          />
        </div>
      )}
    </div>
  );
};

export default ItemCard;