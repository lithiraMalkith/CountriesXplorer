import React, { useContext } from 'react';
import { AuthContext } from '../App';

const Home = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Auth App</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={logout}
                className="ml-4 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome, {user?.name}!
              </h2>
              <p className="text-gray-600 mb-6">
                You are logged in as a <span className="font-semibold">{user?.role}</span>
              </p>
              
              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">Site Information</h3>
                <p className="text-gray-700 mb-4">
                  This is a simple authentication application with JWT token-based authentication.
                  Both regular users and administrators are directed to this same home page.
                </p>
                {user?.role === 'admin' && (
                  <div className="mt-6 p-4 bg-purple-100 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-800 mb-2">Admin Panel</h4>
                    <p className="text-gray-700">
                      As an administrator, you have access to additional features and user management.
                      You can manage users and perform administrative tasks.
                    </p>
                    <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-300">
                      Manage Users
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} Auth App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
