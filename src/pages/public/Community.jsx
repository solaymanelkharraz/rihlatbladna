import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaComment, FaShare, FaMapMarkerAlt, FaCamera, FaSearch, FaEllipsisH, FaCompass, FaTimes, FaChevronLeft, FaChevronRight, FaCheck, FaCheckCircle, FaCommentDots } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import StoryViewer from '../../components/common/StoryViewer';

const Community = () => {
  const { user, toggleFollowAgency, showAlert, posts, agencies, toggleLikePost, addCommentToPost, deletePost, updatePost, deleteCommentFromPost, viewStory, addInquiry, shareStory } = useAuth();
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

  // Smooth scroll to specific post when navigated via hash (e.g. #post-2)
  useEffect(() => {
    if (window.location.hash && posts && posts.length > 0) {
      const targetId = window.location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-4', 'ring-blue-500/50', 'transition-all', 'duration-500');
          setTimeout(() => el.classList.remove('ring-4', 'ring-blue-500/50'), 3000);
        }
      }, 150);
    }
  }, [posts, window.location.hash]);

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

  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const diffHours = Math.max(0, Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60)));
    if (diffHours === 0) return 'Just now';
    if (diffHours < 24) return `${diffHours}H AGO`;
    return `${Math.floor(diffHours / 24)}D AGO`;
  };

  // Story State
  const topAgenciesSorted = useMemo(() => {
    return (agencies || []).filter(u => u.role === 'agency').sort((a, b) => (b.followersCount || 0) - (a.followersCount || 0));
  }, [agencies]);

  const displayAgencies = useMemo(() => {
    // Always include the platform admins so their global stories appear
    const admins = (agencies || []).filter(u => u.role === 'admin');

    let baseAgencies = [];
    if (user && user.followingAgencies && user.followingAgencies.length > 0) {
      baseAgencies = topAgenciesSorted.filter(a => user.followingAgencies.includes(a.id));
      if (baseAgencies.length === 0) {
        baseAgencies = topAgenciesSorted.slice(0, 10);
      }
    } else {
      baseAgencies = topAgenciesSorted.slice(0, 10);
    }
    
    // Combine admins with organic feed agencies
    return [...admins, ...baseAgencies];
  }, [user, topAgenciesSorted, agencies]);

  // 2. Filter out agencies that have NO stories and sort unviewed first
  const [agenciesWithStories, setAgenciesWithStories] = useState([]);
  const [activeStoryIdx, setActiveStoryIdx] = useState(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isStoryPaused, setIsStoryPaused] = useState(false);

  useEffect(() => {
    if (activeStoryIdx !== null) return;
    const viewed = JSON.parse(localStorage.getItem('viewedAgencies')) || [];
    const filtered = displayAgencies.filter(a => a.stories && a.stories.length > 0);
    const sorted = filtered.sort((a, b) => {
       if (a.role === 'admin' && b.role !== 'admin') return -1;
       if (b.role === 'admin' && a.role !== 'admin') return 1;
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
      }, 50);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeStoryIdx, isStoryPaused, agenciesWithStories]);

  const handleAddStory = async () => {
    if (!user || (user.role !== 'agency' && user.role !== 'admin')) {
      showAlert('Access Denied', 'Only agencies and admins can post stories.', 'error');
      return;
    }
    const imageUrl = prompt('Enter the image URL for your new story:');
    if (!imageUrl) return;
    await shareStory(imageUrl);
    showAlert('Success', 'Story posted successfully!', 'success');
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
            <div 
              onClick={handleAddStory}
              className="flex flex-col items-center gap-2 cursor-pointer min-w-[70px] group"
            >
               <div className="w-16 h-16 rounded-[1.25rem] border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 text-slate-400 group-hover:border-blue-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all duration-300">
                 <FaCamera className="text-xl group-hover:scale-110 transition-transform" />
               </div>
               <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-blue-600 transition-colors">Add Story</span>
            </div>

            {/* Dynamic Agency Stories */}
            {agenciesWithStories.map((agency, index) => (
              <div 
                key={`${agency.id}-${index}`} 
                onClick={() => {
                   markAgencyViewed(agenciesWithStories[index].id);
                   setActiveStoryIdx({ agencyIndex: index, storyIndex: 0 });
                   setStoryProgress(0);
                }}
                className="flex flex-col items-center gap-2 cursor-pointer min-w-[70px] group"
              >
                <div className={`w-16 h-16 rounded-[1.25rem] p-0.5 transition-transform duration-300 group-hover:scale-105 ${(JSON.parse(localStorage.getItem('viewedAgencies')) || []).includes(agency.id) ? 'bg-slate-300 dark:bg-slate-700' : 'bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600'}`}>
                  <img  src={agency.avatar || '/MorP.jpg'} alt={agency.name} className="w-full h-full rounded-[1.15rem] border-2 border-white object-cover" />
                </div>
                <span className="text-xs font-bold text-slate-700 truncate w-16 text-center group-hover:text-slate-900">{agency.name}</span>
              </div>
            ))}
          </div>

          {/* Posts Feed */}
          {posts.map((post) => {
            const hasLiked = user && post.likes.includes(user.id);
            return (
              <div key={post.id} id={`post-${post.id}`} className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden mb-8 scroll-mt-32">
                
                {/* Post Header */}
                <div className="p-6 flex justify-between items-center">
                  <div className="flex items-center gap-4 cursor-pointer group">
                    <img src={post.avatar} alt={post.agencyName} className="w-12 h-12 rounded-[1rem] shadow-sm border border-slate-100 group-hover:scale-105 transition-transform" />
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base group-hover:text-blue-600 transition-colors flex items-center gap-2">
                        {post.agencyName}
                        {post.agencyRole === 'admin' && (
                          <span className="bg-amber-500 text-slate-900 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1">
                            <FaCheckCircle className="text-[10px]" /> Official Admin
                          </span>
                        )}
                      </h4>
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
                  
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[15px] text-slate-600 leading-relaxed">
                      <span className="font-extrabold text-slate-900 mr-2 cursor-pointer hover:underline">{post.agencyName}</span>
                      {post.content}
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap ml-4">{formatTimeAgo(post.createdAt)}</span>
                  </div>

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
      <StoryViewer 
        agenciesWithStories={agenciesWithStories}
        activeStoryIdx={activeStoryIdx}
        setActiveStoryIdx={setActiveStoryIdx}
        storyProgress={storyProgress}
        setStoryProgress={setStoryProgress}
        isStoryPaused={isStoryPaused}
        setIsStoryPaused={setIsStoryPaused}
        handleNextStory={handleNextStory}
        handlePrevStory={handlePrevStory}
      />

      
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