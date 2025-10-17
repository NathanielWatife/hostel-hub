import React, { useState } from 'react';
import { formatDate, getStatusColor } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import './ComplaintDetails.css';

const ComplaintDetails = ({ 
  complaint, 
  onBack, 
  onStatusUpdate, 
  onAddComment,
  userRole,
  currentUserId 
}) => {
  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setAddingComment(true);
    try {
      await onAddComment(complaint._id, newComment);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setAddingComment(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    await onStatusUpdate(complaint._id, newStatus);
  };

  const canUpdateStatus = userRole === 'admin' || userRole === 'staff';
  const canAddComments = !complaint.anonymous || complaint.userId._id === currentUserId;

  return (
    <div className="complaint-details">
      <div className="details-header">
        <button 
          className="btn btn-secondary btn-back"
          onClick={onBack}
        >
          ← Back to List
        </button>
        
        {canUpdateStatus && (
          <select 
            value={complaint.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="status-select-large"
            style={{ borderColor: getStatusColor(complaint.status) }}
          >
            <option value="submitted">Submitted</option>
            <option value="in-review">In Review</option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        )}
      </div>

      <div className="details-content">
        <div className="complaint-main">
          <div className="complaint-header-details">
            <div>
              <h1>{complaint.title}</h1>
              <div className="complaint-meta-details">
                <span className="ticket-number-large">{complaint.ticketNumber}</span>
                <span className="complaint-category-large">{complaint.category}</span>
                <span 
                  className="status-badge-large"
                  style={{ backgroundColor: getStatusColor(complaint.status) }}
                >
                  {complaint.status}
                </span>
                <span className="priority-badge-large priority-{complaint.priority}">
                  {complaint.priority} Priority
                </span>
              </div>
            </div>
          </div>

          <div className="complaint-description-details">
            <h3>Description</h3>
            <p>{complaint.description}</p>
          </div>

          <div className="complaint-info-grid">
            <div className="info-item">
              <label>Location</label>
              <span>
                Block {complaint.location.block}, 
                Floor {complaint.location.floor}, 
                Room {complaint.location.roomNumber}
              </span>
            </div>
            
            <div className="info-item">
              <label>Submitted By</label>
              <span>
                {complaint.anonymous ? 'Anonymous' : complaint.userId.fullName}
              </span>
            </div>
            
            <div className="info-item">
              <label>Submitted On</label>
              <span>{formatDate(complaint.createdAt)}</span>
            </div>
            
            {complaint.assignedTo && (
              <div className="info-item">
                <label>Assigned To</label>
                <span>{complaint.assignedTo.fullName}</span>
              </div>
            )}
          </div>

          {complaint.images && complaint.images.length > 0 && (
            <div className="complaint-images">
              <h3>Attached Images</h3>
              <div className="images-grid">
                {complaint.images.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`Complaint evidence ${index + 1}`}
                    className="complaint-image"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="comments-section">
          <h3>Comments ({complaint.comments?.length || 0})</h3>
          
          <div className="comments-list">
            {complaint.comments?.map((comment, index) => (
              <div key={index} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">
                    {comment.user.fullName}
                  </span>
                  <span className="comment-date">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="comment-text">{comment.message}</p>
              </div>
            ))}
            
            {(!complaint.comments || complaint.comments.length === 0) && (
              <p className="no-comments">No comments yet.</p>
            )}
          </div>

          {canAddComments && (
            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="comment-textarea"
                rows="3"
                required
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={addingComment || !newComment.trim()}
              >
                {addingComment ? <LoadingSpinner size="small" /> : 'Add Comment'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;