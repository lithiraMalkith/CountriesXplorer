import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import FloatingCountriesOrb from '../components/FloatingCountriesOrb';
import { AuthContext } from '../App';
import { getAllCountries } from '../services/api';

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [countries, setCountries] = useState([]);
  const { user, isAuthenticated } = useContext(AuthContext);

  // Fetch countries for the orb
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getAllCountries();
        setCountries(data);
      } catch (err) {
        console.error('Failed to fetch countries for orb:', err);
      }
    };

    fetchCountries();
  }, []);

  // Handle scroll for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="bg-black text-white min-h-screen overflow-hidden">
      {/* Loading Screen */}
      <div 
        className={`fixed inset-0 bg-black z-50 flex items-center justify-center transition-opacity duration-1000 ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="w-24 h-24 relative">
          <div className="absolute inset-0 border-2 border-blue-500 rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-2 border-2 border-white rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-4 bg-black bg-opacity-80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tighter">
            <span className="text-white">Countries</span>
            <span className="text-blue-500">Xplorer</span>
          </div>
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Welcome, <span className="text-white font-mono">{user.name}</span></span>
                <Link 
                  to="/home" 
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:from-blue-700 hover:to-blue-500 transition-all"
                >
                  Explore Countries
                </Link>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:from-blue-700 hover:to-blue-500 transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        {/* Floating Countries Orb Background */}
        <div className="absolute inset-0 z-0 opacity-30">
          {countries.length > 0 && <FloatingCountriesOrb countries={countries} />}
        </div>
        
        {/* Blue Accent Line */}
        <div 
          className="absolute right-0 h-full w-1/3 z-0"
          style={{
            background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(59,130,246,0.1) 50%, rgba(59,130,246,0.3) 100%)'
          }}
        >
          <div 
            className="absolute right-0 top-0 bottom-0 w-[2px] bg-blue-500"
            style={{
              boxShadow: '0 0 15px 1px #3b82f6'
            }}
          ></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 z-10 relative">
          <div className="max-w-3xl" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
            <div className="text-sm uppercase tracking-widest text-gray-400 mb-4">
              [ Explore The World ]
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Discover Our <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                Global Community
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-xl">
              Explore countries around the world, learn about their cultures, languages, and more with our interactive platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Link 
                  to="/home"
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:from-blue-700 hover:to-blue-500 transition-all text-center"
                >
                  Explore Countries
                </Link>
              ) : (
                <Link 
                  to="/login"
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:from-blue-700 hover:to-blue-500 transition-all text-center"
                >
                  Explore Countries
                </Link>
              )}
              <Link 
                to="/about"
                className="px-8 py-3 rounded-full border border-gray-700 text-white hover:bg-gray-900 transition-all text-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-black py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Explore the World's Data</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our platform provides comprehensive information about countries around the globe, from population statistics to cultural insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div 
              className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-lg border border-gray-800 transform transition-transform hover:-translate-y-2"
              style={{ backdropFilter: 'blur(10px)' }}
            >
              <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Global Data</h3>
              <p className="text-gray-400">
                Access comprehensive information about every country, including population, languages, currencies, and more.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div 
              className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-lg border border-gray-800 transform transition-transform hover:-translate-y-2"
              style={{ backdropFilter: 'blur(10px)' }}
            >
              <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Interactive Experience</h3>
              <p className="text-gray-400">
                Explore countries with an interactive interface that makes learning about the world engaging and intuitive.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div 
              className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-lg border border-gray-800 transform transition-transform hover:-translate-y-2"
              style={{ backdropFilter: 'blur(10px)' }}
            >
              <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Detailed Insights</h3>
              <p className="text-gray-400">
                Discover detailed information about each country's geography, economy, culture, and historical significance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24">
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'radial-gradient(circle at 70% 50%, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)'
          }}
        ></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Explore the World?</h2>
            <p className="text-xl text-gray-400 mb-8">Join our community and start discovering countries from all around the globe.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link 
                  to="/home"
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:from-blue-700 hover:to-blue-500 transition-all text-center"
                >
                  Explore Now
                </Link>
              ) : (
                <Link 
                  to="/register"
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:from-blue-700 hover:to-blue-500 transition-all text-center"
                >
                  Create Account
                </Link>
              )}
              <Link 
                to="/about"
                className="px-8 py-3 rounded-full border border-gray-700 text-white hover:bg-gray-900 transition-all text-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold tracking-tighter">
                <span className="text-white">Countries</span>
                <span className="text-blue-500">Xplorer</span>
              </div>
              <p className="text-gray-500 mt-2">
                &copy; {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-500 hover:text-white transition-colors">About</Link></li>
                  <li><Link to="/" className="text-gray-500 hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link to="/" className="text-gray-500 hover:text-white transition-colors">Privacy</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Connect</h3>
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

export default LandingPage;
