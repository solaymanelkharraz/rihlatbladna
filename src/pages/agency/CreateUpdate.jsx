import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { 
  FaCamera, 
  FaPaperPlane, 
  FaUpload, 
  FaCheckCircle, 
  FaTrash, 
  FaEye, 
  FaChartBar, 
  FaPlus, 
  FaClock, 
  FaBullhorn, 
  FaSpinner,
  FaLayerGroup
} from 'react-icons/fa';

const AgencyCreateUpdatePage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab'); // 'publish' or 'manage'
  const typeParam = searchParams.get('type'); // 'post' or 'story'

  const { user, showAlert, sharePost, shareStory, getMyStories, deleteStory } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState(tabParam === 'manage' ? 'manage' : 'publish'); // 'publish' | 'manage'
  const [updateType, setUpdateType] = useState(typeParam === 'story' ? 'story' : 'post'); // 'post' | 'story'
  const [textContent, setTextContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Stories management state
  const [myStoriesList, setMyStoriesList] = useState([]);
  const [loadingStories, setLoadingStories] = useState(false);

  useEffect(() => {
    if (tabParam === 'manage') setActiveTab('manage');
    if (typeParam === 'story') setUpdateType('story');
  }, [tabParam, typeParam]);

  const fetchStories = async () => {
    if (!getMyStories) return;
    setLoadingStories(true);
    const res = await getMyStories();
    if (res && res.success) {
      setMyStoriesList(res.stories || []);
    }
    setLoadingStories(false);
  };

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchStories();
    }
  }, [activeTab]);

  // Handle local image file upload using FileReader
  const handleFileUpload = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      showAlert("Invalid File", "Please choose a valid image file (PNG, JPG, WEBP).", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 1000;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) { height = Math.round((height * MAX_SIZE) / width); width = MAX_SIZE; }
        } else {
          if (height > MAX_SIZE) { width = Math.round((width * MAX_SIZE) / height); height = MAX_SIZE; }
        }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, width, height);
        setImageUrl(canvas.toDataURL('image/jpeg', 0.85));
        showAlert("Image Loaded", "Your image is ready for publication!", "success");
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handlePublishSubmit = async (e) => {
    e.preventDefault();
    if (!textContent.trim() && updateType === 'post') {
      showAlert("Validation Error", "Please write a caption or announcement text first!", "error");
      return;
    }

    const finalImage = imageUrl.trim() || "/Sahara Desert Adventure.jpg";

    if (updateType === 'post') {
      const res = await sharePost({
        content: textContent.trim(),
        image: finalImage,
        offerLinkId: null
      });
      if (res.success) {
        showAlert("Success", "Successfully published your new Instagram-style feed post! 🚀", "success");
        navigate('/agency/posts');
      }
    } else {
      const res = await shareStory(finalImage);
      if (res.success) {
        showAlert("Success", "Successfully published your 24h Story! 📣", "success");
        setImageUrl('');
        setTextContent('');
        setActiveTab('manage');
      }
    }
  };

  const handleRemoveStory = async (storyId) => {
    if (!window.confirm("Are you sure you want to remove this 24h story? It will no longer be visible to travelers.")) {
      return;
    }
    const res = await deleteStory(storyId);
    if (res && res.success) {
      showAlert("Removed", "Story removed successfully!", "success");
      setMyStoriesList(res.stories || []);
    } else {
      showAlert("Error", "Could not delete story at this time.", "error");
    }
  };

  const totalStoryViews = user?.storyViewsCount || myStoriesList.reduce((acc, s) => acc + (s.viewsCount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex selection:bg-blue-500 selection:text-white">
      <Sidebar />

      <div className="flex-1 lg:ml-64 pt-24 pb-12 px-6 lg:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto animate-fade-in-up">
          
          {/* Header Title */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <FaCamera className="text-blue-600" /> Stories & Social Feed Manager
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Publish daily stories, create community feed announcements, track traveler view counts, and manage active stories.
              </p>
            </div>

            {/* Top Level Hub Switcher */}
            <div className="flex bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300/60 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('publish')}
                className={`px-5 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer border-none flex items-center gap-2 ${
                  activeTab === 'publish' 
                    ? 'bg-white text-blue-600 shadow-md scale-102' 
                    : 'text-slate-600 hover:text-slate-900 bg-transparent'
                }`}
              >
                <FaPlus /> Publish New
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('manage')}
                className={`px-5 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer border-none flex items-center gap-2 ${
                  activeTab === 'manage' 
                    ? 'bg-white text-amber-600 shadow-md scale-102' 
                    : 'text-slate-600 hover:text-slate-900 bg-transparent'
                }`}
              >
                <FaEye /> Manage Stories ({myStoriesList.length || (user?.storyImage ? 1 : 0)})
              </button>
            </div>
          </div>

          {/* ==================== TAB 1: PUBLISH COMPOSER ==================== */}
          {activeTab === 'publish' && (
            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 mb-8 animate-fade-in">
              <form onSubmit={handlePublishSubmit} className="space-y-6">
                
                {/* Header with Type selector */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 pb-6 gap-4">
                  <div className="flex items-center gap-3.5">
                    <img src={user?.avatar || '/MorP.jpg'} alt="Agency Avatar" className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">{user?.name || 'Your Agency'}</h3>
                      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        {updateType === 'post' ? 'Publishing to Community Feed' : 'Publishing to 24h Stories Bar'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Toggle tabs */}
                  <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/80 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setUpdateType('post')}
                      className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border-none ${
                        updateType === 'post' 
                          ? 'bg-white text-blue-600 shadow-sm font-black scale-102' 
                          : 'text-slate-500 hover:text-slate-800 bg-transparent'
                      }`}
                    >
                      Feed Post
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpdateType('story')}
                      className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border-none ${
                        updateType === 'story' 
                          ? 'bg-white text-blue-600 shadow-sm font-black scale-102' 
                          : 'text-slate-500 hover:text-slate-800 bg-transparent'
                      }`}
                    >
                      24h Story
                    </button>
                  </div>
                </div>

                {/* Input box for Post Caption */}
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                    {updateType === 'post' ? 'Caption / Post Content' : 'Story Caption (Optional)'}
                  </label>
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder={updateType === 'post' ? "Write a caption for your community feed post..." : "Add a brief note for your 24h story..."}
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 placeholder-slate-400 font-medium text-sm outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
                    required={updateType === 'post'}
                  />
                </div>

                {/* REAL FILE UPLOAD DROPZONE */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-2"><FaUpload className="text-blue-500" /> Upload Custom Photo from Your Device</span>
                    {imageUrl && (
                      <button 
                        type="button" 
                        onClick={() => setImageUrl('')} 
                        className="text-red-500 hover:text-red-600 text-xs font-bold flex items-center gap-1 bg-transparent border-none cursor-pointer"
                      >
                        <FaTrash /> Remove Photo
                      </button>
                    )}
                  </label>
                  
                  {/* Drag and drop upload area */}
                  <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                      isDragging 
                        ? 'border-blue-500 bg-blue-50/60 scale-102' 
                        : 'border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-slate-100/60'
                    }`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={(e) => e.target.files && e.target.files[0] && handleFileUpload(e.target.files[0])}
                      className="hidden"
                    />
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-blue-600 text-2xl mx-auto mb-3">
                      <FaUpload />
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-sm mb-1">Click to browse or drag & drop image file</h4>
                    <p className="text-slate-400 text-xs">Supports PNG, JPG, WEBP, or GIF from your computer or phone</p>
                  </div>

                  {/* Optional Image URL Input */}
                  <div className="pt-2">
                    <input 
                      type="text"
                      value={imageUrl.startsWith('data:image') ? 'Uploaded Custom Photo (Ready to publish)' : imageUrl}
                      onChange={(e) => !imageUrl.startsWith('data:image') && setImageUrl(e.target.value)}
                      readOnly={imageUrl.startsWith('data:image')}
                      placeholder="Or enter direct image URL (e.g. https://...)"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-semibold focus:border-blue-500 focus:bg-white transition-all text-slate-700"
                    />
                  </div>

                  {/* Photo Preview Card */}
                  {imageUrl && (
                    <div className="mt-4 p-4 bg-slate-100/70 rounded-2xl border border-slate-200/60 max-w-md">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                          <FaCheckCircle className="text-green-500" /> Image Ready
                        </span>
                      </div>
                      <div className="h-64 rounded-xl overflow-hidden bg-slate-200 border border-slate-300/60 shadow-sm">
                        <img src={imageUrl} alt="Selected cover" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Publish button */}
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all cursor-pointer border-none text-sm flex items-center gap-2"
                  >
                    <FaPaperPlane /> {updateType === 'post' ? 'Publish to Community Feed' : 'Publish 24h Story'}
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* ==================== TAB 2: MANAGE STORIES & ANALYTICS ==================== */}
          {activeTab === 'manage' && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Analytics Banner */}
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-[2.5rem] p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/15 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="space-y-2 z-10">
                  <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                    <FaChartBar className="text-amber-200" /> Story Views & Reach Analytics
                  </div>
                  <h2 className="text-3xl font-black tracking-tight">Track Your Story Engagement</h2>
                  <p className="text-amber-100 text-sm max-w-xl font-medium">
                    Monitor how many travelers view your daily updates and remove stories whenever you want.
                  </p>
                </div>

                <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-[2rem] p-6 text-center shrink-0 min-w-[180px] z-10 shadow-lg">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-100 block mb-1">Total Traveler Views</span>
                  <div className="text-4xl font-black flex items-center justify-center gap-2">
                    <FaEye className="text-2xl text-amber-200" /> {totalStoryViews}
                  </div>
                </div>
              </div>

              {/* Stories List / Grid */}
              <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
                <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-8">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
                      <FaLayerGroup className="text-amber-500" /> Your Active & Recent Stories
                    </h3>
                    <p className="text-slate-500 text-xs mt-0.5">Click any story to review views count or remove it immediately.</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setActiveTab('publish'); setUpdateType('story'); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer border-none"
                  >
                    <FaPlus /> + Add New Story
                  </button>
                </div>

                {loadingStories ? (
                  <div className="py-20 text-center text-slate-400 font-bold flex flex-col items-center gap-3">
                    <FaSpinner className="text-3xl animate-spin text-blue-500" />
                    <span>Loading your stories and analytics...</span>
                  </div>
                ) : myStoriesList.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myStoriesList.map((story) => (
                      <div 
                        key={story.id}
                        className="bg-slate-50 border border-slate-200 rounded-[2rem] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-lg transition-all group"
                      >
                        {/* Image Preview Area */}
                        <div className="h-64 relative overflow-hidden bg-slate-900">
                          <img src={story.imageUrl || '/Sahara Desert Adventure.jpg'} alt="Story Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>

                          {/* Live Indicator Badge */}
                          <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span> Active Story
                          </div>

                          {/* Views Count Pill Inside Image */}
                          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
                            <span className="bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-2 border border-white/10 shadow-md">
                              <FaEye className="text-amber-400 text-sm" /> {story.viewsCount} travelers viewed
                            </span>
                          </div>
                        </div>

                        {/* Card Footer actions */}
                        <div className="p-5 flex flex-col justify-between gap-4 bg-white border-t border-slate-100 flex-1">
                          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold">
                            <FaClock className="text-slate-400" />
                            <span>Published on {new Date(story.createdAt || Date.now()).toLocaleDateString()} at {new Date(story.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveStory(story.id)}
                            className="w-full bg-red-50 hover:bg-red-500 text-red-600 hover:text-white font-extrabold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-red-200/80 active:scale-95"
                          >
                            <FaTrash /> Remove Story
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center max-w-md mx-auto">
                    <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center text-3xl mx-auto mb-4 border border-amber-200/60 shadow-sm">
                      <FaCamera />
                    </div>
                    <h4 className="text-xl font-extrabold text-slate-800 mb-2">No Active Stories Found</h4>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                      You haven't published any 24-hour stories yet. Stories appear at the very top of the traveler community page and boost your daily views!
                    </p>
                    <button
                      type="button"
                      onClick={() => { setActiveTab('publish'); setUpdateType('story'); }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer border-none text-xs flex items-center gap-2 mx-auto"
                    >
                      <FaPlus /> + Publish Your First 24h Story
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AgencyCreateUpdatePage;
