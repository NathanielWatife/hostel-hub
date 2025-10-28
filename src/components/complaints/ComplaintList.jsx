import React from 'react';
import ComplaintCard from './ComplaintCard';
import { COMPLAINT_CATEGORIES, COMPLAINT_STATUSES, COMPLAINT_PRIORITIES } from '../../utils/constants';
import './ComplaintList.css';

const ComplaintList = ({ 
  complaints, 
  filters, 
  onFilterChange, 
  onViewDetails, 
  onStatusUpdate,
  userRole 
}) => {
  const handleFilterChange = (filterType, value) => {
    onFilterChange({
      ...filters,
      [filterType]: value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      status: '',
      category: '',
      priority: ''
    });
  };

  const hasActiveFilters = filters.status || filters.category || filters.priority;

  return (
    <div className="complaint-list">
      <div className="filters-section">
        <h3>Filters</h3>
        <div className="filter-controls">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            {COMPLAINT_STATUSES.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {COMPLAINT_CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="filter-select"
          >
            <option value="">All Priorities</option>
            {COMPLAINT_PRIORITIES.map(priority => (
              <option key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button 
              onClick={clearFilters}
              className="btn btn-secondary btn-sm"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="complaints-grid">
        {complaints.length === 0 ? (
          <div className="empty-state">
            <h3>No complaints found</h3>
            <p>
              {hasActiveFilters 
                ? 'Try adjusting your filters to see more results.' 
                : 'Get started by creating your first complaint.'
              }
            </p>
          </div>
        ) : (
          complaints.map(complaint => (
            <ComplaintCard
              key={complaint._id}
              complaint={complaint}
              onViewDetails={onViewDetails}
              onStatusUpdate={onStatusUpdate}
              userRole={userRole}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ComplaintList;