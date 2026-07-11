import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaComment, FaShare, FaMapMarkerAlt, FaCamera, FaSearch, FaEllipsisH, FaCompass, FaTimes, FaChevronLeft, FaChevronRight, FaCheck, FaCheckCircle, FaCommentDots } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';
const Community = () => {
  const { user, toggleFollowAgency, showAlert, posts, agencies, toggleLikePost, addCommentToPost, deletePost, updatePost, deleteCommentFromPost, viewStory, addInquiry } = useAuth();
  const navigate = useNavigate();
  
  const [commentTexts, setCommentTexts] = useState({}); // mapping postId -> commentText

  // Instagram Style Post Menus state
  const [openMenuPostId, setOpenMenuPostId] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editPostImage, setEditPostImage] = useState('');

  // Load agencies from the database that have active stories
  const agenciesList = (agencies || []).filter(u => u.role === 'agency' && u.storyImage);
  const [activeStoryAgencyId, setActiveStoryAgencyId] = useState(null);

  useEffect(() => {
    if (activeStoryAgencyId && viewStory) {
      viewStory(activeStoryAgencyId);
    }
  }, [activeStoryAgencyId]);

  const handleLikeToggle = async (postId) => {
    if (!user) {
      showAlert("Login Required", "Please log in to like posts.", "info");
      navigate('/login');
      return;
    }
    await toggleLikePost(postId);
  };

  const handleCommentSubmit = async (postId, e) => {
    e.preventDefault();
    const text = commentTexts[postId] || '';
    if (!text.trim()) return;

    if (!user) {
      showAlert("Login Required", "Please log in to leave comments.", "info");
      navigate('/login');
      return;
    }

    await addCommentToPost(postId, text.trim());
    setCommentTexts(prev => ({ ...prev, [postId]: '' })); // Clear comment input
  };

  const handleCommentChange = (postId, value) => {
    setCommentTexts(prev => ({ ...prev, [postId]: value }));
  };

  // Story modal state logic
  const activeStoryAgency = agenciesList.find(a => a.id === activeStoryAgencyId);
  const activeStoryIndex = agenciesList.findIndex(a => a.id === activeStoryAgencyId);

  const activeStoryImage = activeStoryAgencyId ? (activeStoryAgency?.storyImage || "/sahara-desert-maroc-marrocain-8.webp") : "";

  // Check if traveler is following the active story agency
  const isFollowingActiveStory = user && user.followingAgencies?.includes(activeStoryAgencyId);

  const handleStoryFollow = () => {
    if (!user) {
      showAlert("Authentication Required", "Please log in as a Traveler to follow agencies!", "info");
      navigate('/login');
      return;
    }
    if (user.role !== 'traveler') {
      showAlert("Access Denied", "Only traveler accounts can follow agencies.", "error");
      return;
    }
    toggleFollowAgency(activeStoryAgencyId);
  };

  const handleNextStory = () => {
    if (activeStoryIndex < agenciesList.length - 1) {
      setActiveStoryAgencyId(agenciesList[activeStoryIndex + 1].id);
    } else {
      setActiveStoryAgencyId(null); // Close at the end
    }
  };

  const handlePrevStory = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryAgencyId(agenciesList[activeStoryIndex - 1].id);
    }
  };

  // Trending sidebar topics
  const trendingTopics = [
    { tag: "SaharaMagic", count: "1.2k" },
    { tag: "BlueCity", count: "850" },
    { tag: "MoroccoFood", count: "640" },
    { tag: "AtlasHike", count: "420" }
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 selection:bg-blue-500 selection:text-white pb-24">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-32 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT: Sidebar (Trending & Explore) --- */}
        <div className="hidden lg:block space-y-8 animate-fade-in-up">
           {/* Search */}
           <div className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 group focus-within:shadow-[0_8px_30px_rgb(37,99,235,0.08)] transition-all duration-300">
             <div className="relative">
               <FaSearch className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search community posts..." 
                 className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl outline-none text-sm font-bold text-slate-700 placeholder:text-slate-400 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" 
               />
             </div>
           </div>

           {/* Trending Topics */}
           <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
             <h3 className="font-extrabold text-slate-900 mb-6 flex items-center gap-2 text-xl">
               <span className="p-2 bg-rose-50 text-rose-500 rounded-xl">📈</span> Trending Now
             </h3>
             <ul className="space-y-4">
               {trendingTopics.map((item, i) => (
                 <li key={i} className="flex justify-between items-center group cursor-pointer">
                   <div className="flex flex-col">
                     <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">#{item.tag}</span>
                     <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.count} posts</span>
                   </div>
                 </li>
               ))}
             </ul>
           </div>
           
           {/* Explore Agencies Call to action */}
           <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden group cursor-pointer">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
             <FaCompass className="text-4xl text-blue-300 mb-4" />
             <h3 className="font-black text-2xl mb-2">Discover Agencies</h3>
             <p className="text-blue-100 text-sm mb-6 leading-relaxed">Find top-rated agencies and plan your next big adventure.</p>
             <Link to="/agencies" className="bg-white text-blue-600 font-bold px-6 py-2.5 rounded-xl text-sm shadow-lg active:scale-95 transition-transform w-full text-center block">
               Explore Directory
             </Link>
           </div>
        </div>

        {/* --- CENTER: Main Feed --- */}
        <div className="lg:col-span-2 space-y-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          
          {/* Dynamic Stories Bar */}
          <div className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex gap-5 overflow-x-auto hide-scrollbar relative">
            <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 rounded-r-[2rem]"></div>
            
            {/* Add Story Button (Self) */}
            <div className="flex flex-col items-center gap-2 cursor-pointer min-w-[70px] group">
               <div className="w-16 h-16 rounded-[1.25rem] border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 text-slate-400 group-hover:border-blue-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all duration-300">
                 <FaCamera className="text-xl group-hover:scale-110 transition-transform" />
               </div>
               <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-blue-600 transition-colors">Add Story</span>
            </div>

            {/* Dynamic Agency Stories */}
            {agenciesList.map((agency) => (
              <div 
                key={agency.id} 
                onClick={() => setActiveStoryAgencyId(agency.id)}
                className="flex flex-col items-center gap-2 cursor-pointer min-w-[70px] group"
              >
                <div className="w-16 h-16 rounded-[1.25rem] p-0.5 transition-transform duration-300 group-hover:scale-105 bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600">
                  <img src={agency.avatar} alt={agency.name} className="w-full h-full rounded-[1.15rem] border-2 border-white object-cover" />
                </div>
                <span className="text-xs font-bold text-slate-700 truncate w-16 text-center group-hover:text-slate-900">{agency.name}</span>
              </div>
            ))}
          </div>

          {/* Posts Feed */}
          {posts.map((post) => {
            const hasLiked = user && post.likes.includes(user.id);
            return (
              <div key={post.id} className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden mb-8">
                
                {/* Post Header */}
                <div className="p-6 flex justify-between items-center">
                  <div className="flex items-center gap-4 cursor-pointer group">
                    <img src={post.avatar} alt={post.agencyName} className="w-12 h-12 rounded-[1rem] shadow-sm border border-slate-100 group-hover:scale-105 transition-transform" />
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base group-hover:text-blue-600 transition-colors">{post.agencyName}</h4>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                        {post.time} <span className="w-1 h-1 rounded-full bg-slate-300"></span> <FaMapMarkerAlt className="text-blue-400" /> {post.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 relative">
                    {(user?.role === 'admin' || post.agencyId === user?.id) && (
                      <>
                        <button 
                          onClick={() => setOpenMenuPostId(openMenuPostId === post.id ? null : post.id)}
                          className="text-slate-400 hover:text-slate-750 transition-colors p-2 cursor-pointer border-none bg-transparent"
                        >
                          <FaEllipsisH />
                        </button>

                        {openMenuPostId === post.id && (
                          <div className="absolute right-0 top-10 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 w-36 z-20 text-left">
                            <button 
                              onClick={() => {
                                setEditingPost(post);
                                setEditContent(post.content);
                                setEditPostImage(post.image);
                                setOpenMenuPostId(null);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-750 font-bold text-xs transition-colors cursor-pointer border-none bg-transparent"
                            >
                              Edit Post
                            </button>
                            <button 
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete this post?")) {
                                  deletePost(post.id);
                                }
                                setOpenMenuPostId(null);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-550 font-bold text-xs transition-colors cursor-pointer border-none bg-transparent"
                            >
                              Delete Post
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Post Image */}
                <div className="relative group">
                  <img src={post.image} alt="Post" className="w-full h-96 object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>

                  {post.hasOffer && (
                     <Link to={post.offerLink} className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md text-blue-600 font-bold px-6 py-3 rounded-2xl text-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-105 hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center gap-2 group/btn">
                       View Trip Offer <span className="group-hover/btn:translate-x-1 transition-transform">➜</span>
                     </Link>
                  )}
                </div>

                {/* Actions & Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <button 
                      onClick={() => handleLikeToggle(post.id)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 active:scale-75 ${hasLiked ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                    >
                      <FaHeart />
                    </button>
                    <button className="w-12 h-12 rounded-full flex items-center justify-center text-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-500 transition-colors"><FaComment /></button>
                  </div>
                  
                  <p className="text-sm font-black text-slate-900 mb-3">{post.likes.length} likes</p>
                  
                  <p className="text-[15px] text-slate-600 leading-relaxed mb-3">
                    <span className="font-extrabold text-slate-900 mr-2 cursor-pointer hover:underline">{post.agencyName}</span>
                    {post.content}
                  </p>

                  {/* --- ATTACHED OFFER QUICK BOOK & CHAT BOX --- */}
                  {post.hasOffer && (
                    <div className="mt-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50/70 rounded-2xl border border-blue-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                      <div>
                        <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md mb-1.5 inline-block">
                          🎯 Featured Trip Offer
                        </span>
                        <h4 className="text-base font-black text-slate-900 leading-tight">{post.offerTitle || 'Exclusive Trip Offer'}</h4>
                        <p className="text-xs font-bold text-blue-700 mt-0.5">Click to reserve seats instantly or chat directly with the guide!</p>
                      </div>

                      <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                        <Link 
                          to={post.offerLink || `/tour/${post.offerLinkId || '1'}`}
                          className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition-all active:scale-95 no-underline"
                        >
                          <FaCheckCircle className="text-sm" /> Book Place
                        </Link>

                        <button 
                          onClick={async () => {
                            if (!user) {
                              showAlert("Login Required", "Please log in to chat about this offer!", "info");
                              navigate('/login');
                              return;
                            }
                            if (user.role !== 'traveler') {
                              showAlert("Access Denied", "Only travelers can make booking inquiries.", "error");
                              return;
                            }
                            const tourId = post.offerLinkId || (post.offerLink && post.offerLink.replace('/tour/', '')) || '1';
                            const threadId = await addInquiry(tourId, post.offerTitle || 'Trip Offer', post.agencyId, post.agencyName, user?.phone || '+212 600 000 000', 1);
                            if (threadId) {
                              showAlert("Opening Chat", "Direct chat room opened! 💬", "success");
                              navigate(`/traveler/profile?thread=${threadId}`);
                            }
                          }}
                          className="flex-1 sm:flex-initial bg-white hover:bg-slate-50 text-blue-600 border border-blue-200 font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                        >
                          <FaCommentDots className="text-sm" /> Chat
                        </button>
                      </div>
                    </div>
                  )}
                  
                   {/* Comments Display */}
                  {post.comments && post.comments.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-50 space-y-3">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex items-start gap-2.5 text-sm group/comment">
                          <img src={comment.avatar} alt="Avatar" className="w-6 h-6 rounded-full" />
                          <div className="bg-slate-50 p-2.5 rounded-xl flex-1 flex justify-between items-start">
                            <div>
                              <span className="font-extrabold text-slate-800 block text-xs mb-0.5">{comment.userName}</span>
                              <span className="text-slate-650 font-medium">{comment.text}</span>
                            </div>
                            
                            {(user?.role === 'admin' || comment.userId === user?.id || post.agencyId === user?.id) && (
                              <button 
                                onClick={() => {
                                  if (window.confirm("Delete this comment?")) {
                                    deleteCommentFromPost(post.id, comment.id);
                                  }
                                }}
                                className="opacity-0 group-hover/comment:opacity-100 text-red-400 hover:text-red-500 text-[10px] font-bold ml-2 transition-opacity cursor-pointer border-none bg-transparent"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment Input */}
                  <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="mt-5 pt-5 border-t border-slate-100 flex items-center gap-3">
                    <img src={user ? user.avatar : "/MorP.jpg"} alt="Me" className="w-8 h-8 rounded-full" />
                    <input 
                      type="text" 
                      value={commentTexts[post.id] || ''}
                      onChange={(e) => handleCommentChange(post.id, e.target.value)}
                      placeholder="Add a comment..." 
                      className="flex-1 bg-transparent outline-none text-sm font-medium placeholder:text-slate-400" 
                    />
                    <button type="submit" className="text-blue-600 font-bold text-sm hover:text-blue-700 transition-colors">Post</button>
                  </form>
                </div>

              </div>
            );
          })}

        </div>
      </div>

      {/* --- IMMERSIVE STORY VIEWER MODAL --- */}
      {activeStoryAgency && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-0 md:p-4 select-none">
          {/* Story Container */}
          <div className="relative max-w-lg w-full h-full md:h-[85vh] bg-slate-900 md:rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-800 flex flex-col justify-between">
            
            {/* Story Image Backdrop */}
            <div className="absolute inset-0 z-0">
              <img src={activeStoryImage} alt="Story Content" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/80"></div>
            </div>

            {/* Top Indicator / Progress Bars */}
            <div className="relative z-10 p-4 space-y-3">
              <div className="flex gap-1.5">
                {agenciesList.map((a, idx) => (
                  <div 
                    key={a.id} 
                    className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                      idx < activeStoryIndex ? 'bg-white' : 
                      idx === activeStoryIndex ? 'bg-white shadow-[0_0_8px_white]' : 'bg-white/30'
                    }`}
                  ></div>
                ))}
              </div>

              {/* Story Header: Profile Info, Follow Button, Close Button */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img src={activeStoryAgency.avatar} alt={activeStoryAgency.name} className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                  <div>
                    <h4 className="font-extrabold text-sm text-white drop-shadow">{activeStoryAgency.name}</h4>
                    <span className="text-[10px] text-slate-300 font-medium tracking-wide uppercase">Local Expert</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Follow / Following Button */}
                  {user?.role === 'traveler' || !user ? (
                    <button 
                      onClick={handleStoryFollow}
                      className={`px-4 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 active:scale-95 ${
                        isFollowingActiveStory 
                          ? 'bg-white/20 text-white border border-white/20' 
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'
                      }`}
                    >
                      {isFollowingActiveStory ? (
                        <>
                          <FaCheck className="text-[10px]" /> Following
                        </>
                      ) : (
                        "+ Follow"
                      )}
                    </button>
                  ) : null}

                  {/* Close button */}
                  <button 
                    onClick={() => setActiveStoryAgencyId(null)}
                    className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            </div>

            {/* Left / Right Navigation Click Zones */}
            <div className="absolute inset-x-0 top-24 bottom-24 z-10 flex">
              <div 
                onClick={handlePrevStory}
                className="w-1/3 h-full cursor-w-resize flex items-center justify-start pl-4 group"
              >
                {activeStoryIndex > 0 && (
                  <button className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white items-center justify-center hidden group-hover:flex transition-all">
                    <FaChevronLeft />
                  </button>
                )}
              </div>
              <div className="w-1/3 h-full"></div>
              <div 
                onClick={handleNextStory}
                className="w-1/3 h-full cursor-e-resize flex items-center justify-end pr-4 group"
              >
                <button className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white items-center justify-center hidden group-hover:flex transition-all">
                  <FaChevronRight />
                </button>
              </div>
            </div>

            {/* Bottom CTA Card */}
            <div className="relative z-10 p-6 bg-gradient-to-t from-black/90 to-transparent pt-12 flex flex-col gap-4 text-center">
              <p className="text-white font-bold text-base drop-shadow-md">
                Experience {activeStoryAgency.location} with {activeStoryAgency.name}!
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setActiveStoryAgencyId(null);
                    navigate(`/search?dest=${encodeURIComponent(activeStoryAgency.location)}`);
                  }}
                  className="flex-1 bg-white hover:bg-slate-100 text-slate-900 font-extrabold py-3 rounded-2xl text-xs transition-all shadow-lg active:scale-95"
                >
                  Browse Offers
                </button>
                <button 
                  onClick={() => setActiveStoryAgencyId(null)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-2xl text-xs transition-all border border-white/15"
                >
                  Close Story
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      
      {/* Edit Post Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setEditingPost(null)}></div>
          <div className="relative bg-white border border-slate-100 rounded-[2rem] p-8 max-w-md w-full shadow-2xl z-10 animate-fade-in text-slate-800">
            <h3 className="font-extrabold text-2xl text-slate-950 mb-6">Edit Post</h3>
            
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                if (!editContent.trim()) return;
                const res = await updatePost(editingPost.id, {
                  content: editContent.trim(),
                  image: editPostImage
                });
                if (res.success) {
                  setEditingPost(null);
                  showAlert("Success", "Successfully updated your post!", "success");
                }
              }} 
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Content</label>
                <textarea 
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold focus:border-blue-500 focus:bg-white transition-all text-slate-700 resize-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Select Suggestion Image</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "/Sahara Desert Adventure.jpg",
                    "/Chefchaouen-tours.jpg",
                    "/marrakech medina.jpg",
                    "/Fes.jpg"
                  ].map((img) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setEditPostImage(img)}
                      className={`relative h-14 rounded-xl overflow-hidden border-2 transition-all ${editPostImage === img ? 'border-blue-600 scale-[1.03] shadow-md' : 'border-transparent opacity-65 hover:opacity-100'} cursor-pointer`}
                    >
                      <img src={img} alt="Post option" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <input 
                  type="text" 
                  value={editPostImage}
                  onChange={(e) => setEditPostImage(e.target.value)}
                  placeholder="Or enter custom image path/URL" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-medium focus:border-blue-500 focus:bg-white transition-all mt-3 text-slate-655"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setEditingPost(null)}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold py-3.5 rounded-xl text-sm bg-white cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition-all cursor-pointer border-none"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;