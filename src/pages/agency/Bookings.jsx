import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { FaSearch, FaDownload, FaComments, FaWhatsapp, FaUserFriends } from 'react-icons/fa';

const Bookings = () => {
  const { user, bookings, updateBookingStatus } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const myBookings = (bookings || []).filter(b => b.agencyId === user?.id);

  const handleStatusChange = async (id, newStatus) => {
    await updateBookingStatus(id, newStatus);
  };

  const handleConfirmWhatsApp = (lead) => {
    const cleanPhone = (lead.travelerPhone || '').replace(/[^0-9+]/g, '');
    const msg = encodeURIComponent(`Salam ${lead.travelerName}! 👋 This is ${user?.name || 'our agency'} from RihlatBladna. We saw your booking for ${lead.guestsCount || 1} seat(s) on our tour "${lead.tourTitle}". We are thrilled to confirm your reservation! Let's finalize your meetup and pickup details...`);
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  const handleExportCSV = () => {
    if (myBookings.length === 0) return;
    const headers = ['Client Name', 'Interested In', 'Seats', 'Phone', 'Date', 'Status'];
    const rows = myBookings.map(b => [b.travelerName, b.tourTitle, b.guestsCount || 1, b.travelerPhone, b.date, b.status]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rihlatbladna_leads_${user?.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter bookings
  const filteredBookings = myBookings.filter(b => {
    const matchesSearch = 
      b.travelerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.tourTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      statusFilter === 'All Status' || 
      b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex selection:bg-blue-500 selection:text-white pb-24">
      <Sidebar />

      <div className="flex-1 lg:ml-64 pt-24 pb-8 px-4 lg:p-10 animate-fade-in-up">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Leads & Inquiries</h1>
            <p className="text-slate-500 text-lg">Track and manage potential customer bookings.</p>
          </div>
          <button 
            onClick={handleExportCSV}
            className="bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 px-6 py-3 rounded-2xl font-bold shadow-sm flex items-center gap-2 transition-all duration-300 active:scale-95 w-full md:w-auto justify-center"
          >
            <FaDownload /> Export CSV
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-5 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full md:w-96 group focus-within:shadow-sm transition-shadow rounded-2xl">
            <FaSearch className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or trip..." 
              className="w-full pl-12 px-4 py-3 bg-slate-50 rounded-2xl outline-none text-sm font-bold border border-slate-100 focus:border-blue-500 focus:bg-white transition-all text-slate-700" 
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 px-6 py-3 rounded-2xl text-sm font-bold text-slate-600 outline-none cursor-pointer border border-slate-100 focus:border-blue-500 transition-colors"
            >
              <option>All Status</option>
              <option>New</option>
              <option>Contacted</option>
              <option>Booked</option>
            </select>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                  <th className="p-6">Client Name</th>
                  <th className="p-6">Interested In</th>
                  <th className="p-6">Date</th>
                  <th className="p-6">Status</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((lead) => {
                    const threadId = `thread_${lead.travelerId}_${user.id}`;
                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                              {lead.travelerName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-900">{lead.travelerName}</p>
                              <p className="text-xs text-slate-400 font-bold">{lead.travelerPhone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6 space-y-1.5">
                          <span className="font-bold text-slate-800 block">{lead.tourTitle}</span>
                          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-black">
                            <FaUserFriends /> {lead.guestsCount || 1} Seat(s) Reserved
                          </span>
                        </td>
                        <td className="p-6 text-slate-500 font-medium">{lead.date}</td>
                        <td className="p-6">
                          <select 
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-black tracking-wide border-0 outline-none cursor-pointer shadow-sm
                              ${lead.status === 'New' ? 'bg-red-500 text-white' :
                              lead.status === 'Contacted' ? 'bg-blue-100 text-blue-600' :
                              lead.status === 'Booked' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}
                            `}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Booked">Booked</option>
                          </select>
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleConfirmWhatsApp(lead)}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all active:scale-95 border-none cursor-pointer"
                              title="Send WhatsApp Confirmation"
                            >
                              <FaWhatsapp className="text-base" /> Confirm WhatsApp
                            </button>
                            <button 
                              onClick={() => navigate(`/agency/messages?thread=${threadId}`)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 border-none cursor-pointer"
                            >
                              <FaComments /> Chat
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-slate-400 font-medium">
                      No inquiries match your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;