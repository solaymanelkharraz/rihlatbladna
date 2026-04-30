import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaFilter, FaStar, FaHeart, FaWhatsapp, FaSlidersH, FaCalendarAlt, FaChevronDown } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';

const Search = () => {
  // --- MOCK DATA ---
  const tours = [
    { id: 1, title: "Sahara Desert Trek", price: "1,200", location: "Merzouga", duration: "3 Days", rating: 4.8, agency: "Sahara Travels", image: "https://images.unsplash.com/photo-1542044896530-05d85be9b11a?q=80&w=1000", tags: ["Adventure", "Desert"] },
    { id: 2, title: "Blue City Day Trip", price: "450", location: "Chefchaouen", duration: "1 Day", rating: 4.9, agency: "Blue Pearl", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071", tags: ["Culture", "Photography"] },
    { id: 3, title: "Atlas Mountain Hike", price: "800", location: "Imlil", duration: "2 Days", rating: 4.7, agency: "Atlas Hiking", image: "https://images.unsplash.com/photo-1535068484670-af9d0eb6a7c3?q=80&w=2062", tags: ["Hiking", "Nature"] },
    { id: 4, title: "Marrakech Souk Tour", price: "300", location: "Marrakech", duration: "4 Hours", rating: 4.5, agency: "City Guides", image: "https://plus.unsplash.com/premium_photo-1661962360706-538096f9c948?q=80&w=2070", tags: ["City", "Shopping"] },
    { id: 5, title: "Surf Camp Taghazout", price: "2,500", location: "Agadir", duration: "5 Days", rating: 4.9, agency: "Wave Hunters", image: "https://images.unsplash.com/photo-1580608204899-27829db763a8?q=80&w=2070", tags: ["Sports", "Beach"] },
    { id: 6, title: "Ouzoud Waterfalls", price: "350", location: "Azilal", duration: "1 Day", rating: 4.6, agency: "Nature Trips", image: "https://images.unsplash.com/photo-1560126504-00d072f88704?q=80&w=2070", tags: ["Nature", "Day Trip"] },
  ];

  const [priceRange, setPriceRange] = useState(3000);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Adventure", "Culture", "Relaxation", "Family", "Hiking"];

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 selection:bg-blue-500 selection:text-white pb-24">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-32">
        
        {/* Header & Quick Categories */}
        <div className="mb-10 animate-fade-in-up">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">Explore Morocco</h1>
              <p className="text-slate-500 text-lg">{tours.length} extraordinary trips waiting for you.</p>
            </div>
            
            {/* Mobile Filter Toggle */}
            <button className="md:hidden w-full flex items-center justify-center gap-2 bg-white px-6 py-3.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 font-bold text-slate-700 active:scale-95 transition-transform">
              <FaSlidersH className="text-blue-600" /> Filters & Sort
            </button>
          </div>

          {/* Pill Categories */}
          <div className="flex overflow-x-auto pb-4 gap-3 hide-scrollbar">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                  activeCategory === cat 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- 1. FILTERS SIDEBAR (Desktop) --- */}
          <div className="w-full lg:w-1/4 hidden lg:block animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 sticky top-28">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-extrabold text-xl flex items-center gap-2 text-slate-800">
                  <FaSlidersH className="text-blue-600" /> Filters
                </h3>
                <span className="text-xs font-bold text-slate-400 cursor-pointer hover:text-blue-600 transition-colors">Reset All</span>
              </div>
              
              {/* Price Filter */}
              <div className="mb-10">
                <label className="flex justify-between items-center text-sm font-bold text-slate-700 mb-4">
                  <span>Max Price</span>
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg">{priceRange} DH</span>
                </label>
                <input 
                  type="range" 
                  min="100" 
                  max="5000" 
                  value={priceRange} 
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-3 font-medium">
                  <span>100 DH</span>
                  <span>5000+ DH</span>
                </div>
              </div>

              {/* Destinations Filter */}
              <div className="mb-10">
                <label className="block text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-slate-400" /> Destinations
                </label>
                <div className="space-y-3">
                  {['Marrakech', 'Tangier', 'Merzouga', 'Chefchaouen', 'Agadir'].map((city) => (
                    <label key={city} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="relative flex items-center justify-center">
                          <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded text-blue-600 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" />
                          <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{city}</span>
                      </div>
                      <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">24</span>
                    </label>
                  ))}
                </div>
                <button className="text-blue-600 text-sm font-bold mt-4 hover:underline flex items-center gap-1">
                  Show More <FaChevronDown className="text-[10px]" />
                </button>
              </div>

              {/* Duration Filter */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <FaCalendarAlt className="text-slate-400" /> Duration
                </label>
                <div className="space-y-3">
                  {['Day Trips', '2-3 Days', '4-7 Days', '1 Week+'].map((dur) => (
                    <label key={dur} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded text-blue-600 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" />
                        <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{dur}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* --- 2. OFFERS GRID --- */}
          <div className="w-full lg:w-3/4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            
            {/* Sort Bar */}
            <div className="flex justify-between items-center mb-6 px-2">
              <p className="text-slate-500 font-medium">Showing <span className="font-bold text-slate-800">1-{tours.length}</span> of {tours.length} results</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-500 hidden sm:block">Sort by:</span>
                <select className="bg-white border border-slate-200 text-slate-800 text-sm font-bold rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-sm">
                  <option>Recommended</option>
                  <option>Lowest Price</option>
                  <option>Highest Price</option>
                  <option>Top Rated</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tours.map((tour) => (
                <div key={tour.id} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 flex flex-col">
                  
                  {/* Image Section */}
                  <div className="relative h-64 overflow-hidden">
                    <img src={tour.image} alt={tour.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                    
                    {/* Floating Badges */}
                    <button className="absolute top-5 right-5 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:scale-110 shadow-lg transition-all duration-300 z-10">
                      <FaHeart />
                    </button>
                    
                    <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end z-10">
                      <div className="bg-white/90 backdrop-blur-md text-slate-900 px-3.5 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-lg">
                        <FaMapMarkerAlt className="text-blue-600" /> {tour.location}
                      </div>
                      <div className="bg-amber-500 text-white px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 shadow-lg shadow-amber-500/30">
                        <FaStar /> {tour.rating}
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex gap-2 mb-3">
                      {tour.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link to={`/tour/${tour.id}`} className="block group-hover:text-blue-600 transition-colors duration-300 mb-2">
                      <h3 className="text-2xl font-extrabold text-slate-900 leading-tight line-clamp-2">{tour.title}</h3>
                    </Link>

                    <div className="flex items-center text-sm text-slate-500 mb-6 font-medium">
                      <span>{tour.duration}</span>
                      <span className="mx-2">•</span>
                      <span>Free Cancellation</span>
                    </div>

                    <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">From</span>
                        <div className="flex items-baseline gap-1">
                          <span className="font-black text-2xl text-slate-900">{tour.price}</span>
                          <span className="font-bold text-slate-500">DH</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 mr-2">
                           <img src={`https://i.pravatar.cc/150?u=${tour.id}`} alt="Agency" className="w-8 h-8 rounded-full border border-slate-200" />
                        </div>
                        <button className="bg-green-50 hover:bg-green-500 text-green-600 hover:text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300">
                          <FaWhatsapp className="text-xl" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination / Load More */}
            <div className="mt-16 text-center">
              <button className="bg-white border-2 border-slate-200 text-slate-600 font-bold py-4 px-10 rounded-2xl hover:border-blue-600 hover:text-blue-600 hover:shadow-[0_8px_30px_rgb(37,99,235,0.15)] transition-all duration-300 active:scale-95">
                Load More Experiences
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Search;