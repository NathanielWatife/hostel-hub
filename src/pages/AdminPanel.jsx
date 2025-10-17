import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { complaintAPI, lostFoundAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    totalUsers: 0,
    lostItems: 0,
    foundItems: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      // In a real app, you'd have specific admin endpoints
      const [complaintsRes, lostRes, foundRes] = await Promise.all([
        complaintAPI.getAll(),
        lostFoundAPI.getLostItems(),
        lostFoundAPI.getFoundItems()
      ]);

      const complaints = complaintsRes.data;
      const lostItems = lostRes.data;
      const foundItems = foundRes.data;

      setStats({
        totalComplaints: complaints.length,
        pendingComplaints: complaints.filter(c => 
          ['submitted', 'in-review', 'assigned', 'in-progress'].includes(c.status)
        ).length,
        totalUsers: 0, // You'd get this from a users API
        lostItems: lostItems.length,
        foundItems: foundItems.length
      });

      setRecentComplaints(complaints.slice(0, 5));
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-panel">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You need administrator privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin-panel">
      <div className="page-header">
        <h1>Admin Panel</h1>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`admin-tab ${activeTab === 'complaints' ? 'active' : ''}`}
          onClick={() => setActiveTab('complaints')}
        >
          Complaints
        </button>
        <button
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`admin-tab ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          Lost & Found
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="stats-grid-admin">
              <div className="stat-card-admin">
                <h3>Total Complaints</h3>
                <p className="stat-number">{stats.totalComplaints}</p>
                <span className="stat-label">All Time</span>
              </div>
              <div className="stat-card-admin">
                <h3>Pending Complaints</h3>
                <p className="stat-number">{stats.pendingComplaints}</p>
                <span className="stat-label">Require Attention</span>
              </div>
              <div className="stat-card-admin">
                <h3>Lost Items</h3>
                <p className="stat-number">{stats.lostItems}</p>
                <span className="stat-label">Currently Lost</span>
              </div>
              <div className="stat-card-admin">
                <h3>Found Items</h3>
                <p className="stat-number">{stats.foundItems}</p>
                <span className="stat-label">Awaiting Claim</span>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Recent Complaints</h3>
              <div className="activity-list">
                {recentComplaints.map(complaint => (
                  <div key={complaint._id} className="activity-item">
                    <div className="activity-info">
                      <span className="activity-title">{complaint.title}</span>
                      <span className="activity-user">
                        {complaint.anonymous ? 'Anonymous' : complaint.userId.fullName}
                      </span>
                    </div>
                    <span className={`activity-status status-${complaint.status}`}>
                      {complaint.status}
                    </span>
                  </div>
                ))}
                {recentComplaints.length === 0 && (
                  <p className="no-activity">No recent complaints</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'complaints' && (
          <div className="complaints-tab">
            <h3>Complaints Management</h3>
            <p>Advanced complaints management interface would go here.</p>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-tab">
            <h3>User Management</h3>
            <p>User management interface would go here.</p>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="items-tab">
            <h3>Lost & Found Management</h3>
            <p>Lost and found items management interface would go here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;