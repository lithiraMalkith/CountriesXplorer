import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getCountryByCode } from '../services/api';
import { AuthContext } from '../App';

const CountryDetailPage = () => {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setLoading(true);
        const data = await getCountryByCode(code);
        setCountry(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch country details');
        setLoading(false);
      }
    };

    fetchCountry();
  }, [code]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 border-2 border-white rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-2 border-2 border-white rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <div className="text-red-400 text-xl mb-4">{error || 'Country not found'}</div>
        <button 
          onClick={() => navigate('/home')}
          className="px-6 py-2 rounded-full bg-black border border-gray-700 text-white hover:bg-gray-800 transition-all"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Extract languages as an array
  const languages = country.languages ? Object.values(country.languages) : [];
  
  // Extract currencies as an array
  const currencies = country.currencies 
    ? Object.values(country.currencies).map(currency => `${currency.name} (${currency.symbol || 'N/A'})`) 
    : [];

  // Extract border countries
  const borders = country.borders || [];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="bg-black border-b border-gray-800 sticky top-0 z-40 backdrop-blur-sm bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/home" className="text-base font-bold tracking-tighter">
                <span className="text-white">Countries</span>
                <span className="text-blue-500">Xplorer</span>
              </Link>
            </div>
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center">
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

      {/* Orb Effects */}
      <div className="orb bg-blue-500 w-96 h-96 top-1/4 -left-48 opacity-30"></div>
      <div className="orb bg-blue-300 w-80 h-80 bottom-1/4 -right-40 opacity-30"></div>
      <div className="orb bg-blue-400 w-64 h-64 top-3/4 left-1/4 opacity-20"></div>
      <div className="orb bg-blue-200 w-72 h-72 top-1/3 right-1/4 opacity-20"></div>
      <div className="orb bg-blue-300 w-48 h-48 bottom-1/3 left-1/3 opacity-20"></div>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <button 
          onClick={() => navigate('/home')}
          className="px-6 py-2 bg-transparent border border-gray-800 shadow-md rounded-full flex items-center hover:bg-gray-900 transition duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
      </div>

      {/* Country Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="bg-transparent border border-gray-800 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm bg-opacity-30">
          <div className="md:flex">
            <div className="md:w-1/2 relative">
              <img 
                src={country.flags.svg} 
                alt={`Flag of ${country.name.common}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-30"></div>
            </div>
            <div className="p-6 md:w-1/2">
              <h2 className="text-2xl font-bold mb-6 text-white">{country.name.common}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="font-mono">
                  <p className="mb-2"><span className="font-semibold text-gray-300">Official Name:</span> <span className="text-gray-400">{country.name.official}</span></p>
                  <p className="mb-2"><span className="font-semibold text-gray-300">Population:</span> <span className="text-gray-400">{country.population.toLocaleString()}</span></p>
                  <p className="mb-2"><span className="font-semibold text-gray-300">Region:</span> <span className="text-gray-400">{country.region}</span></p>
                  <p className="mb-2"><span className="font-semibold text-gray-300">Sub Region:</span> <span className="text-gray-400">{country.subregion || 'N/A'}</span></p>
                  <p className="mb-2"><span className="font-semibold text-gray-300">Capital:</span> <span className="text-gray-400">{country.capital?.[0] || 'N/A'}</span></p>
                </div>
                
                <div className="font-mono">
                  <p className="mb-2"><span className="font-semibold text-gray-300">Top Level Domain:</span> <span className="text-gray-400">{country.tld?.[0] || 'N/A'}</span></p>
                  <p className="mb-2">
                    <span className="font-semibold text-gray-300">Currencies:</span>{' '}
                    <span className="text-gray-400">{currencies.length > 0 ? currencies.join(', ') : 'N/A'}</span>
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold text-gray-300">Languages:</span>{' '}
                    <span className="text-gray-400">{languages.length > 0 ? languages.join(', ') : 'N/A'}</span>
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold text-gray-300">Area:</span>{' '}
                    <span className="text-gray-400">{country.area ? `${country.area.toLocaleString()} km²` : 'N/A'}</span>
                  </p>
                </div>
              </div>
              
              {/* Border Countries */}
              <div className="mt-8">
                <h3 className="text-base font-semibold mb-3 text-gray-200 font-mono">Border Countries:</h3>
                <div className="flex flex-wrap gap-2">
                  {borders.length > 0 ? (
                    borders.map(border => (
                      <Link
                        key={border}
                        to={`/country/${border}`}
                        className="px-4 py-1 bg-transparent border border-gray-700 rounded-full hover:bg-gray-900 transition duration-300 font-mono"
                      >
                        {border}
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-400 font-mono">No bordering countries</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Map Section */}
          <div className="p-6 border-t border-gray-800">
            <h3 className="text-base font-semibold mb-3 text-gray-200 font-mono">Location:</h3>
            {country.maps?.googleMaps && (
              <div className="mt-4">
                <a 
                  href={country.maps.googleMaps} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-transparent border border-gray-700 text-white hover:bg-gray-900 transition-all inline-block font-mono"
                >
                  View on Google Maps
                </a>
              </div>
            )}
          </div>
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

export default CountryDetailPage;
