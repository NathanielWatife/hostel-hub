import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { complaintAPI, lostFoundAPI, usersAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmModal from '../components/common/ConfirmModal';
import Toast from '../components/common/Toast';
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
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersPage, setUsersPage] = useState(1);
  const [usersLimit] = useState(10);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersQuery, setUsersQuery] = useState('');
  // Complaints management states
  const [complaints, setComplaints] = useState([]);
  const [complaintsLoading, setComplaintsLoading] = useState(false);
  const [complaintsPage, setComplaintsPage] = useState(1);
  const [complaintsLimit] = useState(12);
  const [complaintsTotalPages, setComplaintsTotalPages] = useState(1);
  const [staff, setStaff] = useState([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmPayload, setConfirmPayload] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [loading, setLoading] = useState(true);

  

  const fetchAdminData = useCallback(async () => {
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
      // fetch users (basic)
      try {
        setUsersLoading(true);
        const usersRes = await usersAPI.getAll({ page: 1, limit: usersLimit, q: '' });
        setUsers(usersRes.data || []);
        if (usersRes.pagination) {
          setUsersTotalPages(usersRes.pagination.pages || 1);
          setStats(prev => ({ ...prev, totalUsers: usersRes.pagination.total || (usersRes.data || []).length }));
        }
      } catch (err) {
        console.warn('Could not fetch users for admin panel', err);
      } finally {
        setUsersLoading(false);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  }, [usersLimit]);

  const fetchUsers = async (page = 1, q = '') => {
    try {
      setUsersLoading(true);
      const res = await usersAPI.getAll({ page, limit: usersLimit, q });
      setUsers(res.data || []);
      if (res.pagination) setUsersTotalPages(res.pagination.pages || 1);
      setUsersPage(page);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchComplaints = useCallback(async (page = 1, q = '') => {
    try {
      setComplaintsLoading(true);
      const res = await complaintAPI.getAll({ page, limit: complaintsLimit, q });
      setComplaints(res.data || []);
      if (res.pagination) setComplaintsTotalPages(res.pagination.pages || 1);
      setComplaintsPage(page);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setComplaintsLoading(false);
    }
  }, [complaintsLimit]);

  const fetchStaff = useCallback(async () => {
    try {
      setStaffLoading(true);
      const res = await usersAPI.getAll({ page: 1, limit: 50, role: 'staff' });
      setStaff(res.data || []);
    } catch (err) {
      console.error('Error fetching staff users:', err);
    } finally {
      setStaffLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user, fetchAdminData]);

  useEffect(() => {
    // When the complaints tab becomes active, load complaints and staff list
    if (activeTab === 'complaints') {
      fetchComplaints(1);
      fetchStaff();
    }
  }, [activeTab, fetchComplaints, fetchStaff]);

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
            <p>Manage complaints: update status and assign to staff.</p>

            <div style={{marginTop: 12}}>
              {complaintsLoading ? (
                <LoadingSpinner />
              ) : (
                <div style={{overflowX: 'auto'}}>
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Reporter</th>
                        <th>Status</th>
                        <th>Assigned To</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map(c => (
                        <tr key={c._id}>
                          <td style={{maxWidth: 300}}>{c.title}</td>
                          <td>{c.anonymous ? 'Anonymous' : c.userId?.fullName || '-'}</td>
                          <td>
                            <select value={c.status} onChange={(e) => {
                              const newStatus = e.target.value;
                              setConfirmPayload({ type: 'update-complaint-status', complaint: c, newStatus });
                              setConfirmOpen(true);
                            }}>
                              <option value="submitted">submitted</option>
                              <option value="in-review">in-review</option>
                              <option value="assigned">assigned</option>
                              <option value="in-progress">in-progress</option>
                              <option value="resolved">resolved</option>
                              <option value="closed">closed</option>
                            </select>
                          </td>
                          <td>
                            <select disabled={staffLoading} value={c.assignedTo?._id || ''} onChange={(e) => {
                              const staffId = e.target.value || null;
                              setConfirmPayload({ type: 'assign-complaint', complaint: c, staffId });
                              setConfirmOpen(true);
                            }}>
                              <option value="">-- Unassigned --</option>
                              {staff.map(s => (
                                <option key={s._id} value={s._id}>{s.fullName} ({s.email})</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline" onClick={() => window.location.href = `/complaints/${c._id}`}>View</button>
                          </td>
                        </tr>
                      ))}
                      {complaints.length === 0 && (
                        <tr><td colSpan={5}>No complaints found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              <div style={{display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12}}>
                <button className="btn btn-sm btn-outline" disabled={complaintsPage <= 1 || complaintsLoading} onClick={() => fetchComplaints(complaintsPage - 1)}>Previous</button>
                <button className="btn btn-sm btn-outline" disabled={complaintsPage >= complaintsTotalPages || complaintsLoading} onClick={() => fetchComplaints(complaintsPage + 1)}>Next</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-tab">
            <h3>User Management</h3>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 12}}>
              <div>
                <input
                  type="search"
                  placeholder="Search users by name or email"
                  value={usersQuery}
                  onChange={(e) => setUsersQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') fetchUsers(1, usersQuery); }}
                  style={{padding: '8px 10px', borderRadius: 6, border: '1px solid #e6e6e6'}}
                />
                <button className="btn btn-sm btn-outline" style={{marginLeft: 8}} onClick={() => fetchUsers(1, usersQuery)}>Search</button>
                <button className="btn btn-sm" style={{marginLeft: 8}} onClick={() => { setUsersQuery(''); fetchUsers(1, ''); }}>Clear</button>
              </div>
              <div style={{color: '#6c757d'}}>{usersTotalPages > 0 ? `Page ${usersPage} of ${usersTotalPages}` : ''}</div>
            </div>

            <div style={{overflowX: 'auto', marginTop: 12}}>
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Hostel</th>
                    <th>Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>{u.fullName}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{u.hostelBlock || '-'} {u.roomNumber ? `#${u.roomNumber}` : ''}</td>
                      <td>{u.isActive ? 'Yes' : 'No'}</td>
                      <td>
                        <button className="btn btn-sm btn-outline" onClick={() => {
                          setConfirmPayload({ type: 'toggle-active', user: u });
                          setConfirmOpen(true);
                        }}>{u.isActive ? 'Deactivate' : 'Activate'}</button>
                        <select value={u.role} onChange={(e) => {
                          const newRole = e.target.value;
                          setConfirmPayload({ type: 'change-role', user: u, newRole });
                          setConfirmOpen(true);
                        }} style={{marginLeft: 8}}>
                          <option value="student">student</option>
                          <option value="staff">staff</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={6}>No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12}}>
              <button className="btn btn-sm btn-outline" disabled={usersPage <= 1 || usersLoading} onClick={() => fetchUsers(usersPage - 1, usersQuery)}>Previous</button>
              <button className="btn btn-sm btn-outline" disabled={usersPage >= usersTotalPages || usersLoading} onClick={() => fetchUsers(usersPage + 1, usersQuery)}>Next</button>
            </div>
          </div>
        )}

        <ConfirmModal
          open={confirmOpen}
          title={confirmPayload?.type === 'change-role' ? 'Change user role' : 'Confirm action'}
          message={confirmPayload?.type === 'change-role' ? `Change role for ${confirmPayload.user?.fullName} to ${confirmPayload.newRole}?` : `Are you sure you want to ${confirmPayload?.user?.isActive ? 'deactivate' : 'activate'} ${confirmPayload?.user?.fullName}?`}
          onCancel={() => { setConfirmOpen(false); setConfirmPayload(null); }}
          onConfirm={async () => {
            if (!confirmPayload) return;
            try {
              if (confirmPayload.type === 'toggle-active') {
                const updated = await usersAPI.update(confirmPayload.user._id, { isActive: !confirmPayload.user.isActive });
                setUsers(prev => prev.map(x => x._id === updated.data._id ? updated.data : x));
                setToast({ message: `User ${updated.data.fullName} updated`, type: 'success' });
              } else if (confirmPayload.type === 'change-role') {
                const updated = await usersAPI.update(confirmPayload.user._id, { role: confirmPayload.newRole });
                setUsers(prev => prev.map(x => x._id === updated.data._id ? updated.data : x));
                setToast({ message: `Role updated to ${confirmPayload.newRole}`, type: 'success' });
              } else if (confirmPayload.type === 'update-complaint-status') {
                const { complaint, newStatus } = confirmPayload;
                const updated = await complaintAPI.updateStatus(complaint._id, newStatus);
                setComplaints(prev => prev.map(c => c._id === updated.data._id ? updated.data : c));
                setToast({ message: `Complaint status updated to ${newStatus}`, type: 'success' });
              } else if (confirmPayload.type === 'assign-complaint') {
                const { complaint, staffId } = confirmPayload;
                const payload = { assignedTo: staffId || null };
                const updated = await complaintAPI.update(complaint._id, payload);
                setComplaints(prev => prev.map(c => c._id === updated.data._id ? updated.data : c));
                setToast({ message: `Complaint assignment updated`, type: 'success' });
              }
            } catch (err) {
              console.error('Action failed', err);
              setToast({ message: 'Action failed', type: 'error' });
            } finally {
              setConfirmOpen(false);
              setConfirmPayload(null);
            }
          }}
        />

        {toast.message && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />
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