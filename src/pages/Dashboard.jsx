import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { complaintAPI, lostFoundAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    complaints: 0,
    lostItems: 0,
    foundItems: 0,
    resolvedComplaints: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [complaintsRes, lostRes, foundRes] = await Promise.all([
        complaintAPI.getMyComplaints(),
        lostFoundAPI.getMyItems(),
        lostFoundAPI.getFoundItems({ limit: 5 })
      ]);

      const complaints = complaintsRes.data;
      const lostItems = lostRes.data;
      
      setStats({
        complaints: complaints.length,
        lostItems: lostItems.length,
        foundItems: foundRes.data.length,
        resolvedComplaints: complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length
      });

      setRecentComplaints(complaints.slice(0, 5));
      setRecentItems(foundRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="skeleton" style={{ height: '50px', width: '300px', marginBottom: '30px' }}></div>
        <div className="stats-grid">
          {[1,2,3,4].map(i => (
            <div key={i} className="stat-card skeleton" style={{ height: '150px' }}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Welcome back, {user?.fullName}! 👋</h1>
      <p className="dashboard-subtitle">
        Here's what's happening with your complaints and items today.
      </p>
      
      <div className="stats-grid">
        <div className="stat-card complaints">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>My Complaints</h3>
            <p className="stat-number">{stats.complaints}</p>
            <div className="stat-trend trend-up">
              ↑ Active requests
            </div>
          </div>
        </div>
        
        <div className="stat-card resolved">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Resolved</h3>
            <p className="stat-number">{stats.resolvedComplaints}</p>
            <div className="stat-trend trend-up">
              ↑ Completed issues
            </div>
          </div>
        </div>
        
        <div className="stat-card lost">
          <div className="stat-icon">🔍</div>
          <div className="stat-content">
            <h3>Lost Items</h3>
            <p className="stat-number">{stats.lostItems}</p>
            <div className="stat-trend trend-down">
              ↓ Items reported
            </div>
          </div>
        </div>
        
        <div className="stat-card found">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>Found Items</h3>
            <p className="stat-number">{stats.foundItems}</p>
            <div className="stat-trend trend-up">
              ↑ Available items
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <div className="quick-action-card" onClick={() => window.location.href = '/complaints'}>
          <div className="quick-action-icon">📝</div>
          <h4>New Complaint</h4>
          <p>Report a new issue or request</p>
        </div>
        
        <div className="quick-action-card" onClick={() => window.location.href = '/lost-found?tab=lost'}>
          <div className="quick-action-icon">🔍</div>
          <h4>Report Lost Item</h4>
          <p>Can't find something? Report it here</p>
        </div>
        
        <div className="quick-action-card" onClick={() => window.location.href = '/lost-found?tab=found'}>
          <div className="quick-action-icon">🎯</div>
          <h4>Report Found Item</h4>
          <p>Found something? Help return it</p>
        </div>
        
        <div className="quick-action-card" onClick={() => window.location.href = '/profile'}>
          <div className="quick-action-icon">👤</div>
          <h4>Update Profile</h4>
          <p>Keep your information current</p>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h3>📋 Recent Complaints</h3>
          {recentComplaints.length === 0 ? (
            <div className="empty-state">
              <h4>No complaints yet</h4>
              <p>Get started by creating your first complaint</p>
            </div>
          ) : (
            recentComplaints.map(complaint => (
              <div key={complaint._id} className="dashboard-item">
                <span className="item-title">{complaint.title}</span>
                <span className={`status status-${complaint.status}`}>
                  {complaint.status}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="dashboard-section">
          <h3>🔍 Recently Found Items</h3>
          {recentItems.length === 0 ? (
            <div className="empty-state">
              <h4>No found items</h4>
              <p>Check back later for newly found items</p>
            </div>
          ) : (
            recentItems.map(item => (
              <div key={item._id} className="dashboard-item">
                <span className="item-title">{item.itemName}</span>
                <span className="item-category">{item.category}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;