import React from 'react';
import { useComplaints } from '../../contexts/ComplaintContext';
import { FiX } from 'react-icons/fi';

function ComplaintFilters() {
  const { filters, setFilters, categories, priorities, statuses } = useComplaints();

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      category: 'all',
      priority: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const hasActiveFilters = filters.status !== 'all' || 
                          filters.category !== 'all' || 
                          filters.priority !== 'all';

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium text-gray-900">Filter Complaints</h4>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-500 flex items-center space-x-1"
          >
            <FiX className="w-4 h-4" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-xs font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">All Statuses</option>
            {Object.entries(statuses).map(([key, status]) => (
              <option key={key} value={key}>
                {status.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-xs font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">All Categories</option>
            {Object.entries(categories).map(([key, category]) => (
              <option key={key} value={key}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label htmlFor="priority" className="block text-xs font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            id="priority"
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">All Priorities</option>
            {Object.entries(priorities).map(([key, priority]) => (
              <option key={key} value={key}>
                {priority.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label htmlFor="sortBy" className="block text-xs font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            id="sortBy"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="createdAt">Date Created</option>
            <option value="updatedAt">Last Updated</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      {/* Sort Order */}
      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="sortOrder"
            value="desc"
            checked={filters.sortOrder === 'desc'}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
          />
          <span className="ml-2 text-sm text-gray-700">Newest First</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="sortOrder"
            value="asc"
            checked={filters.sortOrder === 'asc'}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
          />
          <span className="ml-2 text-sm text-gray-700">Oldest First</span>
        </label>
      </div>
    </div>
  );
}

export default ComplaintFilters;