import React from 'react';
import { Link } from 'react-router-dom'; // Added Link for navigation
import Sidebar from '../../components/layout/Sidebar';
import { FaWhatsapp, FaUserFriends, FaRocket, FaTrophy, FaEye, FaBullhorn } from 'react-icons/fa';

const Dashboard = () => {
  // --- STRATEGY: Followers determine Rank ---
  const stats = [
    { title: "Your Rank", value: "#4", subtext: "in Tangier", icon: <FaTrophy />, color: "bg-amber-500" }, 
    { title: "Total Followers", value: "1,205", subtext: "Rank driver", icon: <FaUserFriends />, color: "bg-blue-600" }, 
    { title: "Offer Views", value: "8.5k", subtext: "+12% w/ Boost", icon: <FaEye />, color: "bg-purple-500" },
  ];

  const recentLeads = [
    { id: 1, user: "Ahmed Alami", interest: "Sahara Desert Trek", time: "10 mins ago", avatar: "https://i.pravatar.cc/150?u=1" },
    { id: 2, user: "Sarah Johnson", interest: "Blue City Trip", time: "2 hours ago", avatar: "https://i.pravatar.cc/150?u=2" },
    { id: 3, user: "Karim Ben", interest: "Atlas Hiking", time: "5 hours ago", avatar: "https://i.pravatar.cc/150?u=3" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      <Sidebar />

      <div className="flex-1 lg:ml-64 p-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Agency Hub</h1>
            <p className="text-slate-500">Grow your followers to rank higher.</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
             <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-amber-500/30 flex items-center gap-2 transform hover:-translate-y-1 transition-all">
               <FaRocket /> Boost an Offer
             </button>
             
             {/* This button now links to the Create Offer page */}
             <Link to="/agency/create-offer" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2">
               + New Offer
             </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 relative overflow-hidden">
              <div className={`w-16 h-16 rounded-2xl ${stat.color} text-white flex items-center justify-center text-3xl shadow-lg z-10`}>
                {stat.icon}
              </div>
              <div className="z-10">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">{stat.title}</p>
                <h3 className="text-3xl font-black text-slate-800">{stat.value}</h3>
                <span className="text-slate-500 text-xs font-medium">{stat.subtext}</span>
              </div>
              {/* Decorative Circle Background */}
              <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-10 ${stat.color}`}></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Leads (WhatsApp Clicks) */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Recent Contacts (WhatsApp)</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition">
                  <img src={lead.avatar} alt="User" className="w-12 h-12 rounded-full border-2 border-slate-100" />
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800">{lead.user}</h4>
                    <p className="text-xs text-slate-500">Clicked contact for <span className="font-medium text-blue-600">{lead.interest}</span></p>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs text-slate-400 mb-1">{lead.time}</span>
                    <button className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 hover:bg-green-200 transition">
                      <FaWhatsapp /> Chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rank & Growth Tips */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4">Improve Your Rank</h2>
              <div className="p-4 bg-blue-50 rounded-2xl mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-blue-800 font-bold text-sm">Next Rank: #3</span>
                  <span className="text-blue-600 text-xs font-bold">50 Followers needed</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
               <h4 className="text-amber-800 font-bold text-sm mb-2"><FaBullhorn className="inline mr-2"/> How to rank #1?</h4>
               <ul className="text-xs text-amber-700 space-y-2 list-disc pl-4">
                 <li>Post daily stories to engage users.</li>
                 <li>Ask satisfied clients to follow you.</li>
                 <li>Boost your best offer to get seen.</li>
               </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;