import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  arrayUnion,
  arrayRemove,
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  getDocs,
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { useAuth } from './AuthContext';

const ComplaintContext = createContext();

export function useComplaints() {
  return useContext(ComplaintContext);
}

export function ComplaintProvider({ children }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const { userData } = useAuth();

  // Categories with icons and colors
  const categories = {
    plumbing: { name: 'Plumbing', color: 'bg-blue-100 text-blue-800', icon: '💧' },
    electrical: { name: 'Electrical', color: 'bg-yellow-100 text-yellow-800', icon: '⚡' },
    wifi: { name: 'Wi-Fi', color: 'bg-purple-100 text-purple-800', icon: '📶' },
    furniture: { name: 'Furniture', color: 'bg-orange-100 text-orange-800', icon: '🪑' },
    cleaning: { name: 'Cleaning', color: 'bg-green-100 text-green-800', icon: '🧹' },
    security: { name: 'Security', color: 'bg-red-100 text-red-800', icon: '🔒' },
    noise: { name: 'Noise', color: 'bg-indigo-100 text-indigo-800', icon: '🔊' }
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

  // Upload images to Firebase Storage
  const uploadImages = async (files, complaintId) => {
    const uploadPromises = files.map(async (file) => {
      const storageRef = ref(storage, `complaints/${complaintId}/${file.name}`);
      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
    });

    return Promise.all(uploadPromises);
  };

  // Submit new complaint
  const submitComplaint = async (complaintData, files = []) => {
    try {
      const complaintRef = collection(db, 'complaints');
      const complaintDoc = {
        ...complaintData,
        status: 'submitted',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: userData.uid
      };

      // Add complaint to Firestore
      const docRef = await addDoc(complaintRef, complaintDoc);
      
      // Upload images if any
      let imageUrls = [];
      if (files.length > 0) {
        imageUrls = await uploadImages(files, docRef.id);
        await updateDoc(docRef, { imageUris: imageUrls });
      }

      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error submitting complaint:', error);
      return { success: false, error: error.message };
    }
  };

  // Update complaint status
  const updateComplaintStatus = async (complaintId, updates) => {
    try {
      const complaintRef = doc(db, 'complaints', complaintId);
      await updateDoc(complaintRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating complaint:', error);
      return { success: false, error: error.message };
    }
  };

  // add comment to complaint
  const addComment = async (complaintId, commentData) => {
  try {
    const complaintRef = doc(db, 'complaints', complaintId);
    await updateDoc(complaintRef, {
      comments: arrayUnion({
        ...commentData,
        timestamp: serverTimestamp()
      }),
      updatedAt: serverTimestamp()
    });
    return { success: true };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { success: false, error: error.message };
    }
  };

  const updateStatusHistory = async (complaintId, newStatus) => {
    try {
      const complaintRef = doc(db, 'complaints', complaintId);
      await updateDoc(complaintRef, {
        statusHistory: arrayUnion({
          status: newStatus,
          timestamp: serverTimestamp(),
          updatedBy: userData.uid
        }),
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating status history:', error);
      return { success: false, error: error.message };
    }
  };

  // Assign complaint to staff
  const assignComplaint = async (complaintId, staffId) => {
    return updateComplaintStatus(complaintId, {
      assignedTo: staffId,
      status: 'assigned'
    });
  };

  // Fetch complaints based on user role and filters
  useEffect(() => {
    if (!userData) return;

    setLoading(true);
    let q = query(collection(db, 'complaints'));

    // Apply filters based on user role
    if (userData.role === 'student') {
      q = query(q, where('createdBy', '==', userData.uid));
    } else if (userData.role === 'staff') {
      q = query(q, where('assignedTo', '==', userData.uid));
    }
    // Admin can see all complaints

    // Apply status filter
    if (filters.status !== 'all') {
      q = query(q, where('status', '==', filters.status));
    }

    // Apply category filter
    if (filters.category !== 'all') {
      q = query(q, where('category', '==', filters.category));
    }

    // Apply priority filter
    if (filters.priority !== 'all') {
      q = query(q, where('priority', '==', filters.priority));
    }

    // Apply sorting
    q = query(q, orderBy(filters.sortBy, filters.sortOrder));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const complaintsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setComplaints(complaintsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching complaints:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userData, filters]);

  const value = {
    complaints,
    loading,
    filters,
    setFilters,
    categories,
    priorities,
    statuses,
    submitComplaint,
    updateComplaintStatus,
    assignComplaint,
    addComment,
    updateStatusHistory
  };

  return (
    <ComplaintContext.Provider value={value}>
      {children}
    </ComplaintContext.Provider>
  );
}