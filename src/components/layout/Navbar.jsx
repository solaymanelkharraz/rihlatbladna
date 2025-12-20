import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaGlobeAfrica } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm fixed w-full z-50 top-0 left-0 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-700 tracking-tighter">
            <FaGlobeAfrica className="text-amber-500 text-3xl" />
            <span>Rihlat<span className="text-slate-800">Bladna</span></span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-600 hover:text-blue-600 font-medium transition">Home</Link>
            <Link to="/search" className="text-slate-600 hover:text-blue-600 font-medium transition">Destinations</Link>
            <Link to="/agencies" className="text-slate-600 hover:text-blue-600 font-medium transition">Agencies</Link>
          </div>

          {/* Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-slate-700 font-semibold hover:text-blue-600 transition">Log In</Link>
            <Link to="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5">
              Get Started
            </Link>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-700 focus:outline-none">
              {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link to="/" className="block px-3 py-3 text-slate-600 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-lg">Home</Link>
            <Link to="/search" className="block px-3 py-3 text-slate-600 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-lg">Destinations</Link>
            <Link to="/login" className="block px-3 py-3 text-slate-600 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-lg">Log In</Link>
            <Link to="/register" className="block w-full text-center mt-4 bg-blue-600 text-white px-3 py-3 rounded-lg font-bold">Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;