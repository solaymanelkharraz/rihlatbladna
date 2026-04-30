import React, { useState } from 'react';
import { FaMapMarkerAlt, FaClock, FaWhatsapp, FaUserFriends, FaStar, FaHeart, FaShareAlt, FaCheckCircle, FaArrowLeft, FaShieldAlt, FaLanguage } from 'react-icons/fa';
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
    description: "Experience the magic of the golden dunes. Includes private transport, luxury tent accommodation, camel trekking at sunset, and traditional Berber music around the fire. This is a journey that will stay with you forever.",
    included: ["Private 4x4 Transport", "Luxury Tent Accommodation", "Traditional Dinner & Breakfast", "Camel Trekking Experience", "Professional Local Guide"],
    notIncluded: ["Lunch Meals", "Personal Expenses", "Tips for Guides"]
  };

  const [activeImage, setActiveImage] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 pb-24 selection:bg-blue-500 selection:text-white">
      <Navbar />

      {/* --- 1. IMAGE GALLERY --- */}
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-8 animate-fade-in-up">
        {/* Back Button */}
        <Link to="/search" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-6 transition-colors group">
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Search
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[50vh] md:h-[60vh] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgb(0,0,0,0.1)]">
          {/* Main Image */}
          <div className="h-full relative group cursor-pointer lg:col-span-3">
            <img src={tour.images[activeImage]} alt="Main" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
            
            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md text-slate-900 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg animate-pulse">
              <FaUserFriends className="text-blue-600" /> 12 people viewing
            </div>
            
            <button 
              onClick={() => setIsSaved(!isSaved)}
              className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-xl shadow-lg transition-transform active:scale-95"
            >
              <FaHeart className={isSaved ? "text-red-500" : "text-slate-400"} />
            </button>
          </div>
          
          {/* Side Images */}
          <div className="hidden lg:flex flex-col gap-4 h-full">
             <div className="relative flex-1 overflow-hidden rounded-r-[2rem] group cursor-pointer">
               <img 
                 src={tour.images[1]} 
                 onClick={() => setActiveImage(1)}
                 className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${activeImage === 1 ? 'brightness-100' : 'brightness-75'}`} 
                 alt="Side 1" 
               />
               {activeImage === 1 && <div className="absolute inset-0 border-4 border-blue-500 rounded-r-[2rem]"></div>}
             </div>
             <div className="relative flex-1 overflow-hidden rounded-br-[2rem] group cursor-pointer">
               <img 
                 src={tour.images[2]} 
                 onClick={() => setActiveImage(2)}
                 className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${activeImage === 2 ? 'brightness-100' : 'brightness-75'}`} 
                 alt="Side 2" 
               />
               {activeImage === 2 && <div className="absolute inset-0 border-4 border-blue-500 rounded-br-[2rem]"></div>}
               
               {/* "View All" Overlay */}
               <div onClick={() => setActiveImage(0)} className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/50 transition-colors">
                  <span className="text-white font-bold tracking-wider">View All +</span>
               </div>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* --- 2. MAIN CONTENT --- */}
        <div className="lg:col-span-2 space-y-10 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          
          {/* Header */}
          <div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 leading-tight tracking-tight lg:pr-8">{tour.title}</h1>
              <div className="flex flex-col md:items-end shrink-0 bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Total Price</span>
                <span className="text-4xl font-black text-blue-600 leading-none">{tour.price}</span>
                <span className="text-slate-400 text-sm line-through mt-1">1,500 DH</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-600 mt-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <span className="flex items-center gap-2 text-amber-500 text-base"><FaStar /> {tour.rating} <span className="text-slate-400 font-medium text-sm">({tour.reviews} reviews)</span></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-blue-500" /> {tour.location}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              <span className="flex items-center gap-2"><FaClock className="text-blue-500" /> {tour.duration}</span>
            </div>
          </div>

          {/* Agency Card (With Follow Button) */}
          <div className="bg-white p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] gap-4 group hover:shadow-md transition-shadow">
            <div className="flex items-center gap-5 w-full sm:w-auto">
              <img src={tour.agency.avatar} alt="Agency" className="w-16 h-16 rounded-full border-2 border-slate-100 shadow-sm group-hover:scale-105 transition-transform" />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Organized by</p>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
                  {tour.agency.name} {tour.agency.isVerified && <FaCheckCircle className="text-blue-500 text-sm" title="Verified Agency" />}
                </h3>
                <p className="text-sm font-medium text-slate-500 flex items-center gap-1"><FaUserFriends /> {tour.agency.followers} Followers</p>
              </div>
            </div>
            <button 
              onClick={() => setIsFollowing(!isFollowing)}
              className={`w-full sm:w-auto px-8 py-3 rounded-2xl font-bold transition-all duration-300 active:scale-95 ${isFollowing ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700'}`}
            >
              {isFollowing ? 'Following' : '+ Follow Agency'}
            </button>
          </div>

          {/* Description */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">About this experience</h2>
            <p className="text-slate-600 leading-relaxed text-lg">{tour.description}</p>
            
            <div className="mt-8 grid grid-cols-2 gap-4">
               <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-4 rounded-xl">
                  <FaShieldAlt className="text-2xl text-blue-500" />
                  <span className="font-bold text-sm">Secure Booking</span>
               </div>
               <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-4 rounded-xl">
                  <FaLanguage className="text-2xl text-blue-500" />
                  <span className="font-bold text-sm">English, French, Arabic</span>
               </div>
            </div>
          </div>

          {/* What's Included */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2"><FaCheckCircle className="text-green-500" /> Included</h3>
              <ul className="space-y-4">
                {tour.included.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 font-medium">
                    <span className="text-green-500 mt-1">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2"><span className="text-red-500 font-bold">✕</span> Not Included</h3>
              <ul className="space-y-4">
                {tour.notIncluded.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-400 font-medium">
                    <span className="text-slate-300 mt-1">✕</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* --- 3. STICKY ACTION CARD (Desktop) --- */}
        <div className="hidden lg:block animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.06)] border border-slate-100 sticky top-28">
            <div className="text-center mb-8">
               <span className="block text-slate-400 font-bold uppercase tracking-wider text-sm mb-2">Ready to explore?</span>
               <h3 className="text-3xl font-black text-slate-900">{tour.price}</h3>
               <p className="text-slate-500 text-sm mt-1">No hidden fees.</p>
            </div>
            
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4.5 rounded-2xl shadow-[0_8px_20px_rgb(34,197,94,0.3)] hover:shadow-[0_8px_25px_rgb(34,197,94,0.4)] flex items-center justify-center gap-3 text-lg transition-all duration-300 active:scale-95 mb-4 group">
              <FaWhatsapp className="text-2xl group-hover:scale-110 transition-transform" /> Contact via WhatsApp
            </button>

            <div className="flex gap-4">
              <button 
                onClick={() => setIsSaved(!isSaved)}
                className={`flex-1 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${isSaved ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
              >
                <FaHeart /> {isSaved ? 'Saved' : 'Save'}
              </button>
              <button className="flex-1 bg-slate-50 border border-slate-200 py-3.5 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-2 transition-colors">
                <FaShareAlt /> Share
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm font-medium text-slate-500">
                You will be contacting <span className="font-bold text-slate-800">{tour.agency.name}</span> directly. 
                RihlatBladna does not process payments.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* --- 4. MOBILE STICKY BAR (Bottom) --- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-4 px-6 flex items-center justify-between z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        <div>
          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Total Price</span>
          <span className="text-2xl font-black text-slate-900">{tour.price}</span>
        </div>
        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-8 rounded-2xl shadow-[0_8px_20px_rgb(34,197,94,0.3)] flex items-center gap-2 transition-transform active:scale-95">
           <FaWhatsapp className="text-xl" /> Chat Now
        </button>
      </div>

    </div>
  );
};

export default TourDetails;