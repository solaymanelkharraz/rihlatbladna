import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, FaMapMarkerAlt, FaCalendarAlt, 
  FaFire, FaHiking, FaUmbrellaBeach, FaMosque, 
  FaRoute, FaMoneyBillWave, FaCameraRetro, FaStar, FaArrowRight,
  FaBriefcase, FaBuilding
} from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
// --- MOCK DATA ---
const CATEGORIES = [
  { id: 1, name: "Sahara Adventure", icon: <FaHiking />, img: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2070" },
  { id: 2, name: "Coastal Relax", icon: <FaUmbrellaBeach />, img: "https://images.unsplash.com/photo-1580608204899-27829db763a8?q=80&w=2070" },
  { id: 3, name: "Imperial History", icon: <FaMosque />, img: "https://plus.unsplash.com/premium_photo-1661962360706-538096f9c948?q=80&w=2070" },
  { id: 4, name: "Atlas Trekking", icon: <FaRoute />, img: "https://images.unsplash.com/photo-1535068484670-af9d0eb6a7c3?q=80&w=2062" },
];

const FEED_POSTS = [
  { id: 1, user: "Sarah M.", avatar: "https://i.pravatar.cc/150?u=1", text: "Chefchaouen is purely magical! 💙", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071", likes: 124 },
  { id: 2, user: "Amine K.", avatar: "https://i.pravatar.cc/150?u=2", text: "Best Tagine I've ever had!", image: "https://images.unsplash.com/photo-1541753236788-b0ac1fc5009d?q=80&w=1000", likes: 89 },
  { id: 3, user: "Travel Squad", avatar: "https://i.pravatar.cc/150?u=3", text: "Camel trekking at sunset. 🐫", image: "https://images.unsplash.com/photo-1590074258933-d9d8858d4a67?q=80&w=1000", likes: 256 },
];

const Home = () => {
  const [activeSearchTab, setActiveSearchTab] = useState('tours');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  
  // State for Tour Search
  const [tourDestination, setTourDestination] = useState('');
  const [tourDate, setTourDate] = useState('');
  const [tourBudget, setTourBudget] = useState('Any');

  // State for Agency Search
  const [agencyName, setAgencyName] = useState('');
  const [agencyCity, setAgencyCity] = useState('All');
  const [agencyService, setAgencyService] = useState('All');
  
  const backgrounds = [
    "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2070",
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071",
    "https://plus.unsplash.com/premium_photo-1661962360706-538096f9c948?q=80&w=2070"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  return (
    <div className="font-sans text-slate-800 bg-slate-50 min-h-screen flex flex-col">
      <Navbar />

      {/* ==================== 1. HERO SECTION ==================== */}
      <div className="relative w-full flex flex-col items-center justify-center pt-32 pb-48 lg:pt-48 lg:pb-64 overflow-hidden">
        
        {/* Animated Backgrounds */}
        {backgrounds.map((bg, index) => (
          <div 
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out ${
              index === currentBgIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url('${bg}')` }} 
          />
        ))}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-slate-50/10"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-100 text-sm font-semibold tracking-wide">Live the Moroccan Dream</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight drop-shadow-2xl">
            Uncover The <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
              Hidden Magic
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-slate-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Connect directly with local agencies, skip the tourist traps, and travel authentically.
          </p>
        </div>
      </div>

      {/* ==================== 2. DYNAMIC SEARCH WIDGET ==================== */}
      <div className="relative z-30 -mt-32 px-4 w-full flex justify-center">
        <div className="w-full max-w-6xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgb(0,0,0,0.1)] overflow-hidden border border-white/50">
          
          {/* Tabs */}
          <div className="flex bg-slate-50/80 border-b border-slate-200/60">
            <button 
              onClick={() => setActiveSearchTab('tours')}
              className={`flex-1 py-6 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                activeSearchTab === 'tours' 
                ? 'bg-white text-blue-600 shadow-sm border-t-4 border-blue-600' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
              }`}
            >
              <FaRoute className="inline mb-1 mr-2" /> Find Tours
            </button>
            <button 
              onClick={() => setActiveSearchTab('agencies')}
              className={`flex-1 py-6 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                activeSearchTab === 'agencies' 
                ? 'bg-white text-purple-600 shadow-sm border-t-4 border-purple-600' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
              }`}
            >
              <FaBuilding className="inline mb-1 mr-2" /> Find Agencies
            </button>
          </div>

          {/* Search Inputs Container */}
          <div className="p-6 md:p-8 min-h-[140px] flex items-center bg-white/50">
            
            {/* --- FORM 1: FIND TOURS --- */}
            {activeSearchTab === 'tours' ? (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log("Searching Tours:", { tourDestination, tourDate, tourBudget });
                  // TODO: Navigate or filter state later
                }}
                className="flex flex-col lg:flex-row gap-4 items-center w-full animate-fade-in-up"
              >
                {/* Destination */}
                <div className="flex-1 w-full bg-white rounded-2xl px-4 py-3.5 border border-slate-100 shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-focus-within:bg-blue-600 group-focus-within:text-white transition-colors duration-300">
                      <FaMapMarkerAlt />
                    </div>
                    <div className="flex flex-col w-full">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Where to?</label>
                      <input 
                        type="text" 
                        value={tourDestination}
                        onChange={(e) => setTourDestination(e.target.value)}
                        placeholder="Chefchaouen, Atlas..." 
                        className="bg-transparent outline-none font-bold text-slate-700 w-full placeholder-slate-300" 
                      />
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="flex-1 w-full bg-white rounded-2xl px-4 py-3.5 border border-slate-100 shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-focus-within:bg-blue-600 group-focus-within:text-white transition-colors duration-300">
                      <FaCalendarAlt />
                    </div>
                    <div className="flex flex-col w-full">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">When?</label>
                      <input 
                        type="date" 
                        value={tourDate}
                        onChange={(e) => setTourDate(e.target.value)}
                        className="bg-transparent outline-none font-bold text-slate-700 w-full text-sm cursor-pointer" 
                      />
                    </div>
                  </div>
                </div>

                {/* Budget */}
                <div className="flex-1 w-full bg-white rounded-2xl px-4 py-3.5 border border-slate-100 shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-focus-within:bg-blue-600 group-focus-within:text-white transition-colors duration-300">
                      <FaMoneyBillWave />
                    </div>
                    <div className="flex flex-col w-full">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Budget</label>
                      <select 
                        value={tourBudget}
                        onChange={(e) => setTourBudget(e.target.value)}
                        className="bg-transparent outline-none font-bold text-slate-700 w-full cursor-pointer appearance-none"
                      >
                        <option value="Any">Any Budget</option>
                        <option value="Economy">Economy</option>
                        <option value="Luxury">Luxury</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4.5 px-10 rounded-2xl shadow-[0_8px_30px_rgb(37,99,235,0.2)] hover:shadow-[0_8px_30px_rgb(37,99,235,0.3)] transform active:scale-95 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2">
                  <FaSearch /> <span>Search Tours</span>
                </button>
              </form>
            ) : (
              /* --- FORM 2: FIND AGENCIES --- */
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log("Searching Agencies:", { agencyName, agencyCity, agencyService });
                  // TODO: Navigate or filter state later
                }}
                className="flex flex-col lg:flex-row gap-4 items-center w-full animate-fade-in-up"
              >
                {/* Agency Name */}
                <div className="flex-1 w-full bg-white rounded-2xl px-4 py-3.5 border border-slate-100 shadow-sm focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl group-focus-within:bg-purple-600 group-focus-within:text-white transition-colors duration-300">
                      <FaBuilding />
                    </div>
                    <div className="flex flex-col w-full">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Agency Name</label>
                      <input 
                        type="text" 
                        value={agencyName}
                        onChange={(e) => setAgencyName(e.target.value)}
                        placeholder="e.g. Sahara Travels" 
                        className="bg-transparent outline-none font-bold text-slate-700 w-full placeholder-slate-300" 
                      />
                    </div>
                  </div>
                </div>

                {/* City */}
                <div className="flex-1 w-full bg-white rounded-2xl px-4 py-3.5 border border-slate-100 shadow-sm focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl group-focus-within:bg-purple-600 group-focus-within:text-white transition-colors duration-300">
                      <FaMapMarkerAlt />
                    </div>
                    <div className="flex flex-col w-full">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">City</label>
                      <select 
                        value={agencyCity}
                        onChange={(e) => setAgencyCity(e.target.value)}
                        className="bg-transparent outline-none font-bold text-slate-700 w-full cursor-pointer appearance-none"
                      >
                        <option value="All">All Cities</option>
                        <option value="Casablanca">Casablanca</option>
                        <option value="Marrakech">Marrakech</option>
                        <option value="Tangier">Tangier</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Service Type */}
                <div className="flex-1 w-full bg-white rounded-2xl px-4 py-3.5 border border-slate-100 shadow-sm focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl group-focus-within:bg-purple-600 group-focus-within:text-white transition-colors duration-300">
                      <FaBriefcase />
                    </div>
                    <div className="flex flex-col w-full">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Service</label>
                      <select 
                        value={agencyService}
                        onChange={(e) => setAgencyService(e.target.value)}
                        className="bg-transparent outline-none font-bold text-slate-700 w-full cursor-pointer appearance-none"
                      >
                        <option value="All">All Services</option>
                        <option value="Tours & Trips">Tours & Trips</option>
                        <option value="Car Rental">Car Rental</option>
                        <option value="Local Guides">Local Guides</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full lg:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-4.5 px-10 rounded-2xl shadow-[0_8px_30px_rgb(147,51,234,0.2)] hover:shadow-[0_8px_30px_rgb(147,51,234,0.3)] transform active:scale-95 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2">
                  <FaSearch /> <span>Find Agencies</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ==================== 3. CATEGORIES ==================== */}
      <div className="max-w-7xl mx-auto px-4 py-24 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Find Your Vibe</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Whether you want to hike the Atlas mountains or relax by the Atlantic coast, we have it all.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="group relative h-80 rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 flex flex-col justify-end p-6 text-white">
                <span className="text-3xl mb-3 text-amber-400 transform group-hover:-translate-y-2 transition-transform duration-300">{cat.icon}</span>
                <h3 className="font-bold text-xl">{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==================== 4. FLASH DEAL ==================== */}
      <div className="bg-slate-900 py-20 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500 rounded-full mix-blend-overlay filter blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-overlay filter blur-[120px] opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
              <FaFire className="inline mr-1" /> Limited Time Offer
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Sahara Luxury Camp</h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Experience the magic of Merzouga with a 3-day all-inclusive package. Camel trek, private tent, and traditional music under the stars.
            </p>
            
            <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
               <span className="text-4xl font-bold text-amber-400">1,200 DH</span>
               <span className="text-xl text-slate-500 line-through decoration-red-500 decoration-2">2,500 DH</span>
            </div>

            <button className="bg-white text-slate-900 hover:bg-amber-400 hover:text-white font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Book Now - Save 50%
            </button>
          </div>

          <div className="flex-1">
             <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 rotate-2 hover:rotate-0 transition-all duration-500">
                <img src="https://images.unsplash.com/photo-1542044896530-05d85be9b11a?q=80&w=1000" alt="Sahara" className="w-full object-cover" />
             </div>
          </div>
        </div>
      </div>

      {/* ==================== 5. COMMUNITY FEED ==================== */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Community</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-2">Travelers Right Now</h2>
          </div>
          <Link to="/community" className="hidden md:flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition">
            See all posts <FaArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEED_POSTS.map((post) => (
            <div key={post.id} className="bg-white rounded-[2rem] p-5 shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-4">
                <img src={post.avatar} alt={post.user} className="w-12 h-12 rounded-full border-2 border-slate-100" />
                <div>
                  <h4 className="font-bold text-slate-900">{post.user}</h4>
                  <div className="flex text-amber-400 text-xs"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
                </div>
              </div>
              
              <div className="relative h-56 rounded-2xl overflow-hidden mb-4 group">
                <img src={post.image} alt="Post" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                  <FaCameraRetro /> Verified Photo
                </div>
              </div>

              <p className="text-slate-600 font-medium mb-4 leading-relaxed">"{post.text}"</p>
              
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-slate-400 text-sm">
                 <span className="flex items-center gap-2"><FaFire className="text-red-500" /> {post.likes} Likes</span>
                 <button className="hover:text-blue-600 font-bold">Read More</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Spacer */}
      <div className="h-20 bg-slate-50">
        <Footer />
      </div>
    </div>
  );
};

export default Home;