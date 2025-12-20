import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChartPie, FaSuitcase, FaCalendarCheck, FaComments, FaCog, FaSignOutAlt, FaGlobeAfrica } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-slate-900 min-h-screen text-white fixed left-0 top-0 flex flex-col hidden lg:flex">
      
      {/* Logo Area */}
      <div className="h-20 flex items-center px-8 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <FaGlobeAfrica className="text-amber-500" />
          <span>Rihlat<span className="text-blue-500">Agency</span></span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-8 px-4 space-y-2">
        <p className="text-xs font-bold text-slate-500 uppercase px-4 mb-2 tracking-wider">Main Menu</p>
        
        <Link to="/agency/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive('/agency/dashboard') ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <FaChartPie /> Dashboard
        </Link>

        <Link to="/agency/offers" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive('/agency/offers') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <FaSuitcase /> My Offers
        </Link>

        <Link to="/agency/bookings" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive('/agency/bookings') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <FaCalendarCheck /> Bookings
          <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
        </Link>

        <Link to="/agency/messages" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive('/agency/messages') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <FaComments /> Messages
        </Link>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800">
        <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all font-medium mb-2">
          <FaCog /> Settings
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all font-medium">
          <FaSignOutAlt /> Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;