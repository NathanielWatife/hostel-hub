import React, { useState, useEffect } from 'react';
import { useComplaints } from '../../contexts/ComplaintContext';
import { useAuth } from '../../contexts/AuthContext';
import { doc, updateDoc, arrayUnion, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import {
  FiX,
  FiUser,
  FiMapPin,
  FiClock,
  FiAlertCircle,
  FiMessageSquare,
  FiImage,
  FiSend,
  FiStar,
  FiEdit,
  FiCheck,
  FiUsers
} from 'react-icons/fi';

function ComplaintDetails({ complaint, isOpen = true, onClose, compact = false }) {
  const [activeTab, setActiveTab] = useState('details');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [staffMembers, setStaffMembers] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);
  const { categories, priorities, statuses, updateComplaintStatus, assignComplaint } = useComplaints();
  const { userData } = useAuth();

  const category = categories[complaint.category];
  const priority = priorities[complaint.priority];
  const status = statuses[complaint.status];

  // Fetch staff members for assignment (admin only)
  useEffect(() => {
    if (userData?.role === 'admin') {
      fetchStaffMembers();
    }
  }, [userData]);

  const fetchStaffMembers = async () => {
    try {
      const staffQuery = await getDocs(query(collection(db, 'users'), where('role', '==', 'staff')));
      const staffData = staffQuery.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStaffMembers(staffData);
    } catch (error) {
      console.error('Error fetching staff members:', error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    setLoading(true);
    try {
      const complaintRef = doc(db, 'complaints', complaint.id);
      await updateDoc(complaintRef, {
        comments: arrayUnion({
          userId: userData.uid,
          userName: userData.displayName,
          userRole: userData.role,
          comment: comment.trim(),
          timestamp: serverTimestamp()
        }),
        updatedAt: serverTimestamp()
      });
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {
      await updateComplaintStatus(complaint.id, { status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToStaff = async (staffId) => {
    setAssignLoading(true);
    try {
      await assignComplaint(complaint.id, staffId);
    } catch (error) {
      console.error('Error assigning complaint:', error);
    } finally {
      setAssignLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (rating === 0 || !feedback.trim()) return;

    setLoading(true);
    try {
      await updateComplaintStatus(complaint.id, {
        rating,
        feedback: feedback.trim(),
        status: 'closed'
      });
      setRating(0);
      setFeedback('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const canUpdateStatus = userData?.role === 'staff' || userData?.role === 'admin';
  const canAssign = userData?.role === 'admin';
  const canAddFeedback = userData?.role === 'student' && complaint.status === 'resolved';

  if (compact) {
    return (
      <div className="space-y-4">
        {/* Status Timeline */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Status Timeline</h4>
          <div className="space-y-2">
            {complaint.statusHistory?.map((history, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{history.status}</span>
                <span className="text-xs text-gray-400">{formatDate(history.timestamp)}</span>
              </div>
            )) || (
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Submitted</span>
                <span className="text-xs text-gray-400">{formatDate(complaint.createdAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {canUpdateStatus && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Quick Actions</h4>
            <div className="flex space-x-2">
              {complaint.status === 'submitted' && (
                <button
                  onClick={() => handleStatusUpdate('in-review')}
                  disabled={loading}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Mark In Review
                </button>
              )}
              {complaint.status === 'in-review' && (
                <button
                  onClick={() => handleStatusUpdate('in-progress')}
                  disabled={loading}
                  className="px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 disabled:opacity-50"
                >
                  Start Progress
                </button>
              )}
              {['assigned', 'in-progress'].includes(complaint.status) && (
                <button
                  onClick={() => handleStatusUpdate('resolved')}
                  disabled={loading}
                  className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
                >
                  Mark Resolved
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{complaint.title}</h2>
            <p className="text-sm text-gray-600">Complaint ID: {complaint.id?.substring(0, 8).toUpperCase()}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-8rem)]">
          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {['details', 'comments', 'images', 'feedback'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Details Tab */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Complaint Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-500">Category:</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category?.color}`}>
                            {category?.icon} {category?.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-500">Priority:</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priority?.color}`}>
                            {priority?.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-500">Status:</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status?.color}`}>
                            {status?.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-500">Submitted:</span>
                          <span className="text-sm text-gray-900">{formatDate(complaint.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-500">Last Updated:</span>
                          <span className="text-sm text-gray-900">{formatDate(complaint.updatedAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Location Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <FiMapPin className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Block {complaint.location?.block}, Room {complaint.location?.roomNumber}
                            </p>
                            {complaint.location?.floor && (
                              <p className="text-sm text-gray-500">Floor {complaint.location.floor}</p>
                            )}
                          </div>
                        </div>
                        {complaint.isAnonymous ? (
                          <div className="flex items-center space-x-2">
                            <FiUser className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">Submitted anonymously</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <FiUser className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">Submitted by {complaint.createdBy}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {complaint.description}
                    </p>
                  </div>

                  {/* Admin Actions */}
                  {(canUpdateStatus || canAssign) && (
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Administrative Actions</h3>
                      
                      {/* Status Update */}
                      {canUpdateStatus && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Update Status
                          </label>
                          <div className="flex space-x-2 flex-wrap gap-2">
                            {Object.entries(statuses).map(([key, statusObj]) => (
                              <button
                                key={key}
                                onClick={() => handleStatusUpdate(key)}
                                disabled={loading || complaint.status === key}
                                className={`px-3 py-2 text-sm rounded-md ${
                                  complaint.status === key
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                } disabled:opacity-50`}
                              >
                                {statusObj.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Staff Assignment */}
                      {canAssign && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assign to Staff
                          </label>
                          <div className="flex space-x-2 flex-wrap gap-2">
                            {staffMembers.map((staff) => (
                              <button
                                key={staff.id}
                                onClick={() => handleAssignToStaff(staff.id)}
                                disabled={assignLoading || complaint.assignedTo === staff.id}
                                className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md ${
                                  complaint.assignedTo === staff.id
                                    ? 'bg-green-100 text-green-800 border border-green-300'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                } disabled:opacity-50`}
                              >
                                <FiUsers className="w-4 h-4" />
                                <span>{staff.displayName}</span>
                                {complaint.assignedTo === staff.id && (
                                  <FiCheck className="w-4 h-4" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Comments Tab */}
              {activeTab === 'comments' && (
                <div className="space-y-6">
                  {/* Comment Input */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {userData?.role === 'admin' ? 'Admin' : userData?.role === 'staff' ? 'Staff' : 'Student'}
                      </span>
                      <button
                        onClick={handleAddComment}
                        disabled={loading || !comment.trim()}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        <FiSend className="w-4 h-4" />
                        <span>Send</span>
                      </button>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {complaint.comments?.map((comment, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{comment.userName}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              comment.userRole === 'admin' 
                                ? 'bg-red-100 text-red-800'
                                : comment.userRole === 'staff'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {comment.userRole}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.comment}</p>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        <FiMessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No comments yet. Be the first to comment!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Images Tab */}
              {activeTab === 'images' && (
                <div>
                  {complaint.imageUris && complaint.imageUris.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {complaint.imageUris.map((imageUrl, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={`Evidence ${index + 1}`}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-3 bg-gray-50">
                            <p className="text-sm text-gray-600">Evidence {index + 1}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FiImage className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No images attached to this complaint</p>
                    </div>
                  )}
                </div>
              )}

              {/* Feedback Tab */}
              {activeTab === 'feedback' && (
                <div>
                  {complaint.rating ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <FiStar className="w-6 h-6 text-yellow-500" />
                        <h3 className="text-lg font-medium text-green-800">Feedback Submitted</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar
                              key={star}
                              className={`w-5 h-5 ${
                                star <= complaint.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-green-700">{complaint.feedback}</p>
                      </div>
                    </div>
                  ) : canAddFeedback ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-blue-800 mb-4">Provide Feedback</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating
                          </label>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setRating(star)}
                                className="focus:outline-none"
                              >
                                <FiStar
                                  className={`w-8 h-8 ${
                                    star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Comments
                          </label>
                          <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Tell us about your experience with the resolution..."
                          />
                        </div>
                        <button
                          onClick={handleSubmitFeedback}
                          disabled={loading || rating === 0 || !feedback.trim()}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                          Submit Feedback
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FiAlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>
                        {complaint.status !== 'resolved' 
                          ? 'Feedback can be provided once the complaint is resolved.'
                          : 'You have already submitted feedback for this complaint.'
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplaintDetails;