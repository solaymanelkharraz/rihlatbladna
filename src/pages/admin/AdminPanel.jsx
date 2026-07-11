import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import { FaUserShield, FaUsers, FaSuitcase, FaChartBar, FaTrash, FaSearch, FaSignOutAlt } from 'react-icons/fa';

const AdminPanel = () => {
  const { user, logout, showAlert, tours, adminUsers, bookings, adminDeleteUser, deleteTour } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');

  const usersList = adminUsers || [];
  const toursList = tours || [];
  const bookingsList = bookings || [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteUser = async (userId) => {
    if (userId === user.id) {
      showAlert("Action Prevented", "You cannot delete your own admin account!", "error");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this user? All their listings will remain, but their account will be closed.")) return;

    await adminDeleteUser(userId);
  };

  const handleDeleteTour = async (tourId) => {
    if (!window.confirm("Are you sure you want to delete this tour listing? This action is permanent.")) return;

    await deleteTour(tourId);
  };

  // Filter listings
  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTours = toursList.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.agencyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100 selection:bg-amber-500 selection:text-slate-900 pb-24">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-32">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-slate-800 pb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500 text-slate-900 rounded-2xl text-2xl shadow-lg shadow-amber-500/20">
              <FaUserShield />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Admin Dashboard</h1>
              <p className="text-slate-400 text-sm">Moderate listings, manage accounts, and monitor platform health.</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-slate-800 hover:bg-red-950 hover:text-red-400 px-6 py-3 rounded-2xl font-bold border border-slate-700 transition-all text-sm active:scale-95"
          >
            <FaSignOutAlt /> Log Out Admin
          </button>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700/50 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-2xl border border-blue-500/20">
              <FaUsers />
            </div>
            <div>
              <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider">Registered Users</span>
              <h3 className="text-3xl font-black mt-0.5">{usersList.length}</h3>
            </div>
          </div>
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700/50 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-2xl border border-amber-500/20">
              <FaSuitcase />
            </div>
            <div>
              <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider">Active Offers</span>
              <h3 className="text-3xl font-black mt-0.5">{toursList.length}</h3>
            </div>
          </div>
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700/50 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-2xl border border-purple-500/20">
              <FaChartBar />
            </div>
            <div>
              <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider">Inquiries Made</span>
              <h3 className="text-3xl font-black mt-0.5">{bookingsList.length}</h3>
            </div>
          </div>
        </div>

        {/* Tab switcher & Search */}
        <div className="bg-slate-800 p-4 rounded-3xl border border-slate-700/50 flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex bg-slate-900 p-1.5 rounded-2xl gap-2 w-full md:w-auto shadow-inner">
            <button 
              onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-amber-500 text-slate-900 shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Users Directory
            </button>
            <button 
              onClick={() => { setActiveTab('tours'); setSearchQuery(''); }}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'tours' ? 'bg-amber-500 text-slate-900 shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Tours Moderation
            </button>
          </div>

          <div className="relative w-full md:w-96 group">
            <FaSearch className="absolute left-3.5 top-3.5 text-slate-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'users' ? "Search users by name, email, or role..." : "Search tours by title, city, or agency..."}
              className="w-full pl-10 pr-4 py-3 bg-slate-900 rounded-2xl outline-none text-xs font-bold focus:ring-2 focus:ring-amber-500/20 border border-slate-800 focus:border-amber-500 text-white placeholder:text-slate-600 transition-all"
            />
          </div>
        </div>

        {/* Active Content Table */}
        <div className="bg-slate-800 rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
          {activeTab === 'users' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-800">
                    <th className="p-6">User details</th>
                    <th className="p-6">Email Address</th>
                    <th className="p-6">Role</th>
                    <th className="p-6">Location</th>
                    <th className="p-6 text-right font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm font-medium text-slate-300">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-750 transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <img src={item.avatar} alt="Avatar" className="w-9 h-9 rounded-full object-cover" />
                            <span className="font-extrabold text-white">{item.name}</span>
                          </div>
                        </td>
                        <td className="p-6 text-slate-400 font-medium">{item.email}</td>
                        <td className="p-6">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                            ${item.role === 'admin' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            item.role === 'agency' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                            'bg-blue-500/10 text-blue-400 border border-blue-500/20'}
                          `}>
                            {item.role}
                          </span>
                        </td>
                        <td className="p-6 text-slate-400 font-medium">{item.location}</td>
                        <td className="p-6 text-right">
                          <button 
                            onClick={() => handleDeleteUser(item.id)}
                            className="bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white p-2.5 rounded-xl border border-red-500/20 hover:border-transparent transition-all active:scale-95"
                            title="Ban User"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-10 text-center text-slate-500 font-medium">
                        No registered users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-800">
                    <th className="p-6">Tour Title</th>
                    <th className="p-6">Agency Owner</th>
                    <th className="p-6">Location</th>
                    <th className="p-6">Price</th>
                    <th className="p-6">Rating</th>
                    <th className="p-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm font-medium text-slate-300">
                  {filteredTours.length > 0 ? (
                    filteredTours.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-750 transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt="Tour" className="w-12 h-8 rounded object-cover" />
                            <span className="font-extrabold text-white line-clamp-1">{item.title}</span>
                          </div>
                        </td>
                        <td className="p-6 text-slate-400 font-bold">{item.agencyName}</td>
                        <td className="p-6 text-slate-400 font-medium">{item.location}</td>
                        <td className="p-6 font-bold text-amber-400">{item.price} DH</td>
                        <td className="p-6 text-slate-400 font-bold">★ {item.rating}</td>
                        <td className="p-6 text-right">
                          <button 
                            onClick={() => handleDeleteTour(item.id)}
                            className="bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white p-2.5 rounded-xl border border-red-500/20 hover:border-transparent transition-all active:scale-95"
                            title="Remove Tour Listing"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-10 text-center text-slate-500 font-medium">
                        No active tour listings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
