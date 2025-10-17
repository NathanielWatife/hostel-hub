import React, { useState } from 'react';
import { useComplaints } from '../../contexts/ComplaintContext';
import { useAuth } from '../../contexts/AuthContext';
import { FiUpload, FiX, FiAlertTriangle } from 'react-icons/fi';

function ComplaintForm({ onSuccess }) {
  const { submitComplaint, categories, priorities } = useComplaints();
  const { userData } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    location: {
      block: userData?.block || '',
      floor: '',
      roomNumber: userData?.roomNumber || ''
    },
    isAnonymous: false
  });
  
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    // Validate file types and sizes
    const validFiles = selectedFiles.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isValidType) {
        alert(`File ${file.name} is not a supported image type (JPEG, PNG, WebP only)`);
        return false;
      }
      if (!isValidSize) {
        alert(`File ${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getPrioritySuggestion = (category) => {
    const urgentCategories = ['plumbing', 'electrical', 'security'];
    return urgentCategories.includes(category) ? 'high' : 'medium';
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setFormData(prev => ({
      ...prev,
      category,
      priority: category ? getPrioritySuggestion(category) : 'medium'
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Please enter a title for your complaint');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Please describe the issue');
      return false;
    }
    if (formData.description.length > 500) {
      setError('Description must be less than 500 characters');
      return false;
    }
    if (!formData.category) {
      setError('Please select a category');
      return false;
    }
    if (!formData.location.block || !formData.location.roomNumber) {
      setError('Please provide your block and room number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    const result = await submitComplaint(formData, files);
    
    if (result.success) {
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        location: {
          block: userData?.block || '',
          floor: '',
          roomNumber: userData?.roomNumber || ''
        },
        isAnonymous: false
      });
      setFiles([]);
      onSuccess();
    } else {
      setError(result.error || 'Failed to submit complaint');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Submit New Complaint</h2>
          <p className="text-gray-600 text-sm mt-1">
            Provide details about the issue you're experiencing
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <div className="flex items-center">
                <FiAlertTriangle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Complaint Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Brief description of the issue"
                maxLength={100}
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleCategoryChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select a category</option>
                {Object.entries(categories).map(([key, category]) => (
                  <option key={key} value={key}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {Object.entries(priorities).map(([key, priority]) => (
                  <option key={key} value={key}>
                    {priority.name}
                  </option>
                ))}
              </select>
              {formData.category && (
                <p className="mt-1 text-xs text-gray-500">
                  Suggested: {priorities[getPrioritySuggestion(formData.category)].name}
                </p>
              )}
            </div>
          </div>

          {/* Location Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="block" className="block text-sm font-medium text-gray-700">
                Block *
              </label>
              <input
                type="text"
                id="block"
                name="location.block"
                required
                value={formData.location.block}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., A, B, C"
              />
            </div>

            <div>
              <label htmlFor="floor" className="block text-sm font-medium text-gray-700">
                Floor
              </label>
              <input
                type="text"
                id="floor"
                name="location.floor"
                value={formData.location.floor}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 1, 2, 3"
              />
            </div>

            <div>
              <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">
                Room Number *
              </label>
              <input
                type="text"
                id="roomNumber"
                name="location.roomNumber"
                required
                value={formData.location.roomNumber}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 101, 202"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Detailed Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Please provide a detailed description of the issue..."
              maxLength={500}
            />
            <div className="mt-1 text-xs text-gray-500 text-right">
              {formData.description.length}/500 characters
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Attach Images (Optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                  >
                    <span>Upload images</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, WebP up to 5MB each
                </p>
              </div>
            </div>

            {/* File Preview */}
            {files.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {files.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                      <p className="text-xs text-gray-600 truncate mt-1">{file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Anonymous Reporting */}
          <div className="flex items-center">
            <input
              id="isAnonymous"
              name="isAnonymous"
              type="checkbox"
              checked={formData.isAnonymous}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isAnonymous" className="ml-2 block text-sm text-gray-900">
              Submit anonymously (your name will not be visible to staff)
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onSuccess}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ComplaintForm;