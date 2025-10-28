import React, { useState } from 'react';
import ItemCard from './ItemCard';
import './ItemGallery.css';

const ItemGallery = ({ 
  lostItems = [], 
  foundItems = [], 
  onClaimItem, 
  showUserItems = false 
}) => {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'lost', 'found'
  const [categoryFilter, setCategoryFilter] = useState('');

  const filteredLostItems = lostItems.filter(item => 
    !categoryFilter || item.category === categoryFilter
  );

  const filteredFoundItems = foundItems.filter(item => 
    !categoryFilter || item.category === categoryFilter
  );

  const displayLostItems = activeFilter === 'all' || activeFilter === 'lost';
  const displayFoundItems = activeFilter === 'all' || activeFilter === 'found';

  return (
    <div className="item-gallery">
      <div className="gallery-controls">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Items ({lostItems.length + foundItems.length})
          </button>
          <button
            className={`filter-tab ${activeFilter === 'lost' ? 'active' : ''}`}
            onClick={() => setActiveFilter('lost')}
          >
            Lost Items ({lostItems.length})
          </button>
          <button
            className={`filter-tab ${activeFilter === 'found' ? 'active' : ''}`}
            onClick={() => setActiveFilter('found')}
          >
            Found Items ({foundItems.length})
          </button>
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="category-filter"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="books">Books</option>
          <option value="keys">Keys</option>
          <option value="id-card">ID Card</option>
          <option value="clothing">Clothing</option>
          <option value="bags">Bags</option>
          <option value="accessories">Accessories</option>
          <option value="other">Other</option>
        </select>
      </div>

      {displayLostItems && filteredLostItems.length > 0 && (
        <div className="items-section">
          <h3 className="section-title">
            Lost Items ({filteredLostItems.length})
          </h3>
          <div className="items-grid">
            {filteredLostItems.map(item => (
              <ItemCard
                key={item._id}
                item={item}
                type="lost"
                onClaim={onClaimItem}
                showUserItems={showUserItems}
              />
            ))}
          </div>
        </div>
      )}

      {displayFoundItems && filteredFoundItems.length > 0 && (
        <div className="items-section">
          <h3 className="section-title">
            Found Items ({filteredFoundItems.length})
          </h3>
          <div className="items-grid">
            {filteredFoundItems.map(item => (
              <ItemCard
                key={item._id}
                item={item}
                type="found"
                onClaim={onClaimItem}
                showUserItems={showUserItems}
              />
            ))}
          </div>
        </div>
      )}

      {filteredLostItems.length === 0 && filteredFoundItems.length === 0 && (
        <div className="empty-gallery">
          <h3>No items found</h3>
          <p>
            {categoryFilter 
              ? 'No items match the selected category. Try changing the filter.' 
              : showUserItems 
                ? "You haven't reported any lost or found items yet."
                : 'No lost or found items have been reported yet.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ItemGallery;