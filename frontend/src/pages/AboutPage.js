import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import FloatingCountriesOrb from '../components/FloatingCountriesOrb';
import { AuthContext } from '../App';
import { getAllCountries } from '../services/api';

const AboutPage = () => {
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
              [ About Our Project ]
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              About <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                Countries Xplorer
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-xl">
              Our mission is to make global information accessible and engaging for everyone through an intuitive and visually stunning interface.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/home"
                className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:from-blue-700 hover:to-blue-500 transition-all text-center"
              >
                Explore Countries
              </Link>
              <Link 
                to="/"
                className="px-8 py-3 rounded-full border border-gray-700 text-white hover:bg-gray-900 transition-all text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <div className="h-1 w-20 bg-blue-500 mb-8"></div>
              <p className="text-gray-400 mb-6">
                Countries Xplorer was created with a simple yet powerful vision: to connect people with global information in a beautiful, intuitive way.
              </p>
              <p className="text-gray-400 mb-6">
                We believe that understanding our world is the first step toward appreciating its diversity and complexity. By providing detailed information about countries, their cultures, languages, and more, we hope to foster a sense of global citizenship.
              </p>
              <p className="text-gray-400">
                Our platform combines cutting-edge technology with thoughtful design to create an experience that is both informative and visually stunning.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Features</h2>
              <div className="h-1 w-20 bg-blue-500 mb-8"></div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mr-3 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Comprehensive Data</h3>
                    <p className="text-gray-400">Access detailed information about every country in the world, including population, languages, currencies, and more.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mr-3 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Interactive Interface</h3>
                    <p className="text-gray-400">Explore countries with our intuitive search and filter functionality, making it easy to find exactly what you're looking for.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mr-3 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Visual Experience</h3>
                    <p className="text-gray-400">Enjoy a visually stunning experience with our 3D orb visualization, beautiful country flags, and modern UI design.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mr-3 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white">User Accounts</h3>
                    <p className="text-gray-400">Create a personal account to save your favorite countries and customize your experience.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 relative bg-black bg-opacity-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Team</h2>
            <div className="h-1 w-20 bg-blue-500 mx-auto mb-6"></div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Countries Xplorer is developed by a passionate team of developers dedicated to creating beautiful, functional web applications.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 bg-opacity-50 p-6 rounded-lg border border-gray-800">
              <div className="w-20 h-20 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👨‍💻</span>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">John Doe</h3>
              <p className="text-gray-400 text-center mb-4">Lead Developer</p>
              <p className="text-gray-500 text-center text-sm">
                Responsible for the core functionality and backend development of Countries Xplorer.
              </p>
            </div>
            <div className="bg-gray-900 bg-opacity-50 p-6 rounded-lg border border-gray-800">
              <div className="w-20 h-20 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👩‍🎨</span>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Jane Smith</h3>
              <p className="text-gray-400 text-center mb-4">UI/UX Designer</p>
              <p className="text-gray-500 text-center text-sm">
                Created the beautiful user interface and experience that makes Countries Xplorer so engaging.
              </p>
            </div>
            <div className="bg-gray-900 bg-opacity-50 p-6 rounded-lg border border-gray-800">
              <div className="w-20 h-20 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Alex Johnson</h3>
              <p className="text-gray-400 text-center mb-4">Data Specialist</p>
              <p className="text-gray-500 text-center text-sm">
                Ensures that all country data is accurate, up-to-date, and presented in a meaningful way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <div className="text-2xl font-bold tracking-tighter mb-4">
                <span className="text-white">Countries</span>
                <span className="text-blue-500">Xplorer</span>
              </div>
              <p className="text-gray-500 max-w-md">
                Explore the world from your screen. Discover countries, cultures, and more with our interactive platform.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Navigation</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-500 hover:text-white transition-colors">Home</Link></li>
                  <li><Link to="/about" className="text-gray-500 hover:text-white transition-colors">About</Link></li>
                  <li><Link to="/home" className="text-gray-500 hover:text-white transition-colors">Explore</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Account</h3>
                <ul className="space-y-2">
                  <li><Link to="/login" className="text-gray-500 hover:text-white transition-colors">Sign In</Link></li>
                  <li><Link to="/register" className="text-gray-500 hover:text-white transition-colors">Sign Up</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} Countries Xplorer. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
