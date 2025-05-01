import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getAllCountries, getCountriesByName, getCountriesByRegion } from '../services/api';
import { AuthContext } from '../App';

const HomePage = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const { user, logout } = useContext(AuthContext);

  // Regions for filter dropdown
  const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  // Fetch all countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const data = await getAllCountries();
        setCountries(data);
        setFilteredCountries(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch countries');
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Handle search input change
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim() === '') {
      // If search is empty, reset to all countries or filtered by region
      if (selectedRegion) {
        const regionFiltered = countries.filter(country => 
          country.region === selectedRegion
        );
        setFilteredCountries(regionFiltered);
      } else {
        setFilteredCountries(countries);
      }
    } else {
      // Search by name
      try {
        let results;
        if (selectedRegion) {
          // If region is selected, filter the search results by region
          results = await getCountriesByName(value);
          results = results.filter(country => country.region === selectedRegion);
        } else {
          results = await getCountriesByName(value);
        }
        setFilteredCountries(results);
      } catch (err) {
        setFilteredCountries([]);
      }
    }
  };

  // Handle region filter change
  const handleRegionChange = async (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    
    if (region === '') {
      // If no region selected, show all countries or filtered by search
      if (searchTerm) {
        try {
          const results = await getCountriesByName(searchTerm);
          setFilteredCountries(results);
        } catch (err) {
          setFilteredCountries([]);
        }
      } else {
        setFilteredCountries(countries);
      }
    } else {
      // Filter by region
      try {
        let results = await getCountriesByRegion(region);
        
        // If there's also a search term, filter by name within the region
        if (searchTerm) {
          results = results.filter(country => 
            country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        setFilteredCountries(results);
      } catch (err) {
        setFilteredCountries([]);
      }
    }
  };

  // Render orbs for background effects
  const renderOrbs = () => (
    <>
      {/* Main orbs */}
      <div className="orb bg-blue-500 w-96 h-96 top-1/4 -left-48 opacity-30"></div>
      <div className="orb bg-blue-300 w-80 h-80 bottom-1/4 -right-40 opacity-30"></div>
      <div className="orb bg-blue-400 w-64 h-64 top-3/4 left-1/4 opacity-20"></div>
      <div className="orb bg-blue-200 w-72 h-72 top-1/3 right-1/4 opacity-20"></div>
      <div className="orb bg-blue-300 w-48 h-48 bottom-1/3 left-1/3 opacity-20"></div>
      
      {/* Top corner orbs */}
      <div className="orb bg-blue-500 w-60 h-60 top-0 right-0 opacity-25"></div>
      <div className="orb bg-blue-400 w-40 h-40 top-10 right-20 opacity-20"></div>
      <div className="orb bg-blue-300 w-32 h-32 top-20 right-10 opacity-15"></div>
      
      {/* Additional orbs for better coverage */}
      <div className="orb bg-blue-400 w-60 h-60 top-1/2 left-1/2 opacity-15"></div>
      <div className="orb bg-blue-200 w-40 h-40 top-2/3 right-1/3 opacity-20"></div>
      <div className="orb bg-blue-300 w-56 h-56 bottom-1/2 right-1/2 opacity-15"></div>
      <div className="orb bg-blue-500 w-32 h-32 top-1/4 right-1/4 opacity-25"></div>
      <div className="orb bg-blue-400 w-48 h-48 bottom-1/4 left-1/2 opacity-20"></div>
      <div className="orb bg-blue-300 w-64 h-64 top-2/3 -right-20 opacity-15"></div>
      <div className="orb bg-blue-200 w-72 h-72 bottom-2/3 -left-20 opacity-15"></div>
    </>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black relative overflow-hidden">
        {renderOrbs()}
        <div className="w-16 h-16 relative z-10">
          <div className="absolute inset-0 border-2 border-white rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-2 border-2 border-white rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white relative overflow-hidden">
        {renderOrbs()}
        <div className="text-red-400 text-xl z-10">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Orb Effects */}
      {renderOrbs()}

      {/* Navigation */}
      <nav className="bg-transparent border-b border-gray-800 sticky top-0 z-40 backdrop-blur-sm bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-base font-bold tracking-tighter">
                <span className="text-white">Countries</span>
                <span className="text-blue-500">Xplorer</span>
              </Link>
            </div>
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center ">
                  <span className="mr-4 text-gray-300">Welcome, <span className="text-white font-mono">{user.name}</span></span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-full border border-gray-700 text-white hover:bg-gray-800 transition duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-full border border-gray-700 text-white hover:bg-gray-800 transition duration-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-full bg-black border border-gray-700 text-white hover:bg-gray-800 transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-2/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a country..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-white focus:border-gray-600 text-white"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <select
              value={selectedRegion}
              onChange={handleRegionChange}
              className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-white focus:border-gray-600 text-white appearance-none font-mono"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
              }}
            >
              <option value="" className="bg-black">Filter by Region</option>
              {regions.map(region => (
                <option key={region} value={region} className="bg-black">{region}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Countries Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10">
          {filteredCountries.length > 0 ? (
            filteredCountries.map(country => (
              <Link 
                to={`/country/${country.cca3}`} 
                key={country.cca3}
                className="bg-black border border-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-white/5 transition duration-300 transform hover:-translate-y-1 backdrop-blur-sm bg-opacity-30"
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={country.flags.png}
                    alt={`Flag of ${country.name.common}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xs font-bold mb-2 text-white">{country.name.common}</h2>
                  <div className="text-xs text-gray-400 font-mono">
                    <p className="mb-1"><span className="font-semibold text-gray-300">Population:</span> {country.population.toLocaleString()}</p>
                    <p className="mb-1"><span className="font-semibold text-gray-300">Region:</span> {country.region}</p>
                    <p><span className="font-semibold text-gray-300">Capital:</span> {country.capital?.[0] || 'N/A'}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-400 text-xs font-mono">No countries found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8 mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-base font-bold tracking-tighter">
                <span className="text-white">Countries</span>
                <span className="text-blue-500">Xplorer</span>
              </div>
              <p className="text-gray-500 mt-2 font-mono text-sm">
                &copy; {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4 font-mono">Resources</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-500 hover:text-white transition-colors">About</Link></li>
                  <li><Link to="/" className="text-gray-500 hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link to="/" className="text-gray-500 hover:text-white transition-colors">Privacy</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4 font-mono">Connect</h3>
                <ul className="space-y-2">
                  <li><a href="https://twitter.com" className="text-gray-500 hover:text-white transition-colors">Twitter</a></li>
                  <li><a href="https://github.com" className="text-gray-500 hover:text-white transition-colors">GitHub</a></li>
                  <li><a href="mailto:contact@example.com" className="text-gray-500 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
