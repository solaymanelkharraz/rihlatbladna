import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaUserFriends, FaCheckCircle, FaTrophy, FaStar } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';

const Agencies = () => {
  // --- MOCK DATA (Sorted by Rank/Followers) ---
  const agencies = [
    { id: 1, name: "Sahara Travels", location: "Merzouga", followers: 1205, rank: 1, isVerified: true, avatar: "https://i.pravatar.cc/150?u=agency1", cover: "https://images.unsplash.com/photo-1542044896530-05d85be9b11a?q=80&w=1000", rating: 4.9 },
    { id: 2, name: "Blue Pearl Tours", location: "Chefchaouen", followers: 980, rank: 2, isVerified: true, avatar: "https://i.pravatar.cc/150?u=agency2", cover: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071", rating: 4.8 },
    { id: 3, name: "Atlas Hiking Pro", location: "Imlil", followers: 850, rank: 3, isVerified: false, avatar: "https://i.pravatar.cc/150?u=agency3", cover: "https://images.unsplash.com/photo-1535068484670-af9d0eb6a7c3?q=80&w=2062", rating: 4.7 },
    { id: 4, name: "Marrakech Guides", location: "Marrakech", followers: 620, rank: 4, isVerified: true, avatar: "https://i.pravatar.cc/150?u=agency4", cover: "https://plus.unsplash.com/premium_photo-1661962360706-538096f9c948?q=80&w=2070", rating: 4.6 },
    { id: 5, name: "Surf Morocco", location: "Taghazout", followers: 410, rank: 5, isVerified: false, avatar: "https://i.pravatar.cc/150?u=agency5", cover: "https://images.unsplash.com/photo-1580608204899-27829db763a8?q=80&w=2070", rating: 4.8 },
    { id: 6, name: "City Vibes", location: "Casablanca", followers: 230, rank: 6, isVerified: false, avatar: "https://i.pravatar.cc/150?u=agency6", cover: "https://images.unsplash.com/photo-1560126504-00d072f88704?q=80&w=2070", rating: 4.3 },
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 selection:bg-blue-500 selection:text-white pb-24">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-32 animate-fade-in-up">
        
        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-300 rounded-full blur-[100px] opacity-30 -z-10"></div>
          
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Top Rated Agencies</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Follow the best agencies in Morocco to discover their latest offers, exclusive deals, and stories on your feed.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto mt-10 relative group">
             <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
               <FaSearch className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
             </div>
             <input 
               type="text" 
               placeholder="Search for an agency (e.g. Sahara Travels)..." 
               className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-700 transition-all duration-300 placeholder:text-slate-400 placeholder:font-medium bg-white"
             />
          </div>
        </div>

        {/* Agencies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agencies.map((agency) => (
            <div key={agency.id} className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500">
              
              {/* Cover Image */}
              <div className="h-40 bg-slate-200 relative overflow-hidden">
                <img src={agency.cover} alt="Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-4 right-4 z-10">
                   {agency.rank <= 3 && (
                     <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform group-hover:scale-105 transition-transform">
                       <FaTrophy /> #{agency.rank}
                     </div>
                   )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="px-8 pb-8 relative">
                <div className="flex justify-between items-end -mt-12 mb-5 relative z-20">
                  <div className="relative group/avatar">
                    <img src={agency.avatar} alt={agency.name} className="w-24 h-24 rounded-[1.5rem] border-4 border-white shadow-lg bg-white object-cover group-hover/avatar:scale-105 transition-transform duration-300" />
                  </div>
                  <button className="bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-bold px-8 py-2.5 rounded-xl text-sm transition-all duration-300 shadow-sm active:scale-95">
                    Follow
                  </button>
                </div>
                
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2 mb-1 group-hover:text-blue-600 transition-colors">
                    {agency.name} 
                    {agency.isVerified && <FaCheckCircle className="text-blue-500 text-base" title="Verified Agency" />}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm font-medium text-slate-500 mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-blue-400" /> {agency.location}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="flex items-center gap-1.5 text-slate-700 font-bold"><FaUserFriends className="text-blue-400"/> {agency.followers}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="flex items-center gap-1 text-amber-500 font-bold"><FaStar /> {agency.rating}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-16 text-center">
          <button className="bg-white border-2 border-slate-200 text-slate-600 font-bold py-4 px-10 rounded-2xl hover:border-blue-600 hover:text-blue-600 hover:shadow-[0_8px_30px_rgb(37,99,235,0.15)] transition-all duration-300 active:scale-95">
            Load More Agencies
          </button>
        </div>

      </div>
    </div>
  );
};

export default Agencies;