import React, { useState, useEffect, useCallback } from 'react';
import LostItemForm from '../components/lostfound/LostItemForm';
import FoundItemForm from '../components/lostfound/FoundItemForm';
import ItemGallery from '../components/lostfound/ItemGallery';
import ClaimModal from '../components/lostfound/ClaimModal';
import { lostFoundAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './LostFoundPage.css';

const LostFoundPage = () => {
  // const { user } = useAuth(); // not used in this page
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery', 'lost', 'found', 'myItems'
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [myItems, setMyItems] = useState({
    lostItems: [],
    foundItems: []
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'gallery' || activeTab === 'lost') {
        const result = await lostFoundAPI.getLostItems({ status: 'lost' });
        // Handle both response structures
        const lostItemsData = Array.isArray(result.data) ? result.data : result.data?.data || [];
        setLostItems(lostItemsData);
      }
      
      if (activeTab === 'gallery' || activeTab === 'found') {
        const result = await lostFoundAPI.getFoundItems({ status: 'found' });
        // Handle both response structures
        const foundItemsData = Array.isArray(result.data) ? result.data : result.data?.data || [];
        setFoundItems(foundItemsData);
      }
      
      if (activeTab === 'myItems') {
        const result = await lostFoundAPI.getMyItems();
        // Handle both response structures - myItems is an object with lostItems and foundItems arrays
        const myItemsData = result.data || {};
        setMyItems({
          lostItems: Array.isArray(myItemsData.lostItems) ? myItemsData.lostItems : [],
          foundItems: Array.isArray(myItemsData.foundItems) ? myItemsData.foundItems : []
        });
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleReportLost = async (itemData) => {
    try {
      await lostFoundAPI.reportLost(itemData);
      setActiveTab('gallery');
      fetchItems();
    } catch (error) {
      console.error('Error reporting lost item:', error);
      throw error;
    }
  };

  const handleReportFound = async (itemData) => {
    try {
      await lostFoundAPI.reportFound(itemData);
      setActiveTab('gallery');
      fetchItems();
    } catch (error) {
      console.error('Error reporting found item:', error);
      throw error;
    }
  };

  const handleClaimItem = async (itemId, claimData) => {
    try {
      await lostFoundAPI.claimItem(itemId);
      setShowClaimModal(false);
      setSelectedItem(null);
      fetchItems();
    } catch (error) {
      console.error('Error claiming item:', error);
      throw error;
    }
  };

  const handleOpenClaimModal = (item) => {
    setSelectedItem(item);
    setShowClaimModal(true);
  };

  return (
    <div className="lost-found-page">
      <div className="page-header">
        <h1>Lost & Found</h1>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            Browse Items
          </button>
          <button
            className={`tab ${activeTab === 'lost' ? 'active' : ''}`}
            onClick={() => setActiveTab('lost')}
          >
            Report Lost
          </button>
          <button
            className={`tab ${activeTab === 'found' ? 'active' : ''}`}
            onClick={() => setActiveTab('found')}
          >
            Report Found
          </button>
          <button
            className={`tab ${activeTab === 'myItems' ? 'active' : ''}`}
            onClick={() => setActiveTab('myItems')}
          >
            My Items
          </button>
        </div>

        <div className="tab-content">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {activeTab === 'gallery' && (
                <ItemGallery
                  lostItems={lostItems}
                  foundItems={foundItems}
                  onClaimItem={handleOpenClaimModal}
                />
              )}

              {activeTab === 'lost' && (
                <LostItemForm
                  onSubmit={handleReportLost}
                  onCancel={() => setActiveTab('gallery')}
                />
              )}

              {activeTab === 'found' && (
                <FoundItemForm
                  onSubmit={handleReportFound}
                  onCancel={() => setActiveTab('gallery')}
                />
              )}

              {activeTab === 'myItems' && (
                <ItemGallery
                  lostItems={myItems.lostItems} // Pass the array, not the object
                  foundItems={myItems.foundItems} // Pass the array, not the object
                  showUserItems={true}
                />
              )}
            </>
          )}
        </div>
      </div>

      {showClaimModal && selectedItem && (
        <ClaimModal
          item={selectedItem}
          onClose={() => {
            setShowClaimModal(false);
            setSelectedItem(null);
          }}
          onClaim={handleClaimItem}
        />
      )}
    </div>
  );
};

export default LostFoundPage;