import React from 'react';
import { formatDate, getStatusColor } from '../../utils/helpers';
import './ComplaintCard.css';

const ComplaintCard = ({ complaint, onViewDetails, onStatusUpdate, userRole }) => {
  const handleStatusChange = (e) => {
    e.stopPropagation();
    onStatusUpdate(complaint._id, e.target.value);
  };

  return (
    <div 
      className="complaint-card"
      onClick={() => onViewDetails(complaint)}
    >
      <div className="complaint-header">
        <div className="complaint-meta">
          <span className="ticket-number">{complaint.ticketNumber}</span>
          <span className="complaint-date">
            {formatDate(complaint.createdAt)}
          </span>
        </div>
        <div className="complaint-actions">
          {userRole === 'admin' || userRole === 'staff' ? (
            <select 
              value={complaint.status}
              onChange={handleStatusChange}
              onClick={(e) => e.stopPropagation()}
              className="status-select"
              style={{ borderColor: getStatusColor(complaint.status) }}
            >
              <option value="submitted">Submitted</option>
              <option value="in-review">In Review</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          ) : (
            <span 
              className="status-badge"
              style={{ 
                backgroundColor: getStatusColor(complaint.status),
                color: 'white'
              }}
            >
              {complaint.status}
            </span>
          )}
        </div>
      </div>

      <h3 className="complaint-title">{complaint.title}</h3>
      
      <div className="complaint-category">
        {complaint.category}
      </div>

      <p className="complaint-description">
        {complaint.description.length > 100 
          ? `${complaint.description.substring(0, 100)}...` 
          : complaint.description
        }
      </p>

      <div className="complaint-footer">
        <div className="complaint-location">
          <span>Block {complaint.location.block}</span>
          <span>Floor {complaint.location.floor}</span>
          <span>Room {complaint.location.roomNumber}</span>
        </div>
        
        <div className="complaint-priority">
          <span 
            className={`priority-badge priority-${complaint.priority}`}
          >
            {complaint.priority}
          </span>
        </div>
      </div>

      {complaint.assignedTo && (
        <div className="assigned-info">
          Assigned to: {complaint.assignedTo.fullName}
        </div>
      )}
    </div>
  );
};

export default ComplaintCard;