import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaFilter, FaStar, FaHeart, FaWhatsapp } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';

const Search = () => {
  // --- MOCK DATA ---
  const tours = [
    { id: 1, title: "Sahara Desert Trek", price: "1,200 DH", location: "Merzouga", duration: "3 Days", rating: 4.8, agency: "Sahara Travels", image: "https://images.unsplash.com/photo-1542044896530-05d85be9b11a?q=80&w=1000" },
    { id: 2, title: "Blue City Day Trip", price: "450 DH", location: "Chefchaouen", duration: "1 Day", rating: 4.9, agency: "Blue Pearl", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071" },
    { id: 3, title: "Atlas Mountain Hike", price: "800 DH", location: "Imlil", duration: "2 Days", rating: 4.7, agency: "Atlas Hiking", image: "https://images.unsplash.com/photo-1535068484670-af9d0eb6a7c3?q=80&w=2062" },
    { id: 4, title: "Marrakech Souk Tour", price: "300 DH", location: "Marrakech", duration: "4 Hours", rating: 4.5, agency: "City Guides", image: "https://plus.unsplash.com/premium_photo-1661962360706-538096f9c948?q=80&w=2070" },
    { id: 5, title: "Surf Camp Taghazout", price: "2,500 DH", location: "Agadir", duration: "5 Days", rating: 4.9, agency: "Wave Hunters", image: "https://images.unsplash.com/photo-1580608204899-27829db763a8?q=80&w=2070" },
    { id: 6, title: "Ouzoud Waterfalls", price: "350 DH", location: "Azilal", duration: "1 Day", rating: 4.6, agency: "Nature Trips", image: "https://images.unsplash.com/photo-1560126504-00d072f88704?q=80&w=2070" },
  ];

  const [priceRange, setPriceRange] = useState(3000);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-24">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Explore Morocco</h1>
            <p className="text-slate-500">{tours.length} trips found available now.</p>
          </div>
          
          {/* Mobile Filter Toggle (Visible only on mobile) */}
          <button className="md:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 font-bold text-sm">
            <FaFilter /> Filters
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- 1. FILTERS SIDEBAR --- */}
          <div className="w-full lg:w-1/4 h-fit bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hidden md:block sticky top-28">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><FaFilter /> Filters</h3>
            
            {/* Price Filter */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-700 mb-2">Max Price: <span className="text-blue-600">{priceRange} DH</span></label>
              <input 
                type="range" 
                min="100" 
                max="5000" 
                value={priceRange} 
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>100 DH</span>
                <span>5000 DH+</span>
              </div>
            </div>

            {/* City Filter */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-700 mb-3">Destinations</label>
              <div className="space-y-2">
                {['Marrakech', 'Tangier', 'Merzouga', 'Chefchaouen', 'Agadir'].map((city) => (
                  <label key={city} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-slate-600 group-hover:text-blue-600 transition">{city}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-3">Trip Style</label>
              <div className="space-y-2">
                {['Adventure', 'Relaxation', 'Culture', 'Family', 'Hiking'].map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-slate-600 group-hover:text-blue-600 transition">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition">
              Apply Filters
            </button>
          </div>

          {/* --- 2. OFFERS GRID --- */}
          <div className="w-full lg:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {tours.map((tour) => (
                <div key={tour.id} className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                  
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img src={tour.image} alt={tour.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-sm cursor-pointer hover:text-red-500 transition">
                      <FaHeart />
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <FaMapMarkerAlt /> {tour.location}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition">{tour.title}</h3>
                      <div className="flex flex-col items-end">
                        <span className="font-black text-blue-600 text-lg">{tour.price}</span>
                        <span className="text-[10px] text-slate-400">per person</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                      <span>{tour.duration}</span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold"><FaStar /> {tour.rating}</span>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200"></div> {/* Placeholder for Agency Logo */}
                        <span className="text-xs font-bold text-slate-700">{tour.agency}</span>
                      </div>
                      
                      <div className="flex gap-2">
                         <Link to={`/tour/${tour.id}`} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition">
                           Details
                         </Link>
                         <button className="bg-green-100 hover:bg-green-200 text-green-700 font-bold px-3 py-2 rounded-xl text-sm transition">
                           <FaWhatsapp className="text-lg" />
                         </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination / Load More */}
            <div className="mt-12 text-center">
              <button className="bg-white border border-slate-200 text-slate-600 font-bold py-3 px-8 rounded-full hover:bg-slate-50 transition">
                Load More Trips
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Search;