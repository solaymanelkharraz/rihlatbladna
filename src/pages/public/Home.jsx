import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaCompass, 
  FaCommentDots, 
  FaPercentage, 
  FaHeart, 
  FaRegHeart, 
  FaCheckCircle, 
  FaClock, 
  FaStar,
  FaChevronRight,
  FaPaperPlane
} from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';

// --- LOCAL HERO IMAGES ---
const BACKGROUND_IMAGES = [
  "/Sahara Desert Adventure.jpg",
  "/Chefchaouen-tours.jpg",
  "/marrakech medina.jpg",
  "/el-attarine-medersa-in-fez.jpg"
];

const Home = () => {
  const navigate = useNavigate();
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const { user, tours, agencies, posts, toggleSaveTour, toggleFollowAgency, showAlert } = useAuth();

  const trips = (tours || [])
    .slice()
    .sort((a, b) => (b.isBoosted ? 1 : 0) - (a.isBoosted ? 1 : 0))
    .slice(0, 4);
  const topAgenciesSorted = useMemo(() => {
    const baseAgencies = (agencies || []).filter(u => u.role === 'agency');
    return baseAgencies.slice().sort((a, b) => (b.followersCount || 0) - (a.followersCount || 0));
  }, [agencies]);

  const agenciesList = topAgenciesSorted.slice(0, 6);
  const toursList = tours || [];
  
  // Search State
  const [destination, setDestination] = useState('');
  const [activity, setActivity] = useState('');

  // Premium Modal State
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: '', // 'save' | 'follow'
    primaryText: '',
    primaryLink: ''
  });

  // Story State: { agencyIndex: number, storyIndex: number } | null
  const [activeStoryIdx, setActiveStoryIdx] = useState(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isStoryPaused, setIsStoryPaused] = useState(false);



  const { displayAgencies, showFallbackLabel } = useMemo(() => {
    let result = [];
    let fallback = false;
    if (user && user.followingAgencies && user.followingAgencies.length > 0) {
      const followed = topAgenciesSorted.filter(a => user.followingAgencies.includes(a.id));
      if (followed.length > 0) {
        result = followed;
      } else {
        result = topAgenciesSorted.slice(0, 10);
        fallback = true;
      }
    } else {
      result = topAgenciesSorted.slice(0, 10);
      fallback = true;
    }
    return { displayAgencies: result, showFallbackLabel: fallback };
  }, [user, topAgenciesSorted]);

  // 2. Filter out agencies that have NO stories and sort unviewed first
  const [agenciesWithStories, setAgenciesWithStories] = useState([]);

  useEffect(() => {
    if (activeStoryIdx !== null) return;
    const viewed = JSON.parse(localStorage.getItem('viewedAgencies')) || [];
    const filtered = displayAgencies.filter(a => a.stories && a.stories.length > 0);
    const sorted = filtered.sort((a, b) => {
       const aViewed = viewed.includes(a.id);
       const bViewed = viewed.includes(b.id);
       if (aViewed && !bViewed) return 1;
       if (!aViewed && bViewed) return -1;
       return 0;
    });
    setAgenciesWithStories(sorted);
  }, [displayAgencies, activeStoryIdx]);

  const markAgencyViewed = (agencyId) => {
    const viewed = JSON.parse(localStorage.getItem('viewedAgencies')) || [];
    if (!viewed.includes(agencyId)) {
      const updated = [...viewed, agencyId];
      localStorage.setItem('viewedAgencies', JSON.stringify(updated));
    }
  };

  const handleNextStory = () => {
    setActiveStoryIdx(prev => {
      if (!prev) return null;
      const currentAgency = agenciesWithStories[prev.agencyIndex];
      if (prev.storyIndex < currentAgency.stories.length - 1) {
        setStoryProgress(0);
        return { ...prev, storyIndex: prev.storyIndex + 1 };
      } else if (prev.agencyIndex < agenciesWithStories.length - 1) {
        setStoryProgress(0);
        const nextAgency = agenciesWithStories[prev.agencyIndex + 1];
        markAgencyViewed(nextAgency.id);
        return { agencyIndex: prev.agencyIndex + 1, storyIndex: 0 };
      }
      return null;
    });
  };

  const handlePrevStory = () => {
    setActiveStoryIdx(prev => {
      if (!prev) return null;
      if (prev.storyIndex > 0) {
        setStoryProgress(0);
        return { ...prev, storyIndex: prev.storyIndex - 1 };
      } else if (prev.agencyIndex > 0) {
        setStoryProgress(0);
        const prevAgency = agenciesWithStories[prev.agencyIndex - 1];
        markAgencyViewed(prevAgency.id);
        return { agencyIndex: prev.agencyIndex - 1, storyIndex: prevAgency.stories.length - 1 };
      }
      setStoryProgress(0);
      return prev;
    });
  };

  // 3. Effect for story timer
  useEffect(() => {
    let timer;
    if (activeStoryIdx !== null && !isStoryPaused) {
      timer = setInterval(() => {
        setStoryProgress((prev) => {
          if (prev >= 100) {
            handleNextStory();
            return 0;
          }
          return prev + 1;
        });
      }, 50); // 100 steps * 50ms = 5 seconds
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeStoryIdx, isStoryPaused, agenciesWithStories]);

  // Background carousel ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % BACKGROUND_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.append('dest', destination);
    if (activity) params.append('activity', activity);
    navigate(`/search?${params.toString()}`);
  };

  const handleSaveTrip = (tripId, tripTitle) => {
    if (!user) {
      setModal({
        isOpen: true,
        title: 'Save this adventure',
        description: 'Want to save this trip to your wishlist? Create a free account in 5 seconds and plan your dream Moroccan escape!',
        type: 'save',
        primaryText: 'Sign Up Free',
        primaryLink: '/register'
      });
      return;
    }
    if (user.role !== 'traveler') {
      showAlert("Access Denied", "Only travelers can save trips.", "error");
      return;
    }
    toggleSaveTour(tripId);
  };

  const handleFollowAgency = (agencyId, agencyName) => {
    if (!user) {
      setModal({
        isOpen: true,
        title: 'Follow this agency',
        description: `Follow ${agencyName} to see their latest travel stories, updates, and custom routes in your feed. Log in to continue.`,
        type: 'follow',
        primaryText: 'Log In',
        primaryLink: '/login'
      });
      return;
    }
    if (user.role !== 'traveler') {
      showAlert("Access Denied", "Only travelers can follow agencies.", "error");
      return;
    }
    toggleFollowAgency(agencyId);
  };

  return (
    <div className="font-sans text-slate-800 bg-slate-50/50 min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />

      {/* ==================== 1. HERO SECTION (THE HOOK) ==================== */}
      <section className="relative w-full min-h-[95vh] lg:min-h-screen py-24 md:py-32 flex items-center justify-center overflow-hidden">
        {/* Animated Background Carousel */}
        {BACKGROUND_IMAGES.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out transform ${
              index === currentBgIndex 
                ? 'opacity-100 scale-100 pointer-events-auto' 
                : 'opacity-0 scale-105 pointer-events-none'
            }`}
            style={{ backgroundImage: `url('${img}')` }}
          />
        ))}

        {/* Premium Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-slate-900/10"></div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center mt-12 md:mt-16">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4.5 py-1.5 mb-6 md:mb-8 animate-fade-in">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-amber-100 text-xs md:text-sm font-extrabold tracking-wider uppercase">Value-First Travel</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white leading-tight mb-8 max-w-5xl tracking-tight drop-shadow-2xl">
            Discover the Real Morocco. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200">
              Connect directly
            </span> with local guides.
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-slate-200 mb-12 max-w-3xl font-medium leading-relaxed drop-shadow-md">
            Skip the broker commissions. Browse verified tours and start a direct in-app chat with the experts on the ground.
          </p>

          {/* Floating Search Bar (Glassmorphic) */}
          <div className="w-full max-w-5xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-[2rem] p-5 mt-4">
            <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-4 w-full">
              {/* Destination Input */}
              <div className="flex-2 w-full bg-white/95 rounded-2xl px-6 py-5 border border-slate-100 shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all flex items-center gap-3 group">
                <FaMapMarkerAlt className="text-blue-500 text-xl group-focus-within:text-blue-600 transition-colors" />
                <div className="flex flex-col items-start w-full">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Destination</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Sahara Desert, Chefchaouen..."
                    className="bg-transparent outline-none font-bold text-slate-800 w-full placeholder-slate-400 text-sm md:text-base border-none p-0 focus:ring-0"
                  />
                </div>
              </div>

              {/* Activity Input */}
              <div className="flex-2 w-full bg-white/95 rounded-2xl px-6 py-5 border border-slate-100 shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all flex items-center gap-3 group">
                <FaCompass className="text-orange-500 text-xl group-focus-within:text-orange-600 transition-colors" />
                <div className="flex flex-col items-start w-full">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Activity</label>
                  <input
                    type="text"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    placeholder="e.g. Camel ride, Hiking, Surfing..."
                    className="bg-transparent outline-none font-bold text-slate-800 w-full placeholder-slate-400 text-sm md:text-base border-none p-0 focus:ring-0"
                  />
                </div>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold py-5 px-10 rounded-2xl shadow-[0_10px_25px_rgba(37,99,235,0.35)] transform active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group shrink-0 cursor-pointer text-lg"
              >
                <FaSearch className="text-base group-hover:scale-110 transition-transform" />
                <span>Search Trips</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ==================== ACTIVE TRAVEL EXPERTS LIVE STORIES MARQUEE ==================== */}
      <section className="bg-slate-900 py-8 border-y border-slate-800 overflow-hidden relative select-none">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee-scroll {
            display: flex;
            width: max-content;
            animation: marquee 30s linear infinite;
          }
          .animate-marquee-scroll:hover {
            animation-play-state: paused;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        
        <div className="max-w-7xl mx-auto px-6 mb-4 flex justify-between items-center">
          <h4 className="text-xs font-black uppercase tracking-widest text-amber-400">{showFallbackLabel ? 'Suggested For You' : 'Agencies You Follow'}</h4>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider hidden sm:inline-block">Hover to pause • Click avatar to view story</span>
        </div>

        {/* Marquee Wrapper */}
        <div className="relative w-full overflow-hidden py-2">
          {/* Fading left & right gradients */}
          <div className="absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none"></div>

          <div className="animate-marquee-scroll flex gap-8">
            {/* Render stories array twice for seamless looping */}
            {[...agenciesWithStories, ...agenciesWithStories].map((agency, index) => (
              <div 
                key={`${agency.id}-${index}`} 
                onClick={() => {
                   const realIndex = index % agenciesWithStories.length;
                   markAgencyViewed(agenciesWithStories[realIndex].id);
                   setActiveStoryIdx({ agencyIndex: realIndex, storyIndex: 0 });
                   setStoryProgress(0);
                }}
                className="flex flex-col items-center gap-2 cursor-pointer shrink-0 group transition-transform duration-300 hover:scale-105"
              >
                <div className={`relative w-18 h-18 rounded-full p-[2px] shadow-lg ${(JSON.parse(localStorage.getItem('viewedAgencies')) || []).includes(agency.id) ? 'bg-slate-300 dark:bg-slate-700' : 'bg-gradient-to-tr from-amber-500 to-blue-600 group-hover:shadow-amber-500/20'}`}>
                  <img 
                    src={agency.avatar || '/MorP.jpg'} 
                    alt={agency.name} 
                    className="w-full h-full rounded-full object-cover border-2 border-slate-900 bg-slate-900" 
                  />
                  <span className="absolute bottom-0.5 right-0.5 w-4.5 h-4.5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[8px] font-black text-white">LIVE</span>
                </div>
                <span className="text-[11px] font-extrabold text-slate-400 tracking-wide max-w-[90px] truncate text-center group-hover:text-amber-300 transition-colors">
                  {agency.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 2. HOW IT WORKS (TRUST BUILDING) ==================== */}
      <section className="relative z-20 py-20 bg-[#FAF9F5] border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 font-serif tracking-tight">
              Why <span className="text-amber-500 italic font-serif">connect</span> with RihlatBladna?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 lg:gap-16">
            {/* Column 1 */}
            <div className="flex flex-col items-start text-left">
              <h3 className="text-sm font-bold text-slate-800 tracking-tight pb-1.5 border-b border-amber-500/40 w-fit mb-4">
                Local experts in your destination
              </h3>
              <p className="text-amber-600 font-bold text-lg leading-snug mb-3">
                100% verified Moroccan guides
              </p>
              <p className="text-slate-650 text-sm leading-relaxed">
                Browse unique desert campings and coastal getaways curated directly by experts on the ground.
              </p>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col items-start text-left">
              <h3 className="text-sm font-bold text-slate-800 tracking-tight pb-1.5 border-b border-amber-500/40 w-fit mb-4">
                Memorable experiences
              </h3>
              <p className="text-amber-600 font-bold text-lg leading-snug mb-3">
                Direct in-app chat & negotiation
              </p>
              <p className="text-slate-650 text-sm leading-relaxed">
                Message local guides directly via our secure chat to customize your itinerary and agree on fair pricing.
              </p>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col items-start text-left">
              <h3 className="text-sm font-bold text-slate-800 tracking-tight pb-1.5 border-b border-amber-500/40 w-fit mb-4">
                Local, responsible exploration
              </h3>
              <p className="text-amber-600 font-bold text-lg leading-snug mb-3">
                100% of your payment benefits locals
              </p>
              <p className="text-slate-650 text-sm leading-relaxed">
                With 0% platform commission, your travel money goes directly into the pockets of the local Moroccan community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SOCIAL PROOF NUMBERS BANNER ==================== */}
      <section className="relative z-10 -mt-10 max-w-7xl mx-auto px-6 mb-16">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-[2.5rem] p-10 md:p-14 shadow-2xl border border-slate-700/30 flex flex-col md:flex-row justify-between items-center gap-10 md:gap-6 relative overflow-hidden">
          {/* Decorative glowing background drops */}
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="text-center md:text-left md:max-w-md shrink-0">
            <span className="text-amber-400 font-extrabold tracking-widest uppercase text-xs">Empowering Local Communities</span>
            <h3 className="text-2xl md:text-3xl font-black text-white mt-2 leading-tight">Morocco's Leading Direct Travel Network</h3>
          </div>

          <div className="w-full md:w-auto grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 lg:gap-16 flex-1 justify-items-center">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">50+</div>
              <p className="text-slate-350 text-xs font-bold uppercase tracking-wider">Verified Local Agencies</p>
            </div>
            <div className="text-center border-y sm:border-y-0 sm:border-x border-slate-700/40 w-full sm:w-auto py-6 sm:py-0 sm:px-8 lg:px-12">
              <div className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">1,200+</div>
              <p className="text-slate-350 text-xs font-bold uppercase tracking-wider">In-App Connections</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">0%</div>
              <p className="text-slate-350 text-xs font-bold uppercase tracking-wider">Commission Ever</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. TRENDING TRIPS (THE BAIT) ==================== */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="text-orange-500 font-extrabold tracking-widest uppercase text-xs">Handpicked Experiences</span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-2">Trending Trips</h2>
              <p className="text-slate-500 mt-3 text-sm md:text-base leading-relaxed">
                Popular excursions recommended by fellow travelers.
              </p>
            </div>
            <Link 
              to="/search" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-extrabold text-sm transition-colors group self-start md:self-auto"
            >
              Browse All Experiences 
              <FaChevronRight className="text-xs group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trips.map((trip) => (
              <div 
                key={trip.id} 
                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-slate-200/60 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col"
              >
                {/* Trip Image */}
                <div 
                  onClick={() => navigate(`/tour/${trip.id}`)}
                  className="relative h-60 w-full overflow-hidden shrink-0 cursor-pointer"
                >
                  <img 
                    src={trip.image} 
                    alt={trip.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  {/* Boosted Sponsored Badge */}
                  {trip.isBoosted && (
                    <span className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[9px] font-black px-2.5 py-1.5 rounded-full uppercase tracking-wider shadow-md shadow-orange-500/20 z-10 flex items-center gap-1 animate-pulse">
                      ★ Sponsored
                    </span>
                  )}

                  {/* Badge */}
                  <span className={`absolute top-4 ${trip.isBoosted ? 'left-28 bg-slate-900/60' : 'left-4 bg-slate-900/80'} backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider`}>
                    {trip.tags?.[0] || "Desert"}
                  </span>

                  {/* Heart / Save Button */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleSaveTrip(trip.id, trip.title); }}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-600 hover:text-red-500 hover:scale-110 active:scale-95 shadow-md transition-all cursor-pointer border-none bg-transparent"
                    aria-label="Save trip"
                  >
                    {user && user.savedTours?.includes(trip.id) ? (
                      <FaHeart className="text-red-500 text-lg" />
                    ) : (
                      <FaRegHeart className="text-lg" />
                    )}
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Location & Rating */}
                    <div className="flex items-center justify-between gap-2 text-slate-400 text-xs font-bold mb-3">
                      <div className="flex items-center gap-1.5 truncate">
                        <FaMapMarkerAlt className="text-blue-500 shrink-0" />
                        <span className="truncate">{trip.location}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 text-amber-500">
                        <FaStar />
                        <span>{trip.rating}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => navigate(`/tour/${trip.id}`)}
                      className="font-extrabold text-slate-800 text-base mb-3 leading-snug group-hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      {trip.title}
                    </h3>
                  </div>

                  {/* Price, Duration & CTA */}
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold mb-1">
                        <FaClock className="text-[10px]" />
                        <span>{trip.duration}</span>
                      </div>
                      <span className="font-black text-slate-900 text-lg">{trip.price.toLocaleString()} DH</span>
                    </div>

                    <button 
                      onClick={() => navigate(`/tour/${trip.id}`)}
                      className="bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 4. TOP VERIFIED AGENCIES ==================== */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-extrabold tracking-widest uppercase text-xs">Local Experts</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-2">Top Verified Agencies</h2>
            <p className="text-slate-500 max-w-xl mx-auto mt-4 text-sm md:text-base leading-relaxed">
              Skip third-party booking agents and talk directly with agencies verified for service excellence and trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {agenciesList.map((agency) => {
              const followersText = agency.followersCount >= 1000 ? (agency.followersCount / 1000).toFixed(1) + 'K' : agency.followersCount;
              const toursCount = toursList.filter(t => String(t.agencyId) === String(agency.id)).length;
              const isFollowing = user && user.followingAgencies?.includes(agency.id);
              return (
                <div 
                  key={agency.id} 
                  className="group bg-slate-50 hover:bg-white border border-slate-100 hover:border-slate-200/60 rounded-3xl p-8 hover:shadow-2xl hover:shadow-slate-100 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Agency Header info */}
                    <div className="flex items-center gap-4 mb-6">
                      <div 
                        className="relative cursor-pointer"
                        onClick={() => navigate(`/agency/${agency.id}`)}
                      >
                        <img 
                          src={agency.avatar} 
                          alt={agency.name} 
                          className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-inner group-hover:scale-105 transition-transform" 
                        />
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-50"></span>
                      </div>
                      <div>
                        <div 
                          className="flex items-center gap-1.5 cursor-pointer group/title"
                          onClick={() => navigate(`/agency/${agency.id}`)}
                        >
                          <h3 className="font-extrabold text-slate-800 text-base leading-snug truncate max-w-[150px] group-hover/title:text-blue-600 transition-colors">
                            {agency.name}
                          </h3>
                          <FaCheckCircle className="text-blue-500 text-sm shrink-0" title="Verified Agency" />
                        </div>
                        <p className="text-slate-400 text-xs font-bold mt-1">
                          {followersText} followers &bull; {toursCount} trips
                        </p>
                      </div>
                    </div>

                    {/* Agency Bio */}
                    <p className="text-slate-500 text-sm leading-relaxed mb-8">
                      "{agency.bio || "Specialized in customized Moroccan adventures."}"
                    </p>
                  </div>

                  {/* Profile and Follow Buttons */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => navigate(`/agency/${agency.id}`)}
                      className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-2xl transition-all cursor-pointer text-center text-sm"
                    >
                      Profile
                    </button>
                    <button 
                      onClick={() => handleFollowAgency(agency.id, agency.name)}
                      className={`flex-1 font-bold py-3 px-4 rounded-2xl transition-all cursor-pointer text-center text-sm ${
                        isFollowing 
                          ? 'bg-slate-250 hover:bg-slate-300 text-slate-750' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_5px_15px_rgba(37,99,235,0.2)] transform active:scale-[0.98]'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== 5. LIVE CHAT EXPERIENCE MOCKUP ==================== */}
      <section className="py-24 bg-white border-t border-b border-slate-100 relative overflow-hidden">
        {/* Glow drops */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/5 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500/5 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <span className="text-blue-600 font-extrabold tracking-widest uppercase text-xs">Real-Time Customization</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Chat Directly With Your Local Expert
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              No middleman brokers. Connect securely with verified Moroccan agency owners on the ground to customize your schedule, agree on pricing, and ask local questions.
            </p>
            <ul className="space-y-4 pt-4 text-left max-w-md mx-auto lg:mx-0">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">✓</span>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">Tailor Your Itinerary</h4>
                  <p className="text-xs text-slate-500">Add desert quad biking, hot air ballooning, or local food stops.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">✓</span>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">Fair Local Pricing</h4>
                  <p className="text-xs text-slate-500">Negotiate rates directly to support local guides and save money.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Right Phone Mockup */}
          <div className="lg:col-span-7 flex justify-center">
            {/* Phone Outer Frame */}
            <div className="w-[340px] h-[550px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-4 border-slate-800 relative overflow-hidden flex flex-col justify-between shrink-0">
              {/* Phone Speaker Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20 flex items-center justify-center">
                <div className="w-12 h-1 bg-slate-800 rounded-full mb-1"></div>
              </div>
              
              {/* Screen Top Bar */}
              <div className="bg-slate-900 pt-5 px-6 pb-2 flex justify-between items-center text-white/50 text-[10px] font-extrabold z-10 shrink-0 select-none">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <span>5G</span>
                  <div className="w-4 h-2.5 border border-white/30 rounded-xs p-0.5 flex items-center"><div className="w-full h-full bg-white/70"></div></div>
                </div>
              </div>

              {/* Chat Window Screen */}
              <div className="flex-1 bg-slate-950 rounded-[2rem] overflow-hidden flex flex-col justify-between border border-slate-800">
                {/* Chat Partner Header */}
                <div className="bg-slate-900 p-4 border-b border-slate-850 flex items-center gap-3 shrink-0">
                  <div className="relative">
                    <img src="/Sahara Desert Adventure.jpg" alt="Local Guide" className="w-9 h-9 rounded-full object-cover border border-slate-700 bg-slate-800" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-slate-900 rounded-full"></span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[12px] text-white">Youssef (Sahara Experts)</h4>
                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-wider">Verified Agency Guide</span>
                  </div>
                </div>

                {/* Message Log */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3.5 flex flex-col justify-end text-[11px] font-medium leading-relaxed">
                  
                  {/* Message 1 */}
                  <div className="flex justify-start">
                    <div className="bg-slate-900 text-slate-300 max-w-[80%] p-3 rounded-2xl rounded-tl-none border border-slate-850 shadow-sm">
                      <p>Salam! Yes, I can customize the 3-day Merzouga desert tour to include sunset quad biking for you.</p>
                      <span className="block text-[8px] text-right mt-1.5 text-slate-500">9:42 AM</span>
                    </div>
                  </div>

                  {/* Message 2 */}
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white max-w-[80%] p-3 rounded-2xl rounded-tr-none shadow-md shadow-blue-500/10">
                      <p>Perfect! Can we also spend the second night in a traditional luxury Berber camp?</p>
                      <span className="block text-[8px] text-right mt-1.5 text-blue-200">9:43 AM</span>
                    </div>
                  </div>

                  {/* Message 3 */}
                  <div className="flex justify-start">
                    <div className="bg-slate-900 text-slate-300 max-w-[80%] p-3 rounded-2xl rounded-tl-none border border-slate-850 shadow-sm">
                      <p>Absolutely! I will update your itinerary and send the updated booking offer link right away. 🐫🌅</p>
                      <span className="block text-[8px] text-right mt-1.5 text-slate-500">9:44 AM</span>
                    </div>
                  </div>

                </div>

                {/* Chat Input Field */}
                <div className="p-3 border-t border-slate-850 flex gap-2 shrink-0 bg-slate-900 items-center">
                  <div className="flex-1 bg-slate-950 rounded-xl px-3 py-2 text-[11px] font-medium text-slate-400 border border-slate-800 select-none">
                    Write custom itinerary...
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs shadow-md">
                    <FaPaperPlane />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 6. COMMUNITY FEED SNIPPET GRID ==================== */}
      <section className="py-24 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-extrabold tracking-widest uppercase text-xs">Share Your Journey</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-2">Explore The Community</h2>
            <p className="text-slate-500 mt-3 text-sm md:text-base leading-relaxed">
              Real review captures uploaded by travelers on their recent adventures.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {((posts && posts.length > 0) ? posts.slice(0, 4) : [
              { id: '1', image: "/sahara-desert-maroc-marrocain-8.webp", likes: [], location: "Sahara Dunes", agencyName: "Atlas Nomads Travel" },
              { id: '2', image: "/morocco1.jpg", likes: [], location: "Chefchaouen Walk", agencyName: "BlueCity Guides" },
              { id: '3', image: "/Marrakesh.jpg", likes: [], location: "Marrakesh Souks", agencyName: "Marrakech Desert Star" },
              { id: '4', image: "/Fes.jpg", likes: [], location: "Imperial Fes Medersa", agencyName: "Fes Heritage Expeditions" }
            ]).map((post) => (
              <div 
                key={post.id} 
                onClick={() => navigate(`/community#post-${post.id}`)}
                className="group relative h-72 rounded-[2rem] overflow-hidden border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 cursor-pointer"
              >
                <img 
                  src={post.image || post.img || "/sahara-desert-maroc-marrocain-8.webp"} 
                  alt={post.location || post.tag || "Community Post"} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 z-10">
                  <span className="bg-white/20 backdrop-blur-md text-white font-extrabold text-[10px] px-3 py-1 rounded-full w-fit self-end border border-white/10 uppercase tracking-widest">
                    #{(post.location || post.tag || 'Morocco').split(',')[0].replace(/\s+/g, '')}
                  </span>
                  <div className="space-y-1 text-left">
                    <p className="text-white/80 text-xs font-bold truncate">By {post.agencyName || "Travel Guide"}</p>
                    <div className="flex items-center gap-2 text-white font-black text-sm">
                      <FaHeart className="text-red-500 animate-pulse text-lg" />
                      <span>{post.likes?.length || post.likes || 0} Likes</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <div className="mt-auto">
        <Footer />
      </div>

      {/* Premium Custom Interaction Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setModal({ ...modal, isOpen: false })}
          />
          
          {/* Modal Content Card */}
          <div className="relative bg-white border border-slate-100 rounded-[2rem] p-8 max-w-md w-full shadow-[0_30px_70px_rgba(0,0,0,0.18)] z-10 text-center transform transition-all duration-300 scale-100 flex flex-col items-center">
            {/* Close Button */}
            <button 
              onClick={() => setModal({ ...modal, isOpen: false })}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-full hover:bg-slate-50 cursor-pointer border-none bg-transparent"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Icon Header (Amber or Blue based on action type) */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-6 shadow-md ${
              modal.type === 'save' 
                ? 'bg-amber-50 text-amber-600 shadow-amber-500/10' 
                : 'bg-blue-50 text-blue-600 shadow-blue-500/10'
            }`}>
              {modal.type === 'save' ? <FaHeart className="animate-pulse" /> : <FaCheckCircle />}
            </div>

            {/* Title */}
            <h3 className="font-extrabold text-2xl text-slate-900 mb-3 tracking-tight">
              {modal.title}
            </h3>

            {/* Description */}
            <p className="text-slate-500 text-sm leading-relaxed mb-8 px-2">
              {modal.description}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button 
                onClick={() => setModal({ ...modal, isOpen: false })}
                className="flex-1 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-600 font-bold py-3.5 px-6 rounded-2xl transition-all cursor-pointer text-sm order-2 sm:order-1 bg-white"
              >
                Maybe Later
              </button>
              <Link 
                to={modal.primaryLink}
                className={`flex-1 font-bold py-3.5 px-6 rounded-2xl text-center text-sm shadow-md hover:shadow-lg transition-all cursor-pointer text-white order-1 sm:order-2 flex items-center justify-center ${
                  modal.type === 'save'
                    ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                }`}
              >
                {modal.primaryText}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Immersive Story Viewer Modal */}
      {activeStoryIdx !== null && agenciesWithStories[activeStoryIdx.agencyIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md select-none">
          {/* Progress bars at the top */}
          <div className="absolute top-6 left-0 right-0 max-w-md mx-auto px-6 flex gap-1 z-50">
            {agenciesWithStories[activeStoryIdx.agencyIndex].stories.map((_, i) => (
              <div key={i} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ease-linear ${
                    i < activeStoryIdx.storyIndex 
                      ? 'bg-white w-full' 
                      : i === activeStoryIdx.storyIndex 
                        ? 'bg-white' 
                        : 'bg-transparent w-0'
                  }`}
                  style={{ width: i === activeStoryIdx.storyIndex ? `${storyProgress}%` : undefined }}
                />
              </div>
            ))}
          </div>

          {/* Close button */}
          <button 
            onClick={() => setActiveStoryIdx(null)}
            className="absolute top-8 right-6 text-white/70 hover:text-white text-3xl font-light z-50 focus:outline-none cursor-pointer p-2 border-none bg-transparent"
          >
            &times;
          </button>

          {/* Content Card */}
          <div 
            className="relative w-full max-w-md h-[85vh] md:h-[80vh] mx-auto flex flex-col justify-between items-center text-center overflow-hidden md:rounded-[2rem] bg-slate-900 border border-white/10"
            onPointerDown={() => setIsStoryPaused(true)}
            onPointerUp={() => setIsStoryPaused(false)}
            onPointerLeave={() => setIsStoryPaused(false)}
          >
            {/* Nav Zones */}
            <div 
              className="absolute top-20 bottom-24 left-0 w-1/3 z-30 cursor-pointer" 
              onClick={(e) => { e.stopPropagation(); handlePrevStory(); }}
            />
            <div 
              className="absolute top-20 bottom-24 right-0 w-1/3 z-30 cursor-pointer" 
              onClick={(e) => { e.stopPropagation(); handleNextStory(); }}
            />

            {/* Agency Header info */}
            <div 
              className="flex items-center gap-3 self-start text-left bg-gradient-to-b from-black/80 to-transparent p-6 absolute top-0 left-0 right-0 z-40 cursor-pointer"
              onClick={() => {
                setActiveStoryIdx(null);
                navigate(`/agency/${agenciesWithStories[activeStoryIdx.agencyIndex].id}`);
              }}
            >
              <img src={agenciesWithStories[activeStoryIdx.agencyIndex].avatar || '/MorP.jpg'} alt={agenciesWithStories[activeStoryIdx.agencyIndex].name} className="w-10 h-10 rounded-full object-cover border border-white/20" />
              <div>
                <h4 className="font-extrabold text-white text-sm">{agenciesWithStories[activeStoryIdx.agencyIndex].name}</h4>
                <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">
                  {Math.max(0, Math.floor((new Date() - new Date(agenciesWithStories[activeStoryIdx.agencyIndex].stories[activeStoryIdx.storyIndex].createdAt)) / (1000 * 60 * 60)))}h ago
                </span>
              </div>
            </div>

            {/* Main Story Image */}
            <div className="w-full h-full relative">
              <img 
                src={agenciesWithStories[activeStoryIdx.agencyIndex].stories[activeStoryIdx.storyIndex].imageUrl} 
                alt="Agency Active Story" 
                className="w-full h-full object-cover" 
              />
            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-6 left-0 right-0 px-6 flex gap-4 z-40">
              <button 
                onClick={() => {
                  setActiveStoryIdx(null);
                  navigate(`/agency/${agenciesWithStories[activeStoryIdx.agencyIndex].id}`);
                }}
                className="flex-1 bg-white hover:bg-slate-200 text-slate-900 font-extrabold py-3.5 px-6 rounded-2xl transition-all cursor-pointer text-sm shadow-lg border-none"
              >
                View Profile
              </button>
              <button 
                onClick={() => {
                  setActiveStoryIdx(null);
                  navigate(`/agency/messages`);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-6 rounded-2xl transition-all cursor-pointer text-sm shadow-lg shadow-blue-500/20 border-none"
              >
                Chat Direct
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;