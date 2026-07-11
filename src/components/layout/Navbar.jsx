import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaBars, FaTimes, FaGlobeAfrica, FaSignOutAlt, 
  FaUser, FaBuilding, FaUserShield, FaChevronDown, 
  FaHeart, FaComments, FaCog 
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setShowDropdown(false);
    setIsOpen(false);
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'agency') return '/agency/dashboard';
    return '/traveler/profile';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-7xl mx-auto">
      <nav className="bg-slate-950/60 backdrop-blur-xl border border-white/10 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.5)] rounded-[2rem] px-6 lg:px-8 transition-all duration-300">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo with Gradient Text & Spin Icon on Hover */}
          <Link to="/" className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-white group shrink-0">
            <div className="p-2 bg-gradient-to-tr from-blue-600 to-amber-500 rounded-2xl shadow-md shadow-blue-500/10 group-hover:rotate-45 transition-transform duration-500">
              <FaGlobeAfrica className="text-white text-2xl" />
            </div>
            <span className="font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-amber-400 bg-clip-text text-transparent">
              Rihlat<span className="text-white">Bladna</span>
            </span>
          </Link>

          {/* Desktop Menu - Micro bottom-line indicators */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { path: '/', label: 'Home' },
              { path: '/search', label: 'Destinations' },
              { path: '/agencies', label: 'Agencies' },
              { path: '/community', label: 'Community' }
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-2 text-sm font-bold tracking-wide transition-colors duration-300 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[3px] after:bg-amber-400 after:rounded-full after:transition-all after:duration-300 hover:after:w-2/3 ${
                  isActive(link.path) 
                    ? 'text-amber-400 after:w-2/3' 
                    : 'text-slate-300 hover:text-amber-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Buttons / User Session Profile dropdown */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-2xl border border-white/15 shadow-sm transition-all active:scale-98 text-white cursor-pointer"
                >
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full border border-white/10 object-cover shadow-inner bg-slate-800" 
                  />
                  <span className="text-slate-200 font-bold text-xs max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <FaChevronDown className={`text-[10px] text-slate-400 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu Card with Glassmorphism */}
                {showDropdown && (
                  <>
                    {/* Click Outside Overlay */}
                    <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                    
                    <div className="absolute right-0 mt-3 w-64 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] py-3 px-2 z-20 animate-fade-in-up">
                      <div className="px-4 py-3 border-b border-slate-800 mb-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Logged in as</p>
                        <h4 className="font-extrabold text-sm text-slate-200 truncate">{user.name}</h4>
                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-900/40 text-blue-300 border border-blue-800/60 uppercase tracking-wider">
                          {user.role}
                        </span>
                      </div>

                      <Link 
                        to={getDashboardLink()} 
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        {user.role === 'admin' ? <FaUserShield className="text-lg text-blue-400" /> : user.role === 'agency' ? <FaBuilding className="text-lg text-amber-400" /> : <FaUser className="text-lg text-blue-400" />}
                        Dashboard
                      </Link>

                      {user.role === 'traveler' && (
                        <>
                          <Link 
                            to="/traveler/profile?tab=wishlist" 
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                          >
                            <FaHeart className="text-lg text-rose-500" /> My Wishlist
                          </Link>
                          <Link 
                            to="/traveler/profile?tab=chats" 
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                          >
                            <FaComments className="text-lg text-emerald-400" /> In-App Chats
                          </Link>
                        </>
                      )}

                      {user.role === 'agency' && (
                        <Link 
                          to="/agency/messages" 
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          <FaComments className="text-lg text-emerald-400" /> Chat Threads
                        </Link>
                      )}

                      <div className="border-t border-slate-800 my-2"></div>

                      <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-red-400 hover:bg-red-950/30 transition-colors text-left cursor-pointer border-none bg-transparent"
                      >
                        <FaSignOutAlt className="text-lg" /> Log Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 font-extrabold hover:text-white transition">Log In</Link>
                <Link to="/register" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-2xl font-extrabold shadow-[0_6px_20px_rgba(37,99,235,0.3)] transition-all transform hover:-translate-y-0.5 active:scale-98">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2.5 bg-white/5 rounded-2xl text-slate-200 focus:outline-none border border-white/10 shadow-sm cursor-pointer"
            >
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Slide Down Capsule style */}
      {isOpen && (
        <div className="md:hidden mt-2 bg-slate-900/95 backdrop-blur-2xl border border-white/10 shadow-xl rounded-[2rem] p-4 space-y-2 animate-fade-in-up">
          <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-slate-300 font-bold hover:bg-white/5 hover:text-white rounded-2xl transition-colors">Home</Link>
          <Link to="/search" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-slate-300 font-bold hover:bg-white/5 hover:text-white rounded-2xl transition-colors">Destinations</Link>
          <Link to="/agencies" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-slate-300 font-bold hover:bg-white/5 hover:text-white rounded-2xl transition-colors">Agencies</Link>
          <Link to="/community" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-slate-300 font-bold hover:bg-white/5 hover:text-white rounded-2xl transition-colors">Community</Link>
          
          {user ? (
            <div className="pt-4 border-t border-slate-800">
              <Link to={getDashboardLink()} onClick={() => setIsOpen(false)} className="block px-4 py-3 text-amber-400 font-extrabold hover:bg-white/5 rounded-2xl transition-colors">
                Dashboard ({user.role})
              </Link>
              <button 
                onClick={handleLogout} 
                className="w-full text-left block px-4 py-3 text-red-400 font-bold hover:bg-red-950/30 rounded-2xl transition-colors flex items-center gap-2 border-none bg-transparent cursor-pointer"
              >
                <FaSignOutAlt /> Log Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
              <Link to="/login" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-slate-300 font-bold hover:bg-white/5 hover:text-white rounded-2xl text-center transition-colors">Log In</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="block bg-blue-600 text-white px-4 py-3 rounded-2xl font-bold text-center shadow-lg">Get Started</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;