import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaUserFriends, FaCheckCircle, FaTrophy, FaStar } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';
const Agencies = () => {
  const navigate = useNavigate();
  const { user, toggleFollowAgency, showAlert, agencies: rawAgencies } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const handleFollowClick = (agencyId, agencyName) => {
    if (!user) {
      showAlert("Authentication Required", "Please log in as a Traveler to follow agencies!", "info");
      return;
    }
    if (user.role !== 'traveler') {
      showAlert("Access Denied", "Only traveler accounts can follow agencies.", "error");
      return;
    }
    const alreadyFollowing = user.followingAgencies?.includes(agencyId);
    toggleFollowAgency(agencyId);
    if (alreadyFollowing) {
      showAlert("Unfollowed", `You are no longer following ${agencyName}.`, "info");
    } else {
      showAlert("Success", `You are now following ${agencyName}! 🚀`, "success");
    }
  };

  // Filter based on search input and sort by followers
  const agencies = (rawAgencies || [])
    .filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b.followersCount - a.followersCount);

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
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-700 transition-all duration-300 placeholder:text-slate-400 placeholder:font-medium bg-white"
             />
          </div>
        </div>

        {/* Agencies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agencies.map((agency, index) => {
            const rank = index + 1;
            const followersText = agency.followersCount >= 1000 
              ? (agency.followersCount / 1000).toFixed(1) + 'K' 
              : agency.followersCount;

            return (
              <div key={agency.id} className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500">
                
                {/* Cover Image */}
                <div 
                  onClick={() => navigate(`/agency/${agency.id}`)}
                  className="h-40 bg-slate-200 relative overflow-hidden cursor-pointer"
                >
                  <img src={agency.cover} alt="Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-4 right-4 z-10">
                     {rank <= 3 && (
                       <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform group-hover:scale-105 transition-transform">
                         <FaTrophy /> #{rank}
                       </div>
                     )}
                  </div>
                </div>

                {/* Profile Info */}
                <div className="px-8 pb-8 relative">
                  <div className="flex justify-between items-end -mt-12 mb-5 relative z-20">
                    <div className="relative group/avatar">
                      <img 
                        onClick={() => navigate(`/agency/${agency.id}`)}
                        src={agency.avatar} 
                        alt={agency.name} 
                        className="w-24 h-24 rounded-[1.5rem] border-4 border-white shadow-lg bg-white object-cover cursor-pointer hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                    {(() => {
                      const isFollowing = user && user.role === 'traveler' && user.followingAgencies?.includes(agency.id);
                      return (
                        <button 
                          onClick={() => handleFollowClick(agency.id, agency.name)}
                          className={`font-bold px-8 py-2.5 rounded-xl text-sm transition-all duration-300 shadow-sm active:scale-95 cursor-pointer border ${
                            isFollowing 
                              ? 'bg-slate-200 hover:bg-slate-300 text-slate-700 border-slate-300' 
                              : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                          }`}
                        >
                          {isFollowing ? 'Following' : 'Follow'}
                        </button>
                      );
                    })()}
                  </div>
                  
                  <div>
                    <h3 
                      onClick={() => navigate(`/agency/${agency.id}`)}
                      className="text-2xl font-extrabold text-slate-900 flex items-center gap-2 mb-1 cursor-pointer hover:text-blue-600 transition-colors"
                    >
                      {agency.name} 
                      {agency.isVerified && <FaCheckCircle className="text-blue-500 text-base" title="Verified Agency" />}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm font-medium text-slate-500 mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-blue-400" /> {agency.location}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                      <span className="flex items-center gap-1.5 text-slate-700 font-bold"><FaUserFriends className="text-blue-400"/> {followersText}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold"><FaStar className="text-xs mb-0.5" /> {agency.rating}</span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Empty state when no agencies found */}
        {agencies.length === 0 && (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-[2rem] p-8 max-w-md mx-auto shadow-sm">
            <p className="text-slate-400 font-bold text-sm">No agencies match your search terms.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Agencies;