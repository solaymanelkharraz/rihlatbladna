import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaMapMarkerAlt, 
  FaStar, 
  FaCommentDots, 
  FaHeart, 
  FaRegHeart, 
  FaClock, 
  FaCheckCircle, 
  FaRegComments,
  FaShareAlt,
  FaCalendarAlt
} from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';

const AgencyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleFollowAgency, addInquiry, showAlert, agencies, tours, posts, toggleLikePost } = useAuth();
  
  const agency = (agencies || []).find((a) => String(a.id) === String(id));
  
  const [activeTab, setActiveTab] = useState('offers'); // 'offers' | 'posts'
  const [wishlist, setWishlist] = useState({});
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: '', // 'save' | 'follow'
    primaryText: '',
    primaryLink: ''
  });

  if (!agency) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-3xl font-black text-slate-800 mb-4">Agency Profile Not Found</h2>
          <p className="text-slate-500 mb-8 max-w-sm">The travel agency you are looking for might have moved or does not exist.</p>
          <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-8 rounded-2xl shadow-md transition-all">
            Return to Homepage
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Filter content from database
  const agencyOffers = (tours || []).filter(offer => String(offer.agencyId) === String(agency.id));
  const agencyPosts = (posts || []).filter(post => String(post.agencyId) === String(agency.id));

  const isFollowing = user && user.role === 'traveler' && user.followingAgencies?.includes(agency.id);

  const handleSaveTrip = (tripId) => {
    setWishlist((prev) => ({
      ...prev,
      [tripId]: !prev[tripId]
    }));
    setModal({
      isOpen: true,
      title: 'Save this adventure',
      description: 'Want to save this trip to your wishlist? Create a free account in 5 seconds and plan your dream Moroccan escape!',
      type: 'save',
      primaryText: 'Sign Up Free',
      primaryLink: '/register'
    });
  };

  const handleFollowAgencyClick = () => {
    if (!user) {
      setModal({
        isOpen: true,
        title: 'Follow this agency',
        description: `Follow ${agency.name} to see their latest travel stories, updates, and custom routes in your feed. Log in to continue.`,
        type: 'follow',
        primaryText: 'Log In',
        primaryLink: '/login'
      });
      return;
    }
    if (user.role !== 'traveler') {
      showAlert("Access Denied", "Only traveler accounts can follow agencies.", "error");
      return;
    }
    toggleFollowAgency(agency.id);
  };

  const handleInAppChat = () => {
    if (!user) {
      setModal({
        isOpen: true,
        title: 'Start a Chat',
        description: `Create an account or log in to start a direct in-app messaging thread with ${agency.name}!`,
        type: 'follow',
        primaryText: 'Log In',
        primaryLink: '/login'
      });
      return;
    }
    if (user.role !== 'traveler') {
      showAlert("Access Denied", "Only travelers can message agencies.", "error");
      return;
    }
    const threadId = addInquiry("general", "General Chat", agency.id, agency.name);
    showAlert("Opening Chat", `Opening direct chat with ${agency.name}... 💬`, "success");
    navigate(`/traveler/profile?thread=${threadId}`);
  };

  return (
    <div className="font-sans text-slate-800 bg-slate-50/50 min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />

      {/* ==================== 1. COVER & HEADER ==================== */}
      <section className="relative w-full h-[30vh] md:h-[40vh] bg-slate-200 overflow-hidden pt-20">
        <img 
          src={agency.cover} 
          alt={`${agency.name} Cover`} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-black/10 to-transparent"></div>
      </section>

      {/* ==================== 2. PROFILE DETAILS SECTION ==================== */}
      <section className="relative bg-white border-b border-slate-100 z-10 px-6 md:px-12 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Info Block */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 md:-mt-20 mb-8">
            
            {/* Avatar & Core Metadata */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <img 
                src={agency.avatar} 
                alt={agency.name} 
                className="w-28 h-28 md:w-36 md:h-36 rounded-[2rem] object-cover border-4 border-white shadow-xl bg-white relative z-20 shrink-0" 
              />
              <div className="mb-2">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">
                    {agency.name}
                  </h1>
                  <FaCheckCircle className="text-blue-500 text-lg md:text-xl shrink-0" title="Verified Agency" />
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs md:text-sm font-bold text-slate-400">
                  <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-blue-500 text-xs" /> {agency.location}, Morocco</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                  <span>{agency.followers} followers</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                  <span className="flex items-center gap-1 text-amber-500"><FaStar className="text-xs mb-0.5" /> {agency.rating}</span>
                </div>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex gap-3 w-full sm:w-auto shrink-0 mb-2">
              <button 
                onClick={handleFollowAgencyClick}
                className={`flex-1 sm:flex-initial font-extrabold py-3.5 px-6 rounded-2xl transition-all cursor-pointer text-sm ${
                  isFollowing 
                    ? 'bg-slate-200 hover:bg-slate-350 text-slate-700' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button 
                onClick={handleInAppChat}
                className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-[0_5px_15px_rgba(16,185,129,0.25)] hover:shadow-[0_8px_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer text-sm flex items-center justify-center gap-2 border-none"
              >
                <FaCommentDots className="text-lg animate-pulse" />
                <span>In-App Chat</span>
              </button>
            </div>

          </div>

          {/* Description Bio */}
          <div className="max-w-3xl border-t border-slate-50 pt-6">
            <h3 className="text-slate-400 font-extrabold text-[10px] uppercase tracking-widest mb-2">About the Agency</h3>
            <p className="text-slate-650 text-sm md:text-base leading-relaxed">
              {agency.bio}
            </p>
          </div>
        </div>
      </section>

      {/* ==================== 3. TABS NAVIGATION ==================== */}
      <section className="bg-white border-b border-slate-150 sticky top-24 z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex space-x-8">
          <button 
            onClick={() => setActiveTab('offers')}
            className={`py-5 text-sm font-extrabold border-b-3 transition-all relative cursor-pointer ${
              activeTab === 'offers' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-400 hover:text-slate-650'
            }`}
          >
            Active Offers
            {agencyOffers.length > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'offers' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
              }`}>
                {agencyOffers.length}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setActiveTab('posts')}
            className={`py-5 text-sm font-extrabold border-b-3 transition-all relative cursor-pointer ${
              activeTab === 'posts' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-400 hover:text-slate-650'
            }`}
          >
            Updates & Stories
            {agencyPosts.length > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'posts' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
              }`}>
                {agencyPosts.length}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* ==================== 4. TAB CONTENTS ==================== */}
      <main className="flex-grow py-12 px-6 md:px-12 max-w-7xl mx-auto w-full">
        {/* --- OFFERS TAB --- */}
        {activeTab === 'offers' && (
          <div>
            {agencyOffers.length === 0 ? (
              <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl p-8">
                <p className="text-slate-400 text-sm font-bold">No active offers listed by this agency at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {agencyOffers.map((trip) => (
                  <div 
                    key={trip.id} 
                    className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-slate-200/60 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col"
                  >
                    {/* Trip Image */}
                    <div className="relative h-60 w-full overflow-hidden shrink-0">
                      <Link to={`/tour/${trip.id}`} className="block w-full h-full">
                        <img 
                          src={trip.image} 
                          alt={trip.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </Link>
                      {/* Badge */}
                      <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider pointer-events-none">
                        {trip.tags?.[0] || 'Adventure'}
                      </span>

                      {/* Heart / Save Button */}
                      <button 
                        onClick={() => handleSaveTrip(trip.id)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-600 hover:text-red-500 hover:scale-110 active:scale-95 shadow-md transition-all cursor-pointer border-none"
                        aria-label="Save trip"
                      >
                        {wishlist[trip.id] ? (
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
                        <Link to={`/tour/${trip.id}`} className="block hover:text-blue-600 transition-colors no-underline">
                          <h3 className="font-extrabold text-slate-800 text-base mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                            {trip.title}
                          </h3>
                        </Link>
                      </div>

                      {/* Price, Duration & CTA */}
                      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold mb-1">
                            <FaClock className="text-[10px]" />
                            <span>{trip.duration}</span>
                          </div>
                          <span className="font-black text-slate-900 text-base">{trip.price} DH</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Link 
                            to={`/tour/${trip.id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1 no-underline"
                          >
                            <FaCheckCircle className="text-xs" /> Book
                          </Link>
                          <button 
                            onClick={async () => {
                              if (!user) {
                                showAlert("Login Required", "Please log in to chat!", "info");
                                navigate('/login');
                                return;
                              }
                              if (user.role !== 'traveler') {
                                showAlert("Access Denied", "Only travelers can chat.", "error");
                                return;
                              }
                              const threadId = await addInquiry(trip.id, trip.title, trip.agencyId, trip.agencyName, user?.phone || '+212 600 000 000', 1);
                              if (threadId) {
                                navigate(`/traveler/profile?thread=${threadId}`);
                              }
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs px-3 py-2.5 rounded-xl transition-all flex items-center gap-1 border-none cursor-pointer"
                          >
                            <FaCommentDots className="text-xs text-blue-600" /> Chat
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- POSTS TAB --- */}
        {activeTab === 'posts' && (
          <div className="max-w-2xl mx-auto flex flex-col gap-8">
            {agencyPosts.length === 0 ? (
              <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl p-8">
                <p className="text-slate-400 text-sm font-bold">No updates posted by this agency yet.</p>
              </div>
            ) : (
              agencyPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col"
                >
                  {/* Post Author Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={agency.avatar} 
                      alt={agency.name} 
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-inner" 
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="font-extrabold text-slate-800 text-sm">{agency.name}</h4>
                        <FaCheckCircle className="text-blue-500 text-xs" />
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold mt-0.5">
                        <FaCalendarAlt />
                        <span>{post.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-slate-650 text-sm md:text-base leading-relaxed mb-4">
                    {post.content}
                  </p>

                  {/* Post Image */}
                  {post.image && (
                    <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-4 bg-slate-100 shrink-0">
                      <img 
                        src={post.image} 
                        alt="Post Attachment" 
                        className="w-full h-full object-cover hover:scale-101 transition-transform duration-500" 
                      />
                    </div>
                  )}

                  {/* Actions (Likes, comments) */}
                  <div className="flex items-center gap-6 pt-4 border-t border-slate-50 text-slate-400 text-xs font-bold mt-2">
                    <button 
                      onClick={() => { if (!user) { showAlert("Login Required", "Please log in to like posts!", "info"); navigate('/login'); } else { toggleLikePost(post.id); } }}
                      className="hover:text-blue-600 transition-colors flex items-center gap-1.5 bg-transparent border-none cursor-pointer"
                    >
                      <span>👍 {Array.isArray(post.likes) ? post.likes.length : 0} Likes</span>
                    </button>
                    <button 
                      onClick={handleFollowAgencyClick}
                      className="hover:text-blue-600 transition-colors flex items-center gap-1.5 bg-transparent border-none cursor-pointer"
                    >
                      <FaRegComments className="text-sm" />
                      <span>{Array.isArray(post.comments) ? post.comments.length : 0} Comments</span>
                    </button>
                    <button 
                      onClick={() => { navigator.clipboard.writeText(window.location.href); showAlert("Link Copied", "Profile link copied to your clipboard!", "success"); }}
                      className="ml-auto hover:text-slate-600 transition-colors flex items-center gap-1.5 bg-transparent border-none cursor-pointer"
                    >
                      <FaShareAlt /> Share
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* ==================== 5. MODALS ==================== */}
      {/* Premium Custom Interaction Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
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

      {/* Footer Section */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default AgencyProfile;
