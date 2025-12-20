import React from 'react';
import { FaMapMarkerAlt, FaCommentDots, FaHeart, FaUserPlus, FaWhatsapp } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';

const Profile = () => {
  const user = {
    name: "Soulayman Elkharraz",
    role: "Explorer",
    avatar: "https://i.pravatar.cc/150?u=soulayman",
    location: "Tangier, Morocco"
  };

  // Agencies the user follows (This drives the agency ranking)
  const following = [
    { name: "Sahara Travels", avatar: "https://i.pravatar.cc/150?u=agency1" },
    { name: "Atlas Hiking", avatar: "https://i.pravatar.cc/150?u=agency2" },
    { name: "Blue Pearl Tours", avatar: "https://i.pravatar.cc/150?u=agency3" },
  ];

  // Inquiries (Not Bookings yet)
  const inquiries = [
    { id: 1, title: "Sahara Desert Trek", agency: "Sahara Travels", date: "Today", status: "Contacted", image: "https://images.unsplash.com/photo-1542044896530-05d85be9b11a?q=80&w=1000" },
    { id: 2, title: "Blue City Day Trip", agency: "Blue Pearl", date: "Yesterday", status: "Chatting", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col lg:flex-row gap-8">
        
        {/* --- LEFT: SIDEBAR PROFILE --- */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white rounded-3xl shadow-xl p-6 text-center border border-slate-100 sticky top-28">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full border-4 border-blue-100 object-cover" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
            <p className="text-slate-500 text-sm mb-6">{user.location}</p>
            
            {/* Stats */}
            <div className="flex justify-center gap-6 mb-6 border-b border-slate-100 pb-6">
              <div className="text-center">
                <span className="block font-bold text-lg text-slate-800">{following.length}</span>
                <span className="text-xs text-slate-400 uppercase">Following</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-lg text-slate-800">{inquiries.length}</span>
                <span className="text-xs text-slate-400 uppercase">Inquiries</span>
              </div>
            </div>

            <div className="text-left">
              <h4 className="font-bold text-sm text-slate-400 uppercase mb-3 ml-2">Agencies you follow</h4>
              <div className="flex -space-x-2 overflow-hidden mb-4 pl-2">
                {following.map((agency, i) => (
                  <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src={agency.avatar} alt={agency.name} />
                ))}
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 ring-2 ring-white">+</div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT: MAIN CONTENT --- */}
        <div className="w-full lg:w-3/4 space-y-8">
          
          {/* Section 1: My Inquiries (Conversations) */}
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-100">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaCommentDots className="text-blue-500"/> My Inquiries
            </h3>
            <div className="space-y-4">
              {inquiries.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-4 items-center bg-slate-50 p-4 rounded-2xl hover:bg-slate-100 transition">
                  <img src={item.image} alt="Trip" className="w-full md:w-20 h-20 rounded-xl object-cover" />
                  <div className="flex-1 text-center md:text-left">
                    <h4 className="font-bold text-lg">{item.title}</h4>
                    <p className="text-slate-500 text-sm">Agency: <span className="font-semibold text-blue-600">{item.agency}</span></p>
                  </div>
                  <div className="text-right flex flex-col items-center md:items-end gap-2">
                    <span className="text-xs text-slate-400">{item.date}</span>
                    <button className="bg-green-100 text-green-700 text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-green-200 transition">
                      <FaWhatsapp /> Continue Chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Wishlist (Potential Leads) */}
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-100">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">Wishlist <FaHeart className="text-red-500" /></h3>
            <div className="p-10 text-center bg-slate-50 rounded-2xl border-dashed border-2 border-slate-200 text-slate-400">
              <p>You haven't saved any trips yet. <br/> Go explore and follow agencies!</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;