import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaSlidersH, FaCalendarAlt, FaStar, FaHeart } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, toggleSaveTour, tours: rawTours, showAlert } = useAuth();
  const navigate = useNavigate();
  
  // Read params and initialize states
  const queryDest = searchParams.get('dest') || '';
  const queryBudget = searchParams.get('budget');
  const queryPrice = queryBudget === 'Economy' ? 800 : queryBudget === 'Luxury' ? 5000 : 3000;

  const [searchQuery, setSearchQuery] = useState(queryDest);
  const [priceRange, setPriceRange] = useState(queryPrice);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [sortBy, setSortBy] = useState('Recommended');

  // Synchronize state when query parameters shift during navigation
  const [prevParams, setPrevParams] = useState(searchParams.toString());
  if (searchParams.toString() !== prevParams) {
    setSearchQuery(queryDest);
    setPriceRange(queryPrice);
    setPrevParams(searchParams.toString());
  }

  const tours = rawTours || []; // Loaded directly from context during render

  const categories = ["All", "Adventure", "Culture", "Relaxation", "Family", "Hiking"];
  const citiesList = ['Marrakech', 'Tangier', 'Merzouga', 'Chefchaouen', 'Agadir'];
  const durationsList = ['Day Trips', '2-3 Days', '4-7 Days', '1 Week+'];

  const handleCityToggle = (city) => {
    setSelectedCities(prev => 
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    );
  };

  const handleDurationToggle = (dur) => {
    setSelectedDurations(prev => 
      prev.includes(dur) ? prev.filter(d => d !== dur) : [...prev, dur]
    );
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setPriceRange(3000);
    setActiveCategory('All');
    setSelectedCities([]);
    setSelectedDurations([]);
    setSortBy('Recommended');
    setSearchParams({});
  };

  // Filter logic
  const filteredTours = tours
    .filter(tour => {
      // 1. Text Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesText = 
          tour.title.toLowerCase().includes(q) || 
          tour.location.toLowerCase().includes(q) ||
          tour.agencyName.toLowerCase().includes(q);
        if (!matchesText) return false;
      }

      // 2. Max Price
      if (tour.price > priceRange) return false;

      // 3. Category Tag
      if (activeCategory !== 'All' && !tour.tags.includes(activeCategory)) return false;

      // 4. Cities Checkboxes
      if (selectedCities.length > 0 && !selectedCities.includes(tour.location)) return false;

      // 5. Durations Checkboxes
      if (selectedDurations.length > 0) {
        const matchesDuration = selectedDurations.some(dur => {
          if (dur === 'Day Trips') return tour.duration.includes('1 Day') || tour.duration.includes('Hour');
          if (dur === '2-3 Days') return tour.duration.includes('2 Day') || tour.duration.includes('3 Day');
          if (dur === '4-7 Days') return tour.duration.includes('4 Day') || tour.duration.includes('5 Day') || tour.duration.includes('6 Day') || tour.duration.includes('7 Day');
          if (dur === '1 Week+') return tour.duration.includes('Week') || tour.duration.includes('10 Day');
          return false;
        });
        if (!matchesDuration) return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Prioritize boosted tours
      if (a.isBoosted && !b.isBoosted) return -1;
      if (!a.isBoosted && b.isBoosted) return 1;

      if (sortBy === 'Lowest Price') return a.price - b.price;
      if (sortBy === 'Highest Price') return b.price - a.price;
      if (sortBy === 'Top Rated') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 selection:bg-blue-500 selection:text-white pb-24">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-32">
        
        {/* Header & Quick Categories */}
        <div className="mb-10 animate-fade-in-up">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">Explore Morocco</h1>
              <p className="text-slate-500 text-lg">{filteredTours.length} extraordinary trips waiting for you.</p>
            </div>
            
            {/* Search Input bar on top */}
            <div className="relative w-full md:w-96 group focus-within:shadow-sm transition-shadow rounded-2xl">
              <FaSearch className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations, tags..." 
                className="w-full pl-12 px-4 py-3 bg-white rounded-2xl outline-none text-sm font-bold border border-slate-100 focus:border-blue-500 transition-all text-slate-700 shadow-sm" 
              />
            </div>
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
                <button 
                  onClick={resetAllFilters}
                  className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors"
                >
                  Reset All
                </button>
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
                  onChange={(e) => setPriceRange(Number(e.target.value))}
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
                  {citiesList.map((city) => (
                    <label key={city} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            checked={selectedCities.includes(city)}
                            onChange={() => handleCityToggle(city)}
                            className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded text-blue-600 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" 
                          />
                          <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{city}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration Filter */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <FaCalendarAlt className="text-slate-400" /> Duration
                </label>
                <div className="space-y-3">
                  {durationsList.map((dur) => (
                    <label key={dur} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          checked={selectedDurations.includes(dur)}
                          onChange={() => handleDurationToggle(dur)}
                          className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded text-blue-600 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" 
                        />
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
              <p className="text-slate-500 font-medium">Showing <span className="font-bold text-slate-800">1-{filteredTours.length}</span> of {filteredTours.length} results</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-500 hidden sm:block">Sort by:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-800 text-sm font-bold rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-sm"
                >
                  <option>Recommended</option>
                  <option>Lowest Price</option>
                  <option>Highest Price</option>
                  <option>Top Rated</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {filteredTours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredTours.map((tour) => {
                  const isSaved = user && user.role === 'traveler' && user.savedTours.includes(tour.id);
                  return (
                    <div key={tour.id} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 flex flex-col">
                      
                      {/* Image Section */}
                      <div className="relative h-64 overflow-hidden bg-slate-100">
                        {tour.isBoosted && (
                          <div className="absolute top-5 left-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[9px] font-black px-2.5 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-orange-500/35 z-10 flex items-center gap-1 animate-pulse">
                            ★ Sponsored
                          </div>
                        )}
                        <img 
                          src={tour.image || "/Sahara Desert Adventure.jpg"} 
                          alt={tour.title} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                        
                        {/* Floating Wishlist Heart */}
                        {(!user || user.role === 'traveler') && (
                          <button 
                            onClick={() => {
                              if (!user) {
                                showAlert("Authentication Required", "Please log in as a Traveler to save trips!", "info");
                                navigate('/login');
                              } else {
                                toggleSaveTour(tour.id);
                              }
                            }}
                            className="absolute top-5 right-5 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:scale-110 shadow-lg transition-all duration-300 z-10 border-none cursor-pointer"
                          >
                            <FaHeart className={isSaved ? "text-red-500" : "text-slate-400"} />
                          </button>
                        )}
                        
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
                              <span className="font-bold text-slate-500 text-sm">DH</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                               <img src={tour.agencyAvatar || "/MorP.jpg"} alt="Agency" className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                               <span className="text-xs text-slate-400 font-bold">{tour.agencyName}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl p-8">
                <p className="text-slate-500 text-lg font-bold mb-2">No experiences match your criteria.</p>
                <p className="text-slate-400 text-sm mb-6">Try resetting filters or adjusting search queries.</p>
                <button 
                  onClick={resetAllFilters} 
                  className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default Search;