import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { complaintAPI } from '../services/api';
import { useAuth } from './AuthContext';

const ComplaintContext = createContext();

export function useComplaints() {
  return useContext(ComplaintContext);
}

export function ComplaintProvider({ children }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const { user } = useAuth();

  // Categories with icons and colors
  const categories = {
    plumbing: { name: 'Plumbing', color: 'bg-blue-100 text-blue-800', icon: '💧' },
    electrical: { name: 'Electrical', color: 'bg-yellow-100 text-yellow-800', icon: '⚡' },
    wifi: { name: 'Wi-Fi', color: 'bg-purple-100 text-purple-800', icon: '📶' },
    furniture: { name: 'Furniture', color: 'bg-orange-100 text-orange-800', icon: '🪑' },
    cleaning: { name: 'Cleaning', color: 'bg-green-100 text-green-800', icon: '🧹' },
    security: { name: 'Security', color: 'bg-red-100 text-red-800', icon: '🔒' },
    noise: { name: 'Noise', color: 'bg-indigo-100 text-indigo-800', icon: '🔊' },
    other: { name: 'Other', color: 'bg-gray-100 text-gray-800', icon: '📋' }
  };

  const priorities = {
    low: { name: 'Low', color: 'bg-gray-100 text-gray-800', level: 1 },
    medium: { name: 'Medium', color: 'bg-yellow-100 text-yellow-800', level: 2 },
    high: { name: 'High', color: 'bg-orange-100 text-orange-800', level: 3 },
    emergency: { name: 'Emergency', color: 'bg-red-100 text-red-800', level: 4 }
  };

  const statuses = {
    submitted: { name: 'Submitted', color: 'bg-gray-100 text-gray-800' },
    'in-review': { name: 'In Review', color: 'bg-blue-100 text-blue-800' },
    assigned: { name: 'Assigned', color: 'bg-yellow-100 text-yellow-800' },
    'in-progress': { name: 'In Progress', color: 'bg-orange-100 text-orange-800' },
    resolved: { name: 'Resolved', color: 'bg-green-100 text-green-800' },
    closed: { name: 'Closed', color: 'bg-purple-100 text-purple-800' }
  };

  // Fetch complaints based on user role and filters
  const fetchComplaints = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.category !== 'all') params.category = filters.category;
      if (filters.priority !== 'all') params.priority = filters.priority;

      let response;
      if (user.role === 'admin' || user.role === 'staff') {
        response = await complaintAPI.getAll(params);
      } else {
        response = await complaintAPI.getMyComplaints();
      }

      // Apply client-side filtering if needed
      let data = response.data || [];
      if (user.role !== 'admin' && user.role !== 'staff') {
        if (filters.status !== 'all') {
          data = data.filter(c => c.status === filters.status);
        }
        if (filters.category !== 'all') {
          data = data.filter(c => c.category === filters.category);
        }
        if (filters.priority !== 'all') {
          data = data.filter(c => c.priority === filters.priority);
        }
      }

      setComplaints(data);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError(err.message || 'Failed to fetch complaints');
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  // Setup initial fetch and re-fetch on filter changes
  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // Submit new complaint
  const submitComplaint = async (complaintData) => {
    try {
      setError(null);
      const response = await complaintAPI.create(complaintData);
      // Refresh complaints list
      await fetchComplaints();
      return { success: true, id: response.data._id };
    } catch (err) {
      console.error('Error submitting complaint:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to submit complaint';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Update complaint status
  const updateComplaintStatus = async (complaintId, newStatus) => {
    try {
      setError(null);
      await complaintAPI.updateStatus(complaintId, newStatus);
      // Refresh complaints list
      await fetchComplaints();
      return { success: true };
    } catch (err) {
      console.error('Error updating complaint status:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update status';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Add comment to complaint
  const addComment = async (complaintId, commentData) => {
    try {
      setError(null);
      await complaintAPI.addComment(complaintId, commentData.message || commentData);
      // Refresh complaints list
      await fetchComplaints();
      return { success: true };
    } catch (err) {
      console.error('Error adding comment:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to add comment';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Assign complaint to staff
  const assignComplaint = async (complaintId, staffId) => {
    return updateComplaintStatus(complaintId, 'assigned');
  };

  // Update status history (integrated into updateComplaintStatus)
  const updateStatusHistory = async (complaintId, newStatus) => {
    return updateComplaintStatus(complaintId, newStatus);
  };

  const value = {
    complaints,
    loading,
    error,
    filters,
    setFilters,
    categories,
    priorities,
    statuses,
    submitComplaint,
    updateComplaintStatus,
    assignComplaint,
    addComment,
    updateStatusHistory,
    fetchComplaints
  };

  return (
    <ComplaintContext.Provider value={value}>
      {children}
    </ComplaintContext.Provider>
  );
}
