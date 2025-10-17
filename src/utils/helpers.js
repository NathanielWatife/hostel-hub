export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const generateTicketNumber = () => {
  const prefix = 'HOSTEL';
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${year}-${random}`;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const getStatusColor = (status) => {
  const colors = {
    submitted: '#6c757d',
    'in-review': '#17a2b8',
    assigned: '#007bff',
    'in-progress': '#ffc107',
    resolved: '#28a745',
    closed: '#6c757d',
    lost: '#dc3545',
    found: '#28a745',
    returned: '#6c757d',
    claimed: '#ffc107'
  };
  return colors[status] || '#6c757d';
};