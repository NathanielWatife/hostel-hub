import React from 'react';
import { useComplaints } from '../../contexts/ComplaintContext';
import ComplaintCard from './ComplaintCard';
import { FiLoader, FiAlertCircle, FiInbox } from 'react-icons/fi';

function ComplaintList() {
  const { complaints, loading } = useComplaints();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <FiLoader className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading complaints...</p>
        </div>
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div className="text-center py-12">
        <FiInbox className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints found</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          {complaints.length === 0 
            ? "You haven't submitted any complaints yet. Click 'New Complaint' to get started."
            : "No complaints match your current filters."
          }
        </p>
      </div>
    );
  }

  // Group complaints by status for better organization
  const groupedComplaints = {
    open: complaints.filter(c => ['submitted', 'in-review', 'assigned', 'in-progress'].includes(c.status)),
    resolved: complaints.filter(c => c.status === 'resolved'),
    closed: complaints.filter(c => c.status === 'closed')
  };

  return (
    <div className="space-y-6">
      {/* Open Complaints */}
      {groupedComplaints.open.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            Open Issues ({groupedComplaints.open.length})
          </h3>
          <div className="grid gap-4">
            {groupedComplaints.open.map(complaint => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </div>
        </div>
      )}

      {/* Resolved Complaints */}
      {groupedComplaints.resolved.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            Resolved ({groupedComplaints.resolved.length})
          </h3>
          <div className="grid gap-4">
            {groupedComplaints.resolved.map(complaint => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </div>
        </div>
      )}

      {/* Closed Complaints */}
      {groupedComplaints.closed.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            Closed ({groupedComplaints.closed.length})
          </h3>
          <div className="grid gap-4">
            {groupedComplaints.closed.map(complaint => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ComplaintList;