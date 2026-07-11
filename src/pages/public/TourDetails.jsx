import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaClock, FaUserFriends, FaStar, FaHeart, FaShareAlt, FaCheckCircle, FaArrowLeft, FaShieldAlt, FaLanguage, FaCommentDots } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleSaveTour, toggleFollowAgency, addInquiry, showAlert, tours } = useAuth();
  
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSeats, setBookingSeats] = useState(1);
  const [bookingPhone, setBookingPhone] = useState(user?.phone || '+212 600-000000');
  const [submittingBooking, setSubmittingBooking] = useState(false);

  // Find tour directly during render to bypass type conversion mismatch issues
  const tour = (tours || []).find(t => String(t.id) === String(id));

  if (!tour) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between text-center py-32 px-6">
        <Navbar />
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Tour Not Found</h2>
          <p className="text-slate-500 mb-6">The experience you are looking for does not exist.</p>
          <Link to="/search" className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl">Back to Search</Link>
        </div>
      </div>
    );
  }

  const isSaved = user && user.role === 'traveler' && user.savedTours?.includes(tour.id);
  const isFollowing = user && user.role === 'traveler' && user.followingAgencies?.includes(tour.agencyId);

  const handleInquiry = async () => {
    if (!user) {
      showAlert("Login Required", "Please log in as a Traveler to inquire and chat about this tour!", "info");
      navigate('/login');
      return;
    }
    if (user.role !== 'traveler') {
      showAlert("Access Denied", "Only travelers can make booking inquiries.", "error");
      return;
    }

    const threadId = await addInquiry(tour.id, tour.title, tour.agencyId, tour.agencyName, user?.phone || '+212 600 000 000', 1);
    if (threadId) {
      showAlert("Inquiry Success", "Inquiry logged successfully! Opening secure chat session... 💬", "success");
      navigate(`/traveler/profile?thread=${threadId}`);
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showAlert("Login Required", "Please log in as a Traveler to book places!", "info");
      navigate('/login');
      return;
    }
    if (user.role !== 'traveler') {
      showAlert("Access Denied", "Only travelers can make booking inquiries.", "error");
      return;
    }
    setSubmittingBooking(true);
    const threadId = await addInquiry(tour.id, tour.title, tour.agencyId, tour.agencyName, bookingPhone, bookingSeats);
    setSubmittingBooking(false);
    setShowBookingModal(false);

    if (threadId) {
      showAlert("🎉 Place Reserved!", `Your reservation for ${bookingSeats} person(s) is logged! We have sent confirmation to your in-app chat and the agency team will message you on WhatsApp soon.`, "success");
      navigate(`/traveler/profile?thread=${threadId}`);
    }
  };

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
            <img src={tour.image} alt="Main" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
            
            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md text-slate-900 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
              <FaUserFriends className="text-blue-600 animate-pulse" /> 12 people viewing
            </div>
            
            {user && user.role === 'traveler' && (
              <button 
                onClick={() => toggleSaveTour(tour.id)}
                className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-xl shadow-lg transition-transform active:scale-95 z-20"
              >
                <FaHeart className={isSaved ? "text-red-500" : "text-slate-400"} />
              </button>
            )}
          </div>
          
          {/* Side Images fallback */}
          <div className="hidden lg:flex flex-col gap-4 h-full">
             <div className="relative flex-1 overflow-hidden rounded-r-[2rem] group cursor-pointer bg-slate-200">
               <img src={tour.image} className="w-full h-full object-cover brightness-75 hover:brightness-100 transition-all" alt="Side 1" />
             </div>
             <div className="relative flex-1 overflow-hidden rounded-br-[2rem] group cursor-pointer bg-slate-200">
               <img src="/Fes.jpg" className="w-full h-full object-cover brightness-75 hover:brightness-100 transition-all" alt="Side 2" />
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
                <span className="text-4xl font-black text-blue-600 leading-none">{tour.price} DH</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-600 mt-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <span className="flex items-center gap-2 text-amber-500 text-base"><FaStar /> {tour.rating} <span className="text-slate-400 font-medium text-sm">({tour.reviews || 0} reviews)</span></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-blue-500" /> {tour.location}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              <span className="flex items-center gap-2"><FaClock className="text-blue-500" /> {tour.duration}</span>
            </div>
          </div>

          {/* Agency Card (With Follow Button) */}
          <div className="bg-white p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] gap-4 group hover:shadow-md transition-shadow">
            <div className="flex items-center gap-5 w-full sm:w-auto">
              <img src={tour.agencyAvatar || "/MorP.jpg"} alt="Agency" className="w-16 h-16 rounded-full border-2 border-slate-100 shadow-sm object-cover" />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Organized by</p>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
                  {tour.agencyName} <FaCheckCircle className="text-blue-500 text-sm" title="Verified Agency" />
                </h3>
                <p className="text-sm font-medium text-slate-500">Local Expert</p>
              </div>
            </div>
            
            {user && user.role === 'traveler' ? (
              <button 
                onClick={() => toggleFollowAgency(tour.agencyId)}
                className={`w-full sm:w-auto px-8 py-3 rounded-2xl font-bold transition-all duration-300 active:scale-95 ${isFollowing ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700'}`}
              >
                {isFollowing ? 'Following' : '+ Follow Agency'}
              </button>
            ) : !user ? (
              <Link to="/login" className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-center text-sm shadow-md">
                Login to Follow
              </Link>
            ) : null}
          </div>

          {/* Description */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">About this experience</h2>
            <p className="text-slate-600 leading-relaxed text-lg">{tour.description}</p>
            
            <div className="mt-8 grid grid-cols-2 gap-4">
               <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-4 rounded-xl">
                  <FaShieldAlt className="text-2xl text-blue-500" />
                  <span className="font-bold text-sm">Secure Inquiry System</span>
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
                {(tour.included || ["Transport", "Lodging"]).map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 font-medium">
                    <span className="text-green-500 mt-1">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2"><span className="text-red-500 font-bold">✕</span> Not Included</h3>
              <ul className="space-y-4">
                {(tour.notIncluded || ["Personal expenses"]).map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-400 font-medium">
                    <span className="text-slate-300 mt-1">✕</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* --- IN-PAGE OFFER RESERVATION & CHAT ACTION BOX --- */}
          {user?.role !== 'agency' && (
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden animate-fade-in-up mt-8">
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                <div>
                  <span className="bg-white/20 text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full backdrop-blur-md mb-3 inline-block">
                    ⚡ Direct Trip Offer
                  </span>
                  <h3 className="text-3xl font-black mb-2">{tour.price} DH <span className="text-sm font-semibold text-blue-100">/ per person</span></h3>
                  <p className="text-blue-100 text-sm max-w-md font-medium">
                    Reserve your places instantly without commission fees, or open a secure 1-on-1 chat room with <span className="font-bold text-white">{tour.agencyName}</span> to discuss details!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                  <button 
                    onClick={() => {
                      if (!user) {
                        showAlert("Login Required", "Please log in as a Traveler to book places!", "info");
                        navigate('/login');
                        return;
                      }
                      setBookingPhone(user?.phone || '+212 600-000000');
                      setShowBookingModal(true);
                    }}
                    className="bg-white hover:bg-blue-50 text-blue-600 font-black py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-base cursor-pointer border-none"
                  >
                    <FaCheckCircle className="text-xl text-blue-600" /> Book Instant Place
                  </button>

                  <button 
                    onClick={handleInquiry}
                    className="bg-blue-700/80 hover:bg-blue-700 text-white border border-white/30 font-extrabold py-4 px-6 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <FaCommentDots className="text-lg" /> Or Chat First
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- 3. STICKY ACTION CARD (Desktop) --- */}
        <div className="hidden lg:block animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.06)] border border-slate-100 sticky top-28">
            <div className="text-center mb-8">
               <span className="block text-slate-400 font-bold uppercase tracking-wider text-sm mb-2">Ready to explore?</span>
               <h3 className="text-3xl font-black text-slate-900">{tour.price} DH</h3>
               <p className="text-slate-500 text-sm mt-1">Direct booking. No booking fees.</p>
            </div>
            
            {user?.role !== 'agency' && (
              <div className="space-y-3 mb-4">
                <button 
                  onClick={() => {
                    if (!user) {
                      showAlert("Login Required", "Please log in as a Traveler to book places!", "info");
                      navigate('/login');
                      return;
                    }
                    setBookingPhone(user?.phone || '+212 600-000000');
                    setShowBookingModal(true);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-[0_8px_30px_rgb(37,99,235,0.3)] hover:shadow-[0_8px_25px_rgb(37,99,235,0.4)] flex items-center justify-center gap-3 text-lg transition-all duration-300 active:scale-95 group cursor-pointer border-none"
                >
                  <FaCheckCircle className="text-2xl group-hover:scale-110 transition-transform" /> Book Instant Places
                </button>

                <button 
                  onClick={handleInquiry}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm transition-all active:scale-95 cursor-pointer border border-slate-200/60"
                >
                  <FaCommentDots className="text-lg text-blue-600" /> Or Inquire & Chat First
                </button>
              </div>
            )}

            <div className="flex gap-4">
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
                  className={`flex-1 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 border-none cursor-pointer ${isSaved ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
                >
                  <FaHeart /> {isSaved ? 'Saved' : 'Save'}
                </button>
              )}
              <button 
                onClick={() => { navigator.clipboard.writeText(window.location.href); showAlert("Link Copied", "Tour link copied to your clipboard!", "success"); }}
                className="flex-1 bg-slate-50 border border-slate-200 py-3.5 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-2 transition-colors"
              >
                <FaShareAlt /> Share
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm font-medium text-slate-500">
                You will open an in-app secure chat channel directly with <span className="font-bold text-slate-800">{tour.agencyName}</span>.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* --- 4. MOBILE STICKY BAR (Bottom) --- */}
      {user?.role !== 'agency' && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-4 px-6 flex items-center justify-between z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] gap-3">
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Total Price</span>
            <span className="text-xl font-black text-slate-900">{tour.price} DH</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleInquiry}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-4 rounded-2xl flex items-center gap-2 transition-transform active:scale-95 text-xs border border-slate-200/60"
              title="Chat with Agency"
            >
               <FaCommentDots className="text-base text-blue-600" /> Chat
            </button>
            <button 
              onClick={() => {
                if (!user) {
                  showAlert("Login Required", "Please log in as a Traveler to book places!", "info");
                  navigate('/login');
                  return;
                }
                setBookingPhone(user?.phone || '+212 600-000000');
                setShowBookingModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-[0_8px_20px_rgb(37,99,235,0.3)] flex items-center gap-2 transition-transform active:scale-95 text-sm border-none cursor-pointer"
            >
               <FaCheckCircle className="text-base" /> Book Place
            </button>
          </div>
        </div>
      )}

      {/* --- INSTANT BOOKING MODAL --- */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-slate-100 relative animate-scale-up">
            <button 
              onClick={() => setShowBookingModal(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold transition-all cursor-pointer border-none"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                <FaCheckCircle />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 leading-tight">Instant Reservation</h3>
                <p className="text-xs text-slate-500">Book places directly without commission fees.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 mb-6">
              <h4 className="text-sm font-extrabold text-slate-800 line-clamp-1">{tour.title}</h4>
              <div className="flex items-center justify-between mt-2 text-xs font-semibold text-slate-500">
                <span>Price per person:</span>
                <span className="text-blue-600 font-black text-sm">{tour.price} DH</span>
              </div>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  Number of Seats / Travelers
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setBookingSeats(num)}
                      className={`py-3 rounded-xl font-extrabold text-sm transition-all border cursor-pointer ${bookingSeats === num ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                    >
                      {num} {num === 1 ? 'Person' : 'People'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  Your WhatsApp / Contact Number
                </label>
                <input 
                  type="text"
                  required
                  placeholder="+212 600-000000"
                  value={bookingPhone}
                  onChange={(e) => setBookingPhone(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  The agency will use this number to send your final meetup details on WhatsApp.
                </p>
              </div>

              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100 flex items-center justify-between">
                <span className="text-xs font-extrabold text-blue-900">Total Estimated Price</span>
                <span className="text-2xl font-black text-blue-600">
                  {bookingSeats * (parseInt(String(tour.price).replace(/[^0-9]/g, '')) || 0)} DH
                </span>
              </div>

              <button
                type="submit"
                disabled={submittingBooking}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 text-base cursor-pointer border-none"
              >
                {submittingBooking ? 'Reserving...' : 'Confirm Place & Open Chat →'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TourDetails;