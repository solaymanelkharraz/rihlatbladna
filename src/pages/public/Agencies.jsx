import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaUserFriends, FaCheckCircle, FaTrophy } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';

const Agencies = () => {
  // --- MOCK DATA (Sorted by Rank/Followers) ---
  const agencies = [
    { id: 1, name: "Sahara Travels", location: "Merzouga", followers: 1205, rank: 1, isVerified: true, avatar: "https://i.pravatar.cc/150?u=agency1", cover: "https://images.unsplash.com/photo-1542044896530-05d85be9b11a?q=80&w=1000" },
    { id: 2, name: "Blue Pearl Tours", location: "Chefchaouen", followers: 980, rank: 2, isVerified: true, avatar: "https://i.pravatar.cc/150?u=agency2", cover: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071" },
    { id: 3, name: "Atlas Hiking Pro", location: "Imlil", followers: 850, rank: 3, isVerified: false, avatar: "https://i.pravatar.cc/150?u=agency3", cover: "https://images.unsplash.com/photo-1535068484670-af9d0eb6a7c3?q=80&w=2062" },
    { id: 4, name: "Marrakech Guides", location: "Marrakech", followers: 620, rank: 4, isVerified: true, avatar: "https://i.pravatar.cc/150?u=agency4", cover: "https://plus.unsplash.com/premium_photo-1661962360706-538096f9c948?q=80&w=2070" },
    { id: 5, name: "Surf Morocco", location: "Taghazout", followers: 410, rank: 5, isVerified: false, avatar: "https://i.pravatar.cc/150?u=agency5", cover: "https://images.unsplash.com/photo-1580608204899-27829db763a8?q=80&w=2070" },
    { id: 6, name: "City Vibes", location: "Casablanca", followers: 230, rank: 6, isVerified: false, avatar: "https://i.pravatar.cc/150?u=agency6", cover: "https://images.unsplash.com/photo-1560126504-00d072f88704?q=80&w=2070" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-24">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-slate-900 mb-4">Top Rated Agencies</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Follow the best agencies in Morocco to see their latest offers and stories on your feed.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto mt-8 relative">
             <FaSearch className="absolute left-5 top-4 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search agency name..." 
               className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 shadow-sm focus:border-blue-500 outline-none font-medium"
             />
          </div>
        </div>

        {/* Agencies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agencies.map((agency) => (
            <div key={agency.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 group hover:-translate-y-2 transition-all duration-300">
              
              {/* Cover Image */}
              <div className="h-32 bg-slate-200 relative">
                <img src={agency.cover} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute top-0 right-0 p-3">
                   {agency.rank <= 3 && (
                     <div className="bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                       <FaTrophy /> #{agency.rank}
                     </div>
                   )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="px-6 pb-6 relative">
                <div className="flex justify-between items-end -mt-10 mb-4">
                  <img src={agency.avatar} alt={agency.name} className="w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-white" />
                  <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold px-6 py-2 rounded-full text-sm transition">
                    Follow
                  </button>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    {agency.name} 
                    {agency.isVerified && <FaCheckCircle className="text-blue-500 text-sm" />}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                    <span className="flex items-center gap-1"><FaMapMarkerAlt /> {agency.location}</span>
                    <span className="flex items-center gap-1 text-slate-800 font-bold"><FaUserFriends className="text-slate-400"/> {agency.followers}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Agencies;