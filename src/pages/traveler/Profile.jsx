import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCommentDots, FaHeart, FaCameraRetro, FaPaperPlane, FaUpload } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';
const Profile = () => {
  const { user, toggleSaveTour, sendMessageToThread, bookings: allBookings, tours, chats, updateProfile, showAlert } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const avatarInputRef = useRef(null);

  // Edit Profile States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editLocation, setEditLocation] = useState(user?.location || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '');

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditLocation(user.location || '');
      setEditBio(user.bio || '');
      setEditAvatar(user.avatar || '');
    }
  }, [user]);

  const handleAvatarUpload = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      if (showAlert) showAlert("Invalid File", "Please select an image file (JPG, PNG, WEBP)", "error");
      else alert("Please select an image file (JPG, PNG, WEBP)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setEditAvatar(compressedDataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const res = await updateProfile(editName, editLocation, editAvatar, user?.cover || '', editBio);
    if (res && res.success) {
      if (showAlert) showAlert("Profile Updated", "Your avatar and profile details have been saved!", "success");
      setIsEditModalOpen(false);
    }
  };

  const userId = user?.id || '';

  const bookings = (allBookings || []).filter(b => b.travelerId === userId);
  const wishlistTours = (tours || []).filter(t => (user?.savedTours || []).includes(t.id));
  const threads = (chats || []).filter(t => t.travelerId === userId);

  const threadParam = searchParams.get('thread');
  const [activeThreadId, setActiveThreadId] = useState(threadParam);

  // Sync state parameters synchronously when parameters change in render
  const [prevThreadParam, setPrevThreadParam] = useState(threadParam);
  if (threadParam !== prevThreadParam) {
    setActiveThreadId(threadParam);
    setPrevThreadParam(threadParam);
  }

  const [chatMessage, setChatMessage] = useState('');
  
  const messagesEndRef = useRef(null);

  const activeThread = threads.find(t => t.id === activeThreadId);
  const activeMessagesLength = activeThread?.messages.length || 0;

  // Scroll to bottom of chat safely using primitive length triggers (prevents loops)
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeThreadId, activeMessagesLength]);

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim() || !activeThreadId) return;

    await sendMessageToThread(activeThreadId, chatMessage.trim());
    setChatMessage('');
  };

  const handleOpenChat = (threadId) => {
    setActiveThreadId(threadId);
    setSearchParams({ thread: threadId });
  };

  const handleCloseChat = () => {
    setActiveThreadId(null);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-blue-500 selection:text-white pb-24">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-32 pb-12 flex flex-col lg:flex-row gap-8">
        
        {/* --- LEFT: SIDEBAR PROFILE --- */}
        <div className="w-full lg:w-1/4 animate-fade-in-up">
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 text-center border border-slate-100 sticky top-28 overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full filter blur-3xl opacity-50"></div>
            
            <div className="relative w-32 h-32 mx-auto mb-6">
              <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full border-4 border-white shadow-lg object-cover z-10 relative" />
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2.5 rounded-full shadow-md hover:bg-blue-700 transition-colors z-20 cursor-pointer border-none"
              >
                <FaCameraRetro />
              </button>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{user.name}</h2>
            <p className="text-slate-500 text-sm mb-4 flex items-center justify-center gap-1 font-medium mt-1">
              <FaMapMarkerAlt className="text-blue-500" /> {user.location}
            </p>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="w-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs transition-all border border-slate-200 mb-6 cursor-pointer"
            >
              Edit Profile
            </button>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 mb-8 border-y border-slate-100 py-6">
              <div className="text-center">
                <span className="block font-black text-2xl text-slate-800">{user.followingAgencies?.length || 0}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Following</span>
              </div>
              <div className="w-px bg-slate-100"></div>
              <div className="text-center">
                <span className="block font-black text-2xl text-slate-800">{bookings.length}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Inquiries</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT: MAIN CONTENT --- */}
        <div className="w-full lg:w-3/4 space-y-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          
          {/* Chat Messenger Split-Screen / Panel */}
          {activeThread && (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col h-[500px]">
              {/* Chat Header */}
              <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img src={`https://i.pravatar.cc/150?u=${activeThread.agencyId}`} alt="Agency" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-100">{activeThread.agencyName}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-green-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span> Live Chat
                    </span>
                  </div>
                </div>
                <button 
                  onClick={handleCloseChat}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all"
                >
                  Close Chat
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50">
                {activeThread.messages.map((msg) => {
                  const isMe = msg.senderId === user.id;
                  const isSystem = msg.senderId === 'system';
                  
                  if (isSystem) {
                    return (
                      <div key={msg.id} className="text-center">
                        <span className="bg-blue-50 text-blue-600 text-xs font-extrabold px-4 py-1.5 rounded-full border border-blue-100 shadow-sm">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-4 rounded-2xl text-sm font-medium ${isMe ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-500/10' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm'}`}>
                        <p>{msg.text}</p>
                        <span className={`block text-[10px] text-right mt-1.5 ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Form */}
              <form onSubmit={handleSendChat} className="p-4 border-t border-slate-100 flex gap-3 bg-white">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-50 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 border border-slate-200 focus:border-blue-500 transition-all"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-all">
                  <FaPaperPlane />
                </button>
              </form>
            </div>
          )}

          {/* Section 1: My Inquiries (Conversations) */}
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 border border-slate-100">
            <h3 className="text-2xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-500 rounded-xl"><FaCommentDots /></div> 
              My Inquiries & Chats
            </h3>
            {bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((item) => {
                  const threadId = `thread_${user.id}_${item.agencyId}`;
                  return (
                    <div key={item.id} className="flex flex-col md:flex-row gap-5 items-center bg-slate-50/50 p-5 rounded-2xl hover:bg-white hover:shadow-md border border-slate-100 transition-all duration-300 group">
                      <div className="flex-1 text-center md:text-left">
                        <h4 className="font-bold text-xl text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{item.tourTitle}</h4>
                        <p className="text-slate-500 text-sm">
                          Agency: <span className="font-semibold text-slate-700">{item.tourTitle ? item.tourTitle.split(" ")[1] : "Sahara Travels"}</span> | Status:{' '}
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black
                            ${item.status === 'New' ? 'bg-red-100 text-red-600' :
                            item.status === 'Contacted' ? 'bg-blue-100 text-blue-600' :
                            item.status === 'Booked' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}
                          `}>
                            {item.status}
                          </span>
                        </p>
                      </div>
                      <div className="text-right flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{item.date}</span>
                        <button 
                          onClick={() => handleOpenChat(threadId)}
                          className="w-full md:w-auto bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 shadow-md transition-all active:scale-95"
                        >
                          <FaCommentDots /> In-App Chat
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border-dashed border-2 border-slate-200 p-8">
                <p className="text-slate-500 font-bold mb-1">No inquires made yet.</p>
                <p className="text-slate-400 text-sm mb-4">Inquire on tour package detail pages to start threads.</p>
                <Link to="/search" className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm inline-block">Explore Tours</Link>
              </div>
            )}
          </div>

          {/* Section 2: Wishlist */}
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 border border-slate-100">
            <h3 className="text-2xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
              <div className="p-2 bg-red-50 text-red-500 rounded-xl"><FaHeart /></div> 
              Wishlist
            </h3>
            {wishlistTours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {wishlistTours.map((tour) => (
                  <div key={tour.id} className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col">
                    <img src={tour.image} alt={tour.title} className="h-44 w-full object-cover" />
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-extrabold text-slate-800 line-clamp-1">{tour.title}</h4>
                        <span className="text-xs text-slate-400 font-medium">{tour.location} | {tour.price} DH</span>
                      </div>
                      <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
                        <Link to={`/tour/${tour.id}`} className="flex-1 bg-slate-50 text-slate-700 font-bold py-2 rounded-xl text-xs text-center border border-slate-200">
                          View Trip
                        </Link>
                        <button 
                          onClick={() => toggleSaveTour(tour.id)}
                          className="bg-red-50 text-red-500 font-bold px-3 py-2 rounded-xl text-xs hover:bg-red-100 border-none cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 px-8 text-center bg-slate-50/50 rounded-2xl border-dashed border-2 border-slate-200">
                <div className="w-20 h-20 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  <FaHeart />
                </div>
                <p className="text-slate-500 font-medium text-lg mb-2">You haven't saved any trips yet.</p>
                <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">Go explore our amazing tours and save the ones you love to easily find them later.</p>
                <Link to="/search" className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl shadow-md transition-all inline-block">
                  Explore Tours
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="relative bg-white border border-slate-100 rounded-[2rem] p-8 max-w-md w-full shadow-2xl z-10 animate-fade-in">
            <h3 className="font-extrabold text-2xl text-slate-950 mb-6">Edit Profile</h3>
            
            <form onSubmit={handleProfileUpdate} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold focus:border-blue-500 focus:bg-white transition-all text-slate-700" 
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Location</label>
                <input 
                  type="text" 
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold focus:border-blue-500 focus:bg-white transition-all text-slate-700" 
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Bio</label>
                <textarea 
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold focus:border-blue-500 focus:bg-white transition-all text-slate-700 resize-none font-medium"
                  placeholder="Tell others about yourself..."
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Upload or Select Profile Avatar</label>
                
                {/* Current / Selected Preview + Upload Button */}
                <div className="flex items-center gap-4 mb-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <img src={editAvatar || '/MorP.jpg'} alt="Selected Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md shrink-0" />
                  <div>
                    <input 
                      type="file" 
                      ref={avatarInputRef} 
                      accept="image/*" 
                      onChange={(e) => e.target.files && e.target.files[0] && handleAvatarUpload(e.target.files[0])} 
                      className="hidden" 
                    />
                    <button 
                      type="button" 
                      onClick={() => avatarInputRef.current?.click()} 
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer border-none"
                    >
                      <FaUpload /> Upload Photo
                    </button>
                    <span className="block text-[11px] text-slate-400 font-medium mt-1">Supports PNG, JPG, or WEBP</span>
                  </div>
                </div>

                <label className="block text-[11px] font-bold text-slate-500 mb-2">Or pick from Moroccan presets:</label>
                <div className="flex gap-4">
                  {['/MorP.jpg', '/Morocco.jpg', '/marrakech medina.jpg', '/sahara-desert-maroc-marrocain-8.webp'].map((img) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setEditAvatar(img)}
                      className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${editAvatar === img ? 'border-blue-600 scale-110 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'} cursor-pointer`}
                    >
                      <img src={img} alt="Avatar option" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-3.5 rounded-xl text-sm bg-white cursor-pointer"
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

export default Profile;