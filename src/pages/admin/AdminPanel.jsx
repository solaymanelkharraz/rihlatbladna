import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { FaUserShield, FaUsers, FaSuitcase, FaChartBar, FaTrash, FaSearch, FaSignOutAlt, FaBullhorn } from 'react-icons/fa';

const AdminPanel = () => {
  const { user, logout, showAlert, tours, adminUsers, bookings, adminDeleteUser, deleteTour, verifyAgency } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('pending');
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
  const filteredUsers = usersList.filter(u => {
    const match = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (u.tourismLicenseNumber && u.tourismLicenseNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!match) return false;

    if (activeTab === 'pending') return u.role === 'agency' && !u.isVerified;
    if (activeTab === 'agencies') return u.role === 'agency' && u.isVerified;
    if (activeTab === 'travelers') return u.role === 'traveler';
    if (activeTab === 'admins') return u.role === 'admin';
    return false;
  });

  const handleVerifyAgency = async (agencyId) => {
    if (!window.confirm("Are you sure you want to verify this agency's tourism license? This will unlock their dashboard features.")) return;
    await verifyAgency(agencyId);
    showAlert("Verified", "The agency has been verified and granted full access.", "success");
  };

  const filteredTours = toursList.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.agencyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex text-slate-900 selection:bg-amber-500 selection:text-slate-900 pb-24">
      <AdminSidebar />

      <div className="flex-1 lg:ml-64 pt-24 pb-12 px-6 lg:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-slate-200 pb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl text-2xl shadow-sm border border-amber-200">
              <FaUserShield />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-500 text-sm font-medium">Moderate listings, manage accounts, and monitor platform health.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link 
              to="/admin/posts"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all text-sm active:scale-95 shadow-md shadow-blue-600/20 border border-blue-500"
            >
              <FaBullhorn /> Manage Posts & Stories
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-red-600 px-6 py-3 rounded-2xl font-bold border border-slate-300 transition-all text-sm active:scale-95 shadow-sm"
            >
              <FaSignOutAlt /> Log Out Admin
            </button>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-2xl border border-blue-100">
              <FaUsers />
            </div>
            <div>
              <span className="block text-slate-500 text-xs font-bold uppercase tracking-wider">Registered Users</span>
              <h3 className="text-3xl font-black text-slate-900 mt-0.5">{usersList.length}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-2xl border border-amber-100">
              <FaSuitcase />
            </div>
            <div>
              <span className="block text-slate-500 text-xs font-bold uppercase tracking-wider">Active Offers</span>
              <h3 className="text-3xl font-black text-slate-900 mt-0.5">{toursList.length}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center text-2xl border border-purple-100">
              <FaChartBar />
            </div>
            <div>
              <span className="block text-slate-500 text-xs font-bold uppercase tracking-wider">Inquiries Made</span>
              <h3 className="text-3xl font-black text-slate-900 mt-0.5">{bookingsList.length}</h3>
            </div>
          </div>
        </div>

        {/* Tab switcher & Search */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-2xl gap-2 w-full md:w-auto shadow-inner border border-slate-200">
            <button 
              onClick={() => { setActiveTab('pending'); setSearchQuery(''); }}
              className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all ${activeTab === 'pending' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Pending Approvals
            </button>
            <button 
              onClick={() => { setActiveTab('agencies'); setSearchQuery(''); }}
              className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all ${activeTab === 'agencies' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Verified Agencies
            </button>
            <button 
              onClick={() => { setActiveTab('travelers'); setSearchQuery(''); }}
              className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all ${activeTab === 'travelers' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Travelers
            </button>
            <button 
              onClick={() => { setActiveTab('admins'); setSearchQuery(''); }}
              className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all ${activeTab === 'admins' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Admins
            </button>
            <button 
              onClick={() => { setActiveTab('tours'); setSearchQuery(''); }}
              className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all ${activeTab === 'tours' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Tours Moderation
            </button>
          </div>

          <div className="relative w-full md:w-96 group">
            <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab !== 'tours' ? "Search users by name, email, or license..." : "Search tours by title, city, or agency..."}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl outline-none text-xs font-bold focus:ring-4 focus:ring-amber-500/10 border border-slate-300 focus:border-amber-500 text-slate-800 placeholder:text-slate-400 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Active Content Table */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          {activeTab !== 'tours' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-wider border-b border-slate-200">
                    <th className="p-6">User details</th>
                    <th className="p-6">Contact & License</th>
                    <th className="p-6">Role & Status</th>
                    <th className="p-6">Location</th>
                    <th className="p-6 text-right font-black">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <img src={item.avatar} alt="Avatar" className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                            <span className="font-extrabold text-slate-900">{item.name}</span>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex flex-col">
                            <span className="text-slate-600 font-medium">{item.email}</span>
                            {item.role === 'agency' && item.tourismLicenseNumber && (
                              <span className="text-[10px] text-amber-600 font-bold mt-1 bg-amber-50 inline-block px-2 py-0.5 rounded border border-amber-100 w-max">
                                License: {item.tourismLicenseNumber}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex flex-col items-start gap-1">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border
                              ${item.role === 'admin' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                              item.role === 'agency' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                              'bg-blue-50 text-blue-600 border-blue-200'}
                            `}>
                              {item.role}
                            </span>
                            {item.role === 'agency' && (
                              <span className={`text-[10px] font-bold ${item.isVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {item.isVerified ? '✓ Verified' : 'Pending Review'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-6 text-slate-600 font-medium">{item.location}</td>
                        <td className="p-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {item.role === 'agency' && (
                              <Link 
                                to={`/admin/agency/${item.id}`}
                                className="bg-purple-50 hover:bg-purple-600 text-purple-600 hover:text-white px-3 py-2 rounded-xl border border-purple-200 hover:border-transparent transition-all active:scale-95 text-[10px] font-bold uppercase tracking-wider"
                                title="View Agency Details"
                              >
                                View Profile
                              </Link>
                            )}
                            {item.role === 'agency' && !item.isVerified && (
                              <div className="flex gap-2 items-center">
                                {item.licenseDocumentUrl && (
                                  <a 
                                    href={item.licenseDocumentUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white px-3 py-2 rounded-xl border border-blue-200 hover:border-transparent transition-all active:scale-95 text-[10px] font-bold uppercase tracking-wider"
                                    title="View License Document"
                                  >
                                    View Doc
                                  </a>
                                )}
                                <button 
                                  onClick={() => handleVerifyAgency(item.id)}
                                  className="bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white px-3 py-2 rounded-xl border border-emerald-200 hover:border-transparent transition-all active:scale-95 text-[10px] font-bold uppercase tracking-wider"
                                  title="Verify Agency"
                                >
                                  Verify
                                </button>
                              </div>
                            )}
                            <button 
                              onClick={() => handleDeleteUser(item.id)}
                              className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white p-2.5 rounded-xl border border-red-200 hover:border-transparent transition-all active:scale-95"
                              title="Ban User"
                            >
                              <FaTrash />
                            </button>
                          </div>
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
                  <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-wider border-b border-slate-200">
                    <th className="p-6">Tour Title</th>
                    <th className="p-6">Agency Owner</th>
                    <th className="p-6">Location</th>
                    <th className="p-6">Price</th>
                    <th className="p-6">Rating</th>
                    <th className="p-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                  {filteredTours.length > 0 ? (
                    filteredTours.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt="Tour" className="w-12 h-8 rounded object-cover border border-slate-200" />
                            <span className="font-extrabold text-slate-900 line-clamp-1">{item.title}</span>
                          </div>
                        </td>
                        <td className="p-6 text-slate-700 font-bold">{item.agencyName}</td>
                        <td className="p-6 text-slate-600 font-medium">{item.location}</td>
                        <td className="p-6 font-bold text-amber-600">{item.price} DH</td>
                        <td className="p-6 text-slate-600 font-bold">★ {item.rating}</td>
                        <td className="p-6 text-right">
                          <button 
                            onClick={() => handleDeleteTour(item.id)}
                            className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white p-2.5 rounded-xl border border-red-200 hover:border-transparent transition-all active:scale-95"
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
    </div>
  );
};

export default AdminPanel;
