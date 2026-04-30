import React from 'react';
import { FaMapMarkerAlt, FaCommentDots, FaHeart, FaUserPlus, FaWhatsapp, FaCameraRetro } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';

const Profile = () => {
  const user = {
    name: "Soulayman Elkharraz",
    role: "Explorer",
    avatar: "https://i.pravatar.cc/150?u=soulayman",
    location: "Tangier, Morocco"
  };

  // Agencies the user follows
  const following = [
    { name: "Sahara Travels", avatar: "https://i.pravatar.cc/150?u=agency1" },
    { name: "Atlas Hiking", avatar: "https://i.pravatar.cc/150?u=agency2" },
    { name: "Blue Pearl Tours", avatar: "https://i.pravatar.cc/150?u=agency3" },
  ];

  // Inquiries
  const inquiries = [
    { id: 1, title: "Sahara Desert Trek", agency: "Sahara Travels", date: "Today", status: "Contacted", image: "https://images.unsplash.com/photo-1542044896530-05d85be9b11a?q=80&w=1000" },
    { id: 2, title: "Blue City Day Trip", agency: "Blue Pearl", date: "Yesterday", status: "Chatting", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-blue-500 selection:text-white pb-24">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-32 pb-12 flex flex-col lg:flex-row gap-8">
        
        {/* --- LEFT: SIDEBAR PROFILE --- */}
        <div className="w-full lg:w-1/4 animate-fade-in-up">
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 text-center border border-slate-100 sticky top-28 relative overflow-hidden group">
            {/* Background blur decorative element */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full filter blur-3xl opacity-50 group-hover:bg-blue-200 transition-colors duration-500"></div>
            
            <div className="relative w-32 h-32 mx-auto mb-6">
              <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full border-4 border-white shadow-lg object-cover z-10 relative group-hover:scale-105 transition-transform duration-500" />
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition-colors z-20 hover:scale-110">
                <FaCameraRetro />
              </button>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{user.name}</h2>
            <p className="text-slate-500 text-sm mb-8 flex items-center justify-center gap-1 font-medium mt-1">
              <FaMapMarkerAlt className="text-blue-500" /> {user.location}
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 mb-8 border-y border-slate-100 py-6">
              <div className="text-center group-hover:-translate-y-1 transition-transform duration-300 delay-75">
                <span className="block font-black text-2xl text-slate-800">{following.length}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Following</span>
              </div>
              <div className="w-px bg-slate-100"></div>
              <div className="text-center group-hover:-translate-y-1 transition-transform duration-300 delay-150">
                <span className="block font-black text-2xl text-slate-800">{inquiries.length}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Inquiries</span>
              </div>
            </div>

            <div className="text-left">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-4">Agencies you follow</h4>
              <div className="flex -space-x-3 overflow-hidden p-1">
                {following.map((agency, i) => (
                  <img key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-white shadow-sm hover:z-10 hover:scale-110 transition-transform cursor-pointer" src={agency.avatar} alt={agency.name} title={agency.name} />
                ))}
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 ring-2 ring-white shadow-sm cursor-pointer hover:bg-slate-200 transition-colors">
                  +{following.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT: MAIN CONTENT --- */}
        <div className="w-full lg:w-3/4 space-y-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          
          {/* Section 1: My Inquiries (Conversations) */}
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 border border-slate-100">
            <h3 className="text-2xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-500 rounded-xl"><FaCommentDots /></div> 
              My Inquiries
            </h3>
            <div className="space-y-4">
              {inquiries.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-5 items-center bg-slate-50/50 p-5 rounded-2xl hover:bg-white hover:shadow-md border border-slate-100 transition-all duration-300 group">
                  <div className="relative w-full md:w-28 h-28 rounded-xl overflow-hidden shadow-sm">
                    <img src={item.image} alt="Trip" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h4 className="font-bold text-xl text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                    <p className="text-slate-500 text-sm">Agency: <span className="font-semibold text-slate-700">{item.agency}</span></p>
                  </div>
                  <div className="text-right flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{item.date}</span>
                    <button className="w-full md:w-auto bg-green-500 text-white text-sm font-bold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-green-600 shadow-[0_8px_20px_rgb(34,197,94,0.3)] hover:shadow-[0_8px_25px_rgb(34,197,94,0.4)] transition-all duration-300 active:scale-95">
                      <FaWhatsapp className="text-lg" /> Continue Chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Wishlist (Potential Leads) */}
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 border border-slate-100">
            <h3 className="text-2xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
              <div className="p-2 bg-red-50 text-red-500 rounded-xl"><FaHeart /></div> 
              Wishlist
            </h3>
            <div className="py-16 px-8 text-center bg-slate-50/50 rounded-2xl border-dashed border-2 border-slate-200">
              <div className="w-20 h-20 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                <FaHeart />
              </div>
              <p className="text-slate-500 font-medium text-lg mb-2">You haven't saved any trips yet.</p>
              <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">Go explore our amazing tours and save the ones you love to easily find them later.</p>
              <button className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-all duration-300 active:scale-95">
                Explore Tours
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;