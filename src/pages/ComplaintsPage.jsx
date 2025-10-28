import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ComplaintForm from '../components/complaints/ComplaintForm';
import ComplaintList from '../components/complaints/ComplaintList';
import ComplaintDetails from '../components/complaints/ComplaintDetails';
import { complaintAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './ComplaintsPage.css';

const ComplaintsPage = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  // showForm state unused (view controls form visibility via 'view')
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'details', 'form'
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: ''
  });

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.priority) params.priority = filters.priority;

      const response = user?.role === 'admin' 
        ? await complaintAPI.getAll(params)
        : await complaintAPI.getMyComplaints();
      
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, user]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleCreateComplaint = async (complaintData) => {
    try {
      await complaintAPI.create(complaintData);
      setView('list');
      fetchComplaints();
    } catch (error) {
      console.error('Error creating complaint:', error);
      throw error;
    }
  };

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setView('details');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedComplaint(null);
  };

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      await complaintAPI.updateStatus(complaintId, newStatus);
      fetchComplaints();
      if (selectedComplaint && selectedComplaint._id === complaintId) {
        setSelectedComplaint(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAddComment = async (complaintId, comment) => {
    try {
      await complaintAPI.addComment(complaintId, comment);
      fetchComplaints();
      if (selectedComplaint && selectedComplaint._id === complaintId) {
        const response = await complaintAPI.getById(complaintId);
        setSelectedComplaint(response.data);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading && view === 'list') {
    return <LoadingSpinner />;
  }

  return (
    <div className="complaints-page">
      <div className="page-header">
        <h1>Complaints Management</h1>
        {view === 'list' && (
          <button 
            className="btn btn-primary"
            onClick={() => setView('form')}
          >
            New Complaint
          </button>
        )}
      </div>

      {view === 'list' && (
        <>
          <ComplaintList
            complaints={complaints}
            filters={filters}
            onFilterChange={setFilters}
            onViewDetails={handleViewDetails}
            onStatusUpdate={handleStatusUpdate}
            userRole={user?.role}
          />
        </>
      )}

      {view === 'form' && (
        <ComplaintForm
          onSubmit={handleCreateComplaint}
          onCancel={() => setView('list')}
        />
      )}

      {view === 'details' && selectedComplaint && (
        <ComplaintDetails
          complaint={selectedComplaint}
          onBack={handleBackToList}
          onStatusUpdate={handleStatusUpdate}
          onAddComment={handleAddComment}
          userRole={user?.role}
          currentUserId={user?._id}
        />
      )}
    </div>
  );
};

export default ComplaintsPage;