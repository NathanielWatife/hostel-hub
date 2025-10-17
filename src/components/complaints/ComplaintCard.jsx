import React, { useState } from 'react';
import { useComplaints } from '../../contexts/ComplaintContext';
import { useAuth } from '../../contexts/AuthContext';
import ComplaintDetails from './ComplaintDetails';
import { 
  FiAlertCircle, 
  FiClock, 
  FiUser, 
  FiMapPin, 
  FiEye,
  FiMessageSquare,
  FiImage,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';

function ComplaintCard({ complaint }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const { categories, priorities, statuses } = useComplaints();
  const { userData } = useAuth();

  const category = categories[complaint.category];
  const priority = priorities[complaint.priority];
  const status = statuses[complaint.status];

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(timestamp);
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const getStatusProgress = () => {
    const statusOrder = ['submitted', 'in-review', 'assigned', 'in-progress', 'resolved', 'closed'];
    const currentIndex = statusOrder.indexOf(complaint.status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category?.color}`}>
                  {category?.icon} {category?.name}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priority?.color}`}>
                  {priority?.name}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status?.color}`}>
                  {status?.name}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {complaint.title}
              </h3>
            </div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              {showDetails ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="px-4 py-3">
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {complaint.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <FiMapPin className="w-4 h-4 text-gray-400" />
              <span>Block {complaint.location?.block}, Room {complaint.location?.roomNumber}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <FiClock className="w-4 h-4 text-gray-400" />
              <span>{getTimeAgo(complaint.createdAt)}</span>
            </div>

            {complaint.imageUris && complaint.imageUris.length > 0 && (
              <div className="flex items-center space-x-1">
                <FiImage className="w-4 h-4 text-gray-400" />
                <span>{complaint.imageUris.length} image(s)</span>
              </div>
            )}

            {complaint.assignedTo && (
              <div className="flex items-center space-x-1">
                <FiUser className="w-4 h-4 text-gray-400" />
                <span>Assigned</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{Math.round(getStatusProgress())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getStatusProgress()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowDetails(true)}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-500"
              >
                <FiEye className="w-4 h-4" />
                <span>View Details</span>
              </button>

              {complaint.imageUris && complaint.imageUris.length > 0 && (
                <button
                  onClick={() => openImageModal(complaint.imageUris[0])}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-500"
                >
                  <FiImage className="w-4 h-4" />
                  <span>View Images</span>
                </button>
              )}
            </div>

            <div className="text-xs text-gray-500">
              ID: {complaint.id?.substring(0, 8).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Collapsible Details */}
        {showDetails && (
          <div className="border-t border-gray-200">
            <div className="px-4 py-3">
              <ComplaintDetails 
                complaint={complaint} 
                compact={true}
                onClose={() => setShowDetails(false)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Image Preview</h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiAlertCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedImage}
                alt="Complaint evidence"
                className="max-w-full max-h-96 object-contain mx-auto"
              />
            </div>
            {complaint.imageUris && complaint.imageUris.length > 1 && (
              <div className="p-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">All Images</h4>
                <div className="grid grid-cols-4 gap-2">
                  {complaint.imageUris.map((imageUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(imageUrl)}
                      className={`border-2 rounded-md overflow-hidden ${
                        selectedImage === imageUrl ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={imageUrl}
                        alt={`Evidence ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Details Modal */}
      {showDetails && (
        <ComplaintDetails
          complaint={complaint}
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}

export default ComplaintCard;