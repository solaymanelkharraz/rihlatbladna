import React, { useState } from 'react';
import { FaMapMarkerAlt, FaClock, FaWhatsapp, FaUserFriends, FaStar, FaHeart, FaShareAlt, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';

const TourDetails = () => {
  // --- MOCK DATA ---
  const tour = {
    title: "Luxury Sahara Desert Experience",
    price: "1,200 DH",
    location: "Merzouga, Morocco",
    duration: "3 Days / 2 Nights",
    rating: 4.8,
    reviews: 124,
    images: [
      "https://images.unsplash.com/photo-1542044896530-05d85be9b11a?q=80&w=1000",
      "https://images.unsplash.com/photo-1518182170546-0766ce6fec56?q=80&w=2070",
      "https://images.unsplash.com/photo-1590074258933-d9d8858d4a67?q=80&w=1000"
    ],
    agency: {
      name: "Sahara Travels",
      avatar: "https://i.pravatar.cc/150?u=agency1",
      followers: "1.2k",
      isVerified: true
    },
    description: "Experience the magic of the golden dunes. Includes private transport, luxury tent accommodation, camel trekking at sunset, and traditional Berber music around the fire.",
    included: ["Private 4x4 Transport", "Luxury Tent", "Dinner & Breakfast", "Camel Trek", "Guide"],
    notIncluded: ["Lunch", "Drinks", "Tips"]
  };

  const [activeImage, setActiveImage] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="bg-white min-h-screen font-sans text-slate-800 pb-24">
      <Navbar />

      {/* --- 1. IMAGE GALLERY --- */}
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-6 transition">
          <FaArrowLeft /> Back to Search
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[50vh] md:h-[60vh] rounded-3xl overflow-hidden shadow-2xl">
          {/* Main Image */}
          <div className="h-full relative group cursor-pointer">
            <img src={tour.images[activeImage]} alt="Main" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
              <FaUserFriends /> 12 people viewing
            </div>
          </div>
          
          {/* Side Images */}
          <div className="hidden lg:grid grid-rows-2 gap-4 h-full">
             <img 
               src={tour.images[1]} 
               onClick={() => setActiveImage(1)}
               className={`w-full h-full object-cover cursor-pointer hover:opacity-90 transition ${activeImage === 1 ? 'ring-4 ring-blue-500' : ''}`} 
               alt="Side 1" 
             />
             <img 
               src={tour.images[2]} 
               onClick={() => setActiveImage(2)}
               className={`w-full h-full object-cover cursor-pointer hover:opacity-90 transition ${activeImage === 2 ? 'ring-4 ring-blue-500' : ''}`} 
               alt="Side 2" 
             />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* --- 2. MAIN CONTENT --- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header */}
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 leading-tight">{tour.title}</h1>
              <div className="flex flex-col items-end">
                <span className="text-3xl font-bold text-blue-600">{tour.price}</span>
                <span className="text-slate-400 text-sm line-through">1,500 DH</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500 mt-2">
              <span className="flex items-center gap-1 text-amber-500"><FaStar /> {tour.rating} ({tour.reviews} reviews)</span>
              <span>•</span>
              <span className="flex items-center gap-1"><FaMapMarkerAlt /> {tour.location}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><FaClock /> {tour.duration}</span>
            </div>
          </div>

          {/* Agency Card (With Follow Button) */}
          <div className="bg-slate-50 p-6 rounded-2xl flex items-center justify-between border border-slate-100">
            <div className="flex items-center gap-4">
              <img src={tour.agency.avatar} alt="Agency" className="w-14 h-14 rounded-full border-2 border-white shadow-sm" />
              <div>
                <h3 className="font-bold text-slate-900 flex items-center gap-1">
                  {tour.agency.name} {tour.agency.isVerified && <FaCheckCircle className="text-blue-500 text-xs" />}
                </h3>
                <p className="text-xs text-slate-500">{tour.agency.followers} Followers</p>
              </div>
            </div>
            <button 
              onClick={() => setIsFollowing(!isFollowing)}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${isFollowing ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
            >
              {isFollowing ? 'Following' : '+ Follow'}
            </button>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">About this trip</h2>
            <p className="text-slate-600 leading-relaxed text-lg">{tour.description}</p>
          </div>

          {/* What's Included */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-slate-900 mb-4">Included ✅</h3>
              <ul className="space-y-2">
                {tour.included.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-600 text-sm">
                    <FaCheckCircle className="text-green-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-4">Not Included ❌</h3>
              <ul className="space-y-2">
                {tour.notIncluded.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-400 text-sm">
                    <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">-</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* --- 3. STICKY ACTION CARD (Desktop) --- */}
        <div className="hidden lg:block">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 sticky top-28">
            <p className="text-slate-500 font-bold mb-6 text-center">Interested in this trip?</p>
            
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/30 flex items-center justify-center gap-3 text-lg transition-transform active:scale-95 mb-4">
              <FaWhatsapp className="text-2xl" /> Contact on WhatsApp
            </button>

            <div className="flex gap-4">
              <button className="flex-1 border border-slate-200 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2">
                <FaHeart /> Save
              </button>
              <button className="flex-1 border border-slate-200 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2">
                <FaShareAlt /> Share
              </button>
            </div>

            <p className="text-xs text-slate-400 text-center mt-6">
              Direct contact with agency. No hidden fees.
            </p>
          </div>
        </div>

      </div>

      {/* --- 4. MOBILE STICKY BAR (Bottom) --- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 px-6 flex items-center justify-between z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
        <div>
          <span className="block text-xs text-slate-400 font-bold uppercase">Total Price</span>
          <span className="text-2xl font-black text-blue-600">{tour.price}</span>
        </div>
        <button className="bg-green-500 text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center gap-2">
           <FaWhatsapp className="text-xl" /> Chat
        </button>
      </div>

    </div>
  );
};

export default TourDetails;