import React from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { FaWhatsapp, FaSearch, FaEllipsisV, FaFilter, FaDownload } from 'react-icons/fa';

const Bookings = () => {
  // --- MOCK DATA ---
  const leads = [
    { id: 1, name: "Karim Benali", trip: "Sahara Desert Trek", date: "10 mins ago", status: "New", phone: "+212 600..." },
    { id: 2, name: "Sarah Connor", trip: "Blue City Trip", date: "2 hours ago", status: "Contacted", phone: "+212 611..." },
    { id: 3, name: "John Doe", trip: "Sahara Desert Trek", date: "Yesterday", status: "Booked", phone: "+212 622..." },
    { id: 4, name: "Fatima Zahra", trip: "Marrakech Tour", date: "3 days ago", status: "Expired", phone: "+212 633..." },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex selection:bg-blue-500 selection:text-white pb-24">
      <Sidebar />

      <div className="flex-1 lg:ml-64 p-4 lg:p-10 animate-fade-in-up">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Leads & Inquiries</h1>
            <p className="text-slate-500 text-lg">Track and manage potential customer bookings.</p>
          </div>
          <button className="bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 px-6 py-3 rounded-2xl font-bold shadow-sm flex items-center gap-2 transition-all duration-300 active:scale-95 w-full md:w-auto justify-center">
            <FaDownload /> Export CSV
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-5 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full md:w-96 group focus-within:shadow-sm transition-shadow rounded-2xl">
            <FaSearch className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input type="text" placeholder="Search by name or trip..." className="w-full pl-12 px-4 py-3 bg-slate-50 rounded-2xl outline-none text-sm font-bold border border-slate-100 focus:border-blue-500 focus:bg-white transition-all text-slate-700" />
          </div>
          <div className="flex gap-3 w-full md:w-auto overflow-x-auto hide-scrollbar">
            <button className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 px-5 py-3 rounded-2xl text-sm font-bold border border-slate-100 transition-colors whitespace-nowrap">
              <FaFilter className="text-slate-400" /> Filter
            </button>
            <select className="bg-slate-50 px-6 py-3 rounded-2xl text-sm font-bold text-slate-600 outline-none cursor-pointer border border-slate-100 focus:border-blue-500 transition-colors whitespace-nowrap min-w-[140px]">
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
                  <th className="p-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900">{lead.name}</p>
                          <p className="text-xs text-slate-400">{lead.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors cursor-pointer">{lead.trip}</span>
                    </td>
                    <td className="p-6 text-slate-500 font-medium">{lead.date}</td>
                    <td className="p-6">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wide shadow-sm inline-block
                        ${lead.status === 'New' ? 'bg-red-500 text-white' :
                        lead.status === 'Contacted' ? 'bg-blue-100 text-blue-600' :
                        lead.status === 'Booked' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}
                      `}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-[0_4px_14px_rgb(34,197,94,0.3)] hover:shadow-[0_6px_20px_rgb(34,197,94,0.4)] transition-all duration-300 active:scale-95">
                          <FaWhatsapp className="text-lg" /> Chat
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-100">
                          <FaEllipsisV />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination / Footer */}
          <div className="p-6 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 font-medium">
             <span>Showing 1 to 4 of 4 entries</span>
             <div className="flex gap-2">
               <button className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 font-bold text-slate-600">Previous</button>
               <button className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 font-bold text-slate-600">Next</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;