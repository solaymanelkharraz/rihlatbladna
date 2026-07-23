import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaChartPie, 
  FaSuitcase, 
  FaCalendarCheck, 
  FaComments, 
  FaCog, 
  FaSignOutAlt, 
  FaGlobeAfrica,
  FaBars,
  FaTimes,
  FaIdCard,
  FaBullhorn,
  FaCamera,
  FaWallet
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, showAlert } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  
  const isActive = (path) => location.pathname === path || (path !== '/agency/dashboard' && location.pathname.startsWith(path));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRestrictedNav = (e) => {
    if (user?.role === 'agency' && !user?.isVerified) {
      e.preventDefault();
      setIsOpen(false);
      showAlert("Account Restricted", "You can't use this yet until you get verified by our admin team.", "warning");
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Topbar Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-30">
        <Link to="/" className="flex items-center gap-2.5 text-lg font-bold text-white">
          <img src="/main_logo.png" alt="RihlatBladna Logo" className="h-8 w-auto object-contain" />
          <span>Rihlat<span className="text-blue-500">Agency</span></span>
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-white hover:text-blue-500 transition-colors p-2 cursor-pointer border-none bg-transparent text-xl flex items-center justify-center"
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-35 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar Container (Responsive Slide Drawer) */}
      <div className={`w-64 bg-slate-900 min-h-screen text-white fixed left-0 top-0 flex flex-col z-40 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:flex`}>
        
        {/* Desktop Logo Area */}
        <div className="h-20 flex items-center px-8 border-b border-slate-800 hidden lg:flex shrink-0">
          <Link to="/" className="flex items-center gap-2.5 text-xl font-bold">
            <img src="/main_logo.png" alt="RihlatBladna Logo" className="h-9 w-auto object-contain" />
            <span>Rihlat<span className="text-blue-500">Agency</span></span>
          </Link>
        </div>

        {/* Mobile Header in Drawer */}
        <div className="h-20 flex items-center justify-between px-8 border-b border-slate-800 lg:hidden shrink-0">
          <span className="text-lg font-bold tracking-tight">Navigation</span>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-2 bg-transparent border-none cursor-pointer text-lg"><FaTimes /></button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto hide-scrollbar">
          <p className="text-xs font-bold text-slate-500 uppercase px-4 mb-2 tracking-wider">Main Menu</p>
          
          <Link 
            to="/agency/dashboard" 
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${isActive('/agency/dashboard') ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FaChartPie className="text-base" /> Dashboard
          </Link>

          <Link 
            to="/agency/wallet" 
            onClick={handleRestrictedNav}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${isActive('/agency/wallet') ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FaWallet className="text-base" /> Wallet
            {user?.credits !== undefined && (
              <span className="ml-auto bg-blue-500/20 text-blue-400 py-0.5 px-2 rounded-full text-xs font-bold">
                {user.credits} cr
              </span>
            )}
          </Link>

          <Link 
            to="/agency/profile" 
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${isActive('/agency/profile') ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FaIdCard className="text-base" /> Profile
          </Link>

          <Link 
            to="/agency/offers" 
            onClick={handleRestrictedNav}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${isActive('/agency/offers') ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FaSuitcase className="text-base" /> Offers
          </Link>

          <Link 
            to="/agency/bookings" 
            onClick={handleRestrictedNav}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${isActive('/agency/bookings') ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FaCalendarCheck className="text-base" /> Bookings
          </Link>

          <Link 
            to="/agency/posts" 
            onClick={handleRestrictedNav}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${isActive('/agency/posts') ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FaBullhorn className="text-base" /> Posts
          </Link>

          <Link 
            to="/agency/story" 
            onClick={handleRestrictedNav}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${isActive('/agency/story') ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FaCamera className="text-base" /> Stories & Posts
          </Link>

          <Link 
            to="/agency/messages" 
            onClick={handleRestrictedNav}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${isActive('/agency/messages') ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FaComments className="text-base" /> Messages
          </Link>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <Link 
            to="/agency/settings" 
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all text-sm font-semibold mb-2 ${isActive('/agency/settings') || isActive('/settings') ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FaCog className="text-base" /> Settings
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all text-sm font-semibold cursor-pointer border-none bg-transparent"
          >
            <FaSignOutAlt className="text-base" /> Log Out
          </button>
        </div>

      </div>
    </>
  );
};

export default Sidebar;