import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { FaWhatsapp, FaUserFriends, FaRocket, FaTrophy, FaEye, FaBullhorn } from 'react-icons/fa';

const Dashboard = () => {
  const stats = [
    { title: "Your Rank", value: "#4", subtext: "in Tangier", icon: <FaTrophy />, color: "bg-amber-500", glow: "shadow-amber-500/40" }, 
    { title: "Total Followers", value: "1,205", subtext: "Rank driver", icon: <FaUserFriends />, color: "bg-blue-600", glow: "shadow-blue-600/40" }, 
    { title: "Offer Views", value: "8.5k", subtext: "+12% w/ Boost", icon: <FaEye />, color: "bg-purple-500", glow: "shadow-purple-500/40" },
  ];

  const recentLeads = [
    { id: 1, user: "Ahmed Alami", interest: "Sahara Desert Trek", time: "10 mins ago", avatar: "https://i.pravatar.cc/150?u=1" },
    { id: 2, user: "Sarah Johnson", interest: "Blue City Trip", time: "2 hours ago", avatar: "https://i.pravatar.cc/150?u=2" },
    { id: 3, user: "Karim Ben", interest: "Atlas Hiking", time: "5 hours ago", avatar: "https://i.pravatar.cc/150?u=3" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex selection:bg-blue-500 selection:text-white">
      <Sidebar />

      <div className="flex-1 lg:ml-64 p-8 xl:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto animate-fade-in-up">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Agency Hub</h1>
              <p className="text-slate-500 text-lg">Grow your followers to rank higher and attract more leads.</p>
            </div>
            <div className="flex flex-wrap gap-4 mt-6 md:mt-0">
               <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-8 py-3.5 rounded-2xl font-bold shadow-[0_8px_20px_rgb(245,158,11,0.3)] hover:shadow-[0_8px_25px_rgb(245,158,11,0.4)] flex items-center gap-2 transform hover:-translate-y-0.5 active:scale-95 transition-all duration-300">
                 <FaRocket className="text-lg" /> Boost an Offer
               </button>
               
               <Link to="/agency/create-offer" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl font-bold shadow-[0_8px_20px_rgb(37,99,235,0.3)] hover:shadow-[0_8px_25px_rgb(37,99,235,0.4)] flex items-center gap-2 transform hover:-translate-y-0.5 active:scale-95 transition-all duration-300">
                 + New Offer
               </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center gap-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 cursor-default">
                <div className={`w-20 h-20 rounded-[1.25rem] ${stat.color} text-white flex items-center justify-center text-3xl shadow-lg ${stat.glow} z-10 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <div className="z-10">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.title}</p>
                  <h3 className="text-4xl font-black text-slate-800 mb-1">{stat.value}</h3>
                  <span className="text-slate-500 text-sm font-medium">{stat.subtext}</span>
                </div>
                {/* Decorative Circle Background */}
                <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-300 ${stat.color}`}></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Recent Leads */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <FaWhatsapp className="text-green-500" /> Recent Contacts
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="p-6 flex items-center gap-5 hover:bg-slate-50/80 transition-colors duration-200">
                    <img src={lead.avatar} alt="User" className="w-14 h-14 rounded-full border-2 border-slate-100 shadow-sm" />
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-lg">{lead.user}</h4>
                      <p className="text-sm text-slate-500">Interested in <span className="font-semibold text-blue-600 cursor-pointer hover:underline">{lead.interest}</span></p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <span className="block text-xs text-slate-400 font-medium">{lead.time}</span>
                      <button className="bg-green-50 text-green-600 font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-green-500 hover:text-white border border-green-200 transition-all duration-300 active:scale-95">
                        <FaWhatsapp /> Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rank & Growth Tips */}
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6">Improve Your Rank</h2>
                <div className="p-5 bg-blue-50/50 rounded-2xl mb-6 border border-blue-100/50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-blue-800 font-bold text-sm">Next Rank: #3</span>
                    <span className="text-blue-600 text-xs font-bold">50 Followers needed</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full relative">
                      <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)] -skew-x-12"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200/50">
                 <h4 className="text-amber-800 font-bold text-base mb-3 flex items-center gap-2">
                   <FaBullhorn /> How to rank #1?
                 </h4>
                 <ul className="text-sm text-amber-700 space-y-3 font-medium">
                   <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">•</span> Post daily stories to engage users.</li>
                   <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">•</span> Ask satisfied clients to follow you.</li>
                   <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">•</span> Boost your best offer to get seen.</li>
                 </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;