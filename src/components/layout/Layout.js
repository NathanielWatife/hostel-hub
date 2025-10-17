import React from 'react';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>&copy; 2024 HostelHub. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Layout;