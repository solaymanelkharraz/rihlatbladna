import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaChartPie, 
  FaComments, 
  FaCog, 
  FaSignOutAlt, 
  FaBars,
  FaTimes,
  FaBullhorn
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  
  const isActive = (path) => location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Topbar Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-30 shadow-sm">
        <Link to="/" className="flex items-center gap-2.5 text-lg font-black text-slate-900">
          <img src="/main_logo.png" alt="RihlatBladna Logo" className="h-8 w-auto object-contain" />
          <span>Platform<span className="text-amber-500">Admin</span></span>
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-600 hover:text-amber-500 transition-colors p-2 cursor-pointer border-none bg-transparent text-xl flex items-center justify-center"
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-35 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar Container (Responsive Slide Drawer) */}
      <div className={`w-64 bg-white border-r border-slate-200 min-h-screen text-slate-700 fixed left-0 top-0 flex flex-col z-40 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)]`}>
        
        {/* Desktop Logo Area */}
        <div className="h-20 flex items-center px-8 border-b border-slate-100 hidden lg:flex shrink-0">
          <Link to="/" className="flex items-center gap-2.5 text-xl font-black text-slate-900">
            <img src="/main_logo.png" alt="RihlatBladna Logo" className="h-9 w-auto object-contain drop-shadow-sm" />
            <span>Platform<span className="text-amber-500">Admin</span></span>
          </Link>
        </div>

        {/* Mobile Header in Drawer */}
        <div className="h-20 flex items-center justify-between px-8 border-b border-slate-100 lg:hidden shrink-0">
          <span className="text-lg font-black tracking-tight text-slate-900">Navigation</span>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-900 p-2 bg-transparent border-none cursor-pointer text-lg"><FaTimes /></button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto hide-scrollbar">
          <p className="text-[10px] font-black text-slate-400 uppercase px-4 mb-3 tracking-wider">Control Panel</p>
          
          <Link 
            to="/admin" 
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-sm font-bold ${isActive('/admin') && !isActive('/admin/posts') && !isActive('/admin/messages') && !isActive('/admin/settings') ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <FaChartPie className="text-base" /> Dashboard overview
          </Link>

          <Link 
            to="/admin/posts" 
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-sm font-bold ${isActive('/admin/posts') || isActive('/admin/story') ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <FaBullhorn className="text-base" /> Posts & Stories
          </Link>

          <Link 
            to="/admin/messages" 
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-sm font-bold ${isActive('/admin/messages') ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <FaComments className="text-base" /> Messages
          </Link>

          <Link 
            to="/admin/settings" 
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-sm font-bold ${isActive('/admin/settings') ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <FaCog className="text-base" /> Profile Settings
          </Link>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 mt-auto shrink-0">
          <div className="flex items-center gap-3 mb-4 px-2">
            <img src={user?.avatar || '/MorP.jpg'} alt="Avatar" className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm" />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-slate-900 truncate">{user?.name || 'Super Admin'}</h4>
              <p className="text-[10px] text-amber-600 font-black uppercase tracking-wider truncate">System Admin</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 py-2.5 rounded-xl transition-all text-xs font-bold border border-slate-200 cursor-pointer active:scale-95 shadow-sm"
          >
            <FaSignOutAlt /> Secure Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;