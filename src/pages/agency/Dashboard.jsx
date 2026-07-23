import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { 
  FaUserFriends, 
  FaTrophy, 
  FaBriefcase, 
  FaComments, 
  FaBullhorn, 
  FaPlus,
  FaArrowRight,
  FaMapMarkerAlt,
  FaWallet,
  FaLock,
  FaClock
} from 'react-icons/fa';

const Dashboard = () => {
  const { user, tours, bookings } = useAuth();
  const navigate = useNavigate();

  const agencyTours = user ? (tours || []).filter(t => t.agencyId === user.id) : [];
  const toursCount = agencyTours.length;

  const agencyBookings = user ? (bookings || []).filter(b => b.agencyId === user.id) : [];
  const inquiriesCount = agencyBookings.length;

  const recentLeads = [...agencyBookings].reverse().slice(0, 4);

  const stats = [
    { 
      title: "Your Rank", 
      value: user?.followersCount > 1000 ? "#2" : "#4", 
      subtext: "in Tangier", 
      icon: <FaTrophy />, 
      color: "bg-amber-500", 
      glow: "shadow-amber-500/40" 
    }, 
    { 
      title: "Total Followers", 
      value: user?.followersCount || 0, 
      subtext: "Rank driver", 
      icon: <FaUserFriends />, 
      color: "bg-blue-600", 
      glow: "shadow-blue-600/40" 
    }, 
    { 
      title: "Active Offers", 
      value: toursCount, 
      subtext: "Live listings", 
      icon: <FaBriefcase />, 
      color: "bg-purple-500", 
      glow: "shadow-purple-500/40" 
    },
    { 
      title: "Wallet Credits", 
      value: user?.credits || 0, 
      subtext: "For boosting", 
      icon: <FaWallet />, 
      color: "bg-emerald-500", 
      glow: "shadow-emerald-500/40" 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex selection:bg-blue-500 selection:text-white">
      <Sidebar />

      <div className="flex-1 lg:ml-64 pt-24 pb-12 px-6 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto animate-fade-in-up">
          
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-[2rem] p-8 sm:p-10 text-white shadow-xl mb-10 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-md shrink-0 bg-white">
                  <img src={user?.avatar || '/MorP.jpg'} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {user?.isVerified ? (
                      <span className="bg-blue-500/30 text-blue-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-blue-400/20 flex items-center gap-1">
                        <FaTrophy className="text-xs" /> Verified Agency
                      </span>
                    ) : (
                      <span className="bg-amber-500/30 text-amber-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-amber-400/20 flex items-center gap-1">
                        <FaClock className="text-xs" /> Under Review
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{user?.name || 'Welcome Back!'}</h1>
                  <p className="text-slate-300 text-xs font-semibold flex items-center gap-1.5 mt-1">
                    <FaMapMarkerAlt className="text-amber-400" /> {user?.location || 'Morocco'} &bull; <span className="text-slate-400">Manage your tours & client inquiries</span>
                  </p>
                </div>
              </div>

              {user?.isVerified && (
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                  <Link
                    to="/agency/story"
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/15 px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 flex-1 md:flex-initial"
                  >
                    <FaBullhorn className="text-amber-400" /> + Add Story / Post
                  </Link>
                  <Link
                    to="/agency/create-offer"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex-1 md:flex-initial"
                  >
                    <FaPlus /> + New Offer
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Verification Purgatory Banner */}
          {!user?.isVerified && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-8 mb-10 shadow-lg relative overflow-hidden animate-fade-in">
              <div className="absolute -right-10 -bottom-10 text-amber-500/10 text-9xl pointer-events-none">
                <FaLock />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                  <FaClock />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-amber-900 mb-2">Welcome to RihlatBladna!</h2>
                  <p className="text-amber-800 text-sm font-medium leading-relaxed max-w-3xl">
                    Your account is currently under review by our team. Please allow 24-48 hours for your Moroccan Tourism License to be verified. Once verified, all premium dashboard features including posting tours and stories will be unlocked.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center gap-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 cursor-default">
                <div className={`w-20 h-20 rounded-[1.25rem] ${stat.color} text-white flex items-center justify-center text-3xl shadow-lg ${stat.glow} z-10 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <div className="z-10">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.title}</p>
                  <h3 className="text-4xl font-black text-slate-800 mb-1">{stat.value}</h3>
                  <span className="text-slate-500 text-sm font-medium">{stat.subtext}</span>
                </div>
                <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-300 ${stat.color}`}></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            
            {/* Recent Leads */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <FaComments className="text-blue-500" /> Recent Inquiries ({inquiriesCount})
                  </h2>
                  <Link to="/agency/bookings" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    View All <FaArrowRight className="text-[10px]" />
                  </Link>
                </div>
                <div className="divide-y divide-slate-100">
                  {recentLeads.length > 0 ? (
                    recentLeads.map((lead) => {
                      const threadId = `thread_${lead.travelerId}_${user.id}`;
                      return (
                        <div key={lead.id} className="p-6 flex items-center gap-5 hover:bg-slate-50/80 transition-colors duration-200">
                          <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center bg-blue-100 text-blue-600 font-extrabold text-xl shrink-0">
                            {lead.travelerName.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-800 text-base truncate">{lead.travelerName}</h4>
                            <p className="text-xs text-slate-500 truncate">Interested in <span className="font-semibold text-blue-600">{lead.tourTitle}</span></p>
                          </div>
                          <div className="text-right flex flex-col items-end gap-1.5 shrink-0">
                            <span className="block text-[10px] text-slate-400 font-bold uppercase">{lead.status}</span>
                            <button 
                              onClick={() => navigate(`/agency/messages?thread=${threadId}`)}
                              className="bg-blue-50 text-blue-600 font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 hover:bg-blue-600 hover:text-white border border-blue-200 transition-all duration-300 active:scale-95 text-xs"
                            >
                              <FaComments /> Reply
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-12 text-center text-slate-400 font-medium text-sm">
                      No booking inquiries received yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-slate-50/80 border-t border-slate-100 text-center">
                <Link to="/agency/bookings" className="text-xs font-extrabold text-slate-600 hover:text-blue-600 transition-colors">
                  Check all {inquiriesCount} reservation inquiries & leads →
                </Link>
              </div>
            </div>

            {/* Rank & Growth Tips */}
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6">Improve Your Rank</h2>
                <div className="p-5 bg-blue-50/50 rounded-2xl mb-6 border border-blue-100/50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-blue-800 font-bold text-sm">Next Rank: #3</span>
                    <span className="text-blue-600 text-xs font-bold">Followers driver</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-blue-600 h-[75%] rounded-full relative">
                      <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200/50">
                 <h4 className="text-amber-800 font-bold text-base mb-3 flex items-center gap-2">
                   <FaBullhorn /> How to rank #1?
                 </h4>
                 <ul className="text-sm text-amber-700 space-y-3 font-medium">
                   <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">•</span> Share daily stories in the community feed.</li>
                   <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">•</span> Encourage satisfied clients to follow your page.</li>
                   <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">•</span> Keep active listings up to date.</li>
                 </ul>
              </div>
            </div>

          </div>

          {/* Quick Shortcuts Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/agency/settings" className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
              <div>
                <h4 className="font-extrabold text-slate-800 text-base mb-1">Agency Account Settings</h4>
                <p className="text-slate-500 text-xs leading-relaxed">Configure notifications, WhatsApp alerts, public branding, and profile information.</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0 ml-3">
                <FaArrowRight />
              </div>
            </Link>

            {user?.isVerified ? (
              <>
                <Link to="/agency/story?tab=manage" className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-base mb-1">24h Stories & View Analytics</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">See live traveler view counts, remove active stories, and track daily reach.</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0 ml-3">
                    <FaArrowRight />
                  </div>
                </Link>

                <Link to="/agency/posts" className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-base mb-1">Social Feed & Comments</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">Review traveler comments, answer questions, and manage feed announcements.</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold group-hover:bg-orange-600 group-hover:text-white transition-colors shrink-0 ml-3">
                    <FaArrowRight />
                  </div>
                </Link>
              </>
            ) : (
              <div className="md:col-span-2 bg-slate-100 p-6 rounded-3xl border border-slate-200 shadow-inner flex items-center justify-center text-center">
                <p className="text-slate-500 font-bold text-sm flex items-center gap-2">
                  <FaLock className="text-slate-400" /> More shortcuts will appear here once your agency is verified.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};

export default Dashboard;