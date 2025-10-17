import React, { useState } from 'react';
import { useComplaints } from '../../contexts/ComplaintContext';
import ComplaintForm from './ComplaintForm';
import ComplaintList from './ComplaintList';
import ComplaintFilters from './ComplaintFilters';
import { FiPlus, FiList, FiFilter } from 'react-icons/fi';

function ComplaintManagement() {
  const [activeTab, setActiveTab] = useState('list');
  const [showFilters, setShowFilters] = useState(false);
  const { complaints, loading } = useComplaints();

  const stats = {
    total: complaints.length,
    open: complaints.filter(c => ['submitted', 'in-review', 'assigned', 'in-progress'].includes(c.status)).length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    urgent: complaints.filter(c => c.priority === 'emergency').length
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Complaint Management</h1>
        <p className="text-gray-600 mt-2">Report and track hostel maintenance issues</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Complaints</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FiList className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Issues</p>
              <p className="text-2xl font-bold text-gray-900">{stats.open}</p>
            </div>
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-500 text-sm font-bold">{stats.open}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-500 text-sm font-bold">{stats.resolved}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Urgent</p>
              <p className="text-2xl font-bold text-gray-900">{stats.urgent}</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-500 text-sm font-bold">!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Actions */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <div className="flex justify-between items-center px-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('list')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'list'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FiList className="w-4 h-4" />
                  <span>All Complaints ({complaints.length})</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('new')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'new'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FiPlus className="w-4 h-4" />
                  <span>New Complaint</span>
                </div>
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                  showFilters 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiFilter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="px-6 py-4 border-b border-gray-200">
            <ComplaintFilters />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {activeTab === 'list' && <ComplaintList />}
          {activeTab === 'new' && <ComplaintForm onSuccess={() => setActiveTab('list')} />}
        </div>
      </div>
    </div>
  );
}

export default ComplaintManagement;