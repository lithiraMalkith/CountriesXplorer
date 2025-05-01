import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const result = await register(name, email, password);
      
      if (result.success) {
        // Redirect to landing page instead of home page
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      {/* Orb Effects */}
      <div className="orb bg-blue-500 w-96 h-96 top-1/4 -left-48 opacity-30"></div>
      <div className="orb bg-blue-300 w-80 h-80 bottom-1/4 -right-40 opacity-30"></div>
      <div className="orb bg-blue-400 w-64 h-64 top-3/4 left-1/4 opacity-20"></div>
      <div className="orb bg-blue-200 w-72 h-72 top-1/3 right-1/4 opacity-20"></div>
      <div className="orb bg-blue-300 w-48 h-48 bottom-1/3 left-1/3 opacity-20"></div>
      
      <div className="w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="text-xl font-bold tracking-tighter inline-block">
            <span className="text-white">Countries</span>
            <span className="text-blue-500">Xplorer</span>
          </Link>
          <h2 className="text-lg font-bold mt-6 font-mono">Create Account</h2>
          <p className="text-gray-400 text-sm mt-2">Join us to explore countries around the world.</p>
        </div>
        
        <div className="bg-transparent border border-gray-800 rounded-lg p-8 shadow-lg backdrop-blur-sm">
          {error && (
            <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-300 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-400 text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-400 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-400 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-400 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-2 rounded-md hover:from-blue-700 hover:to-blue-500 transition-all"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-400">Already have an account?</span>{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300">
              Sign in
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link to="/" className="text-gray-400 text-sm hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
