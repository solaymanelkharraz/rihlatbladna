import React from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { FaWhatsapp, FaSearch, FaEllipsisV } from 'react-icons/fa';

const Bookings = () => {
  // --- MOCK DATA ---
  const leads = [
    { id: 1, name: "Karim Benali", trip: "Sahara Desert Trek", date: "10 mins ago", status: "New", phone: "+212 600..." },
    { id: 2, name: "Sarah Connor", trip: "Blue City Trip", date: "2 hours ago", status: "Contacted", phone: "+212 611..." },
    { id: 3, name: "John Doe", trip: "Sahara Desert Trek", date: "Yesterday", status: "Booked", phone: "+212 622..." },
    { id: 4, name: "Fatima Zahra", trip: "Marrakech Tour", date: "3 days ago", status: "Expired", phone: "+212 633..." },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      <Sidebar />

      <div className="flex-1 lg:ml-64 p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Leads & Inquiries</h1>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-3.5 text-slate-400" />
            <input type="text" placeholder="Search by name or trip..." className="w-full pl-10 px-4 py-3 bg-slate-50 rounded-xl outline-none text-sm font-bold" />
          </div>
          <div className="flex gap-2">
            <select className="bg-slate-50 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 outline-none cursor-pointer">
              <option>All Status</option>
              <option>New</option>
              <option>Contacted</option>
              <option>Booked</option>
            </select>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-6">Client Name</th>
                <th className="p-6">Interested In</th>
                <th className="p-6">Date</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition">
                  <td className="p-6 font-bold">{lead.name}</td>
                  <td className="p-6 text-blue-600">{lead.trip}</td>
                  <td className="p-6 text-slate-400">{lead.date}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      lead.status === 'New' ? 'bg-red-100 text-red-600' :
                      lead.status === 'Contacted' ? 'bg-blue-100 text-blue-600' :
                      lead.status === 'Booked' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button className="bg-green-100 hover:bg-green-200 text-green-700 font-bold px-4 py-2 rounded-lg text-xs inline-flex items-center gap-2">
                      <FaWhatsapp /> WhatsApp
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bookings;