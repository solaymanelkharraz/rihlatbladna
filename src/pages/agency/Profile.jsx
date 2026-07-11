import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { FaMapMarkerAlt, FaCheck, FaExternalLinkAlt } from 'react-icons/fa';

const AgencyProfilePage = () => {
  const { user, showAlert, updateProfile } = useAuth();

  // Individual field inline edit states
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isEditingCover, setIsEditingCover] = useState(false);

  const [editName, setEditName] = useState(user?.name || '');
  const [editLocation, setEditLocation] = useState(user?.location || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '');
  const [editCover, setEditCover] = useState(user?.cover || '');

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditLocation(user.location || '');
      setEditBio(user.bio || '');
      setEditAvatar(user.avatar || '');
      setEditCover(user.cover || '');
    }
  }, [user]);

  const handleSaveName = async () => {
    if (!editName.trim()) return;
    const success = await updateProfile(editName.trim(), user.location, user.avatar, user.cover, user.bio);
    if (success) {
      setIsEditingName(false);
      showAlert("Success", "Agency name updated successfully!", "success");
    }
  };

  const handleSaveLocation = async () => {
    if (!editLocation.trim()) return;
    const success = await updateProfile(user.name, editLocation.trim(), user.avatar, user.cover, user.bio);
    if (success) {
      setIsEditingLocation(false);
      showAlert("Success", "Location updated successfully!", "success");
    }
  };

  const handleSaveBio = async () => {
    const success = await updateProfile(user.name, user.location, user.avatar, user.cover, editBio.trim());
    if (success) {
      setIsEditingBio(false);
      showAlert("Success", "Bio description updated successfully!", "success");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex selection:bg-blue-500 selection:text-white">
      <Sidebar />

      <div className="flex-1 lg:ml-64 pt-24 pb-12 px-6 lg:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto animate-fade-in-up">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Agency Profile Settings</h1>
              <p className="text-slate-500 text-sm mt-1">Manage your brand appearance, banner cover, and public details.</p>
            </div>
            {user && (
              <Link
                to={`/agency/${user.id}`}
                target="_blank"
                className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
              >
                <span>View Public Page</span>
                <FaExternalLinkAlt className="text-[10px]" />
              </Link>
            )}
          </div>

          {/* --- INLINE PROFILE EDITOR CARD --- */}
          <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden mb-10 relative">
            {/* Cover Banner */}
            <div className="relative h-64 w-full bg-slate-200">
              <img src={user?.cover || '/morocco1.jpg'} alt="Agency Cover" className="w-full h-full object-cover animate-fade-in" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
              
              <button 
                onClick={() => setIsEditingCover(!isEditingCover)}
                className="absolute top-6 right-6 bg-white/90 backdrop-blur-md hover:bg-white text-slate-800 font-bold px-4 py-2 rounded-xl text-xs shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border-none flex items-center gap-1.5"
              >
                ✏️ Change Cover Banner
              </button>

              {/* Cover Banner Inline Choice List */}
              {isEditingCover && (
                <div className="absolute inset-x-0 bottom-0 bg-black/70 backdrop-blur-md p-4 flex flex-col sm:flex-row justify-between items-center z-20 gap-3">
                  <div className="flex gap-2.5 overflow-x-auto pb-1 max-w-full">
                    {['/morocco1.jpg', '/Sahara Desert Adventure.jpg', '/Chefchaouen-tours.jpg', '/Fes.jpg'].map((img) => (
                      <button
                        key={img}
                        type="button"
                        onClick={async () => {
                          const success = await updateProfile(user.name, user.location, user.avatar, img, user.bio);
                          if (success) {
                            setIsEditingCover(false);
                            showAlert("Success", "Cover banner updated!", "success");
                          }
                        }}
                        className={`relative h-12 w-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${user?.cover === img ? 'border-amber-400 scale-105 shadow' : 'border-transparent opacity-60 hover:opacity-100'} cursor-pointer`}
                      >
                        <img src={img} alt="Cover option" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setIsEditingCover(false)} className="text-white hover:text-red-400 font-bold text-xs bg-transparent border-none cursor-pointer px-3 py-1">Close</button>
                </div>
              )}
            </div>

            {/* Profile Info Row */}
            <div className="px-8 pb-8 pt-0 relative flex flex-col md:flex-row md:items-end gap-6">
              {/* Avatar Logo overlay with direct hover edit button */}
              <div className="relative w-32 h-32 rounded-[2.25rem] overflow-hidden border-4 border-white bg-white shadow-xl flex-shrink-0 -mt-16 z-10 group/avatar">
                <img src={user?.avatar || '/MorP.jpg'} alt="Agency Avatar" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setIsEditingAvatar(!isEditingAvatar)} 
                  className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer border-none text-xs font-bold"
                >
                  Change Logo
                </button>
              </div>

              {/* Avatar Inline Choice List Popover */}
              {isEditingAvatar && (
                <div className="absolute left-8 top-20 bg-white border border-slate-200 rounded-2xl p-4 shadow-xl z-20 flex flex-col gap-2.5 animate-fade-in w-72">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Select Agency Logo:</span>
                  <div className="flex gap-2">
                    {['/MorP.jpg', '/Morocco.jpg', '/marrakech medina.jpg', '/sahara-desert-maroc-marrocain-8.webp'].map((img) => (
                      <button
                        key={img}
                        type="button"
                        onClick={async () => {
                          const success = await updateProfile(user.name, user.location, img, user.cover, user.bio);
                          if (success) {
                            setIsEditingAvatar(false);
                            showAlert("Success", "Avatar logo updated!", "success");
                          }
                        }}
                        className={`relative w-11 h-11 rounded-full overflow-hidden border-2 transition-all ${user?.avatar === img ? 'border-blue-600 scale-105' : 'border-transparent opacity-60 hover:opacity-100'} cursor-pointer`}
                      >
                        <img src={img} alt="Avatar Logo option" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setIsEditingAvatar(false)} className="text-[10px] text-red-500 font-bold border-none bg-transparent cursor-pointer text-left mt-1">Cancel</button>
                </div>
              )}

              {/* Text Fields with Edit Pen Icons */}
              <div className="flex-grow pt-4 md:pt-0 pb-2">
                
                {/* Agency Name */}
                <div className="flex flex-wrap items-center gap-3">
                  {isEditingName ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={editName} 
                        onChange={(e) => setEditName(e.target.value)} 
                        className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-lg outline-none focus:border-blue-500"
                        required
                      />
                      <button onClick={handleSaveName} className="p-2 text-green-600 hover:bg-green-50 rounded-xl cursor-pointer border-none bg-transparent"><FaCheck /></button>
                      <button onClick={() => { setEditName(user?.name); setIsEditingName(false); }} className="p-2 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer border-none bg-transparent">✕</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group/name">
                      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{user?.name}</h1>
                      <button onClick={() => setIsEditingName(true)} className="opacity-0 group-hover/name:opacity-100 p-1.5 text-slate-400 hover:text-slate-700 transition-opacity cursor-pointer border-none bg-transparent text-sm" title="Edit Name">✏️</button>
                      <span className="bg-blue-50 text-blue-600 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">★ Verified Agency</span>
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="mt-1.5">
                  {isEditingLocation ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={editLocation} 
                        onChange={(e) => setEditLocation(e.target.value)} 
                        className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
                        required
                      />
                      <button onClick={handleSaveLocation} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg cursor-pointer border-none bg-transparent"><FaCheck /></button>
                      <button onClick={() => { setEditLocation(user?.location); setIsEditingLocation(false); }} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer border-none bg-transparent">✕</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group/loc">
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <FaMapMarkerAlt className="text-blue-500" /> {user?.location || 'Morocco'}
                      </p>
                      <button onClick={() => setIsEditingLocation(true)} className="opacity-0 group-hover/loc:opacity-100 p-1 text-slate-400 hover:text-slate-700 transition-opacity cursor-pointer border-none bg-transparent text-[10px]" title="Edit Location">✏️</button>
                    </div>
                  )}
                </div>

                {/* Bio Description */}
                <div className="mt-3">
                  {isEditingBio ? (
                    <div className="flex items-start gap-2 max-w-2xl">
                      <textarea 
                        value={editBio} 
                        onChange={(e) => setEditBio(e.target.value)} 
                        rows="3"
                        className="flex-grow px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-blue-500 resize-none"
                      />
                      <div className="flex flex-col gap-1">
                        <button onClick={handleSaveBio} className="p-2 text-green-600 hover:bg-green-50 rounded-xl cursor-pointer border-none bg-transparent"><FaCheck /></button>
                        <button onClick={() => { setEditBio(user?.bio); setIsEditingBio(false); }} className="p-2 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer border-none bg-transparent">✕</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 group/bio max-w-2xl">
                      <p className="text-slate-600 font-medium text-sm leading-relaxed">{user?.bio || 'No description provided yet. Hover to add your agency bio.'}</p>
                      <button onClick={() => setIsEditingBio(true)} className="opacity-0 group-hover/bio:opacity-100 p-1 text-slate-400 hover:text-slate-700 transition-opacity cursor-pointer border-none bg-transparent text-xs" title="Edit Bio">✏️</button>
                    </div>
                  )}
                </div>

                {/* --- FOLLOWERS & RATING STATS BAR --- */}
                <div className="flex flex-wrap items-center gap-3.5 mt-5 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2.5 bg-blue-50/80 border border-blue-200/60 px-4 py-2 rounded-2xl">
                    <span className="text-xl">👥</span>
                    <div>
                      <span className="block text-[10px] font-black text-blue-500 uppercase tracking-wider">Total Followers</span>
                      <span className="text-sm font-black text-blue-950">{(user?.followersCount || 0).toLocaleString()} travelers</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 bg-amber-50/80 border border-amber-200/60 px-4 py-2 rounded-2xl">
                    <span className="text-xl">★</span>
                    <div>
                      <span className="block text-[10px] font-black text-amber-600 uppercase tracking-wider">Client Rating</span>
                      <span className="text-sm font-black text-amber-950">{user?.rating || '4.9'} / 5.0</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 bg-emerald-50/80 border border-emerald-200/60 px-4 py-2 rounded-2xl">
                    <span className="text-xl">🛡️</span>
                    <div>
                      <span className="block text-[10px] font-black text-emerald-600 uppercase tracking-wider">Account Tier</span>
                      <span className="text-sm font-black text-emerald-950">Verified Expert</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Quick Guidance Box */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-extrabold text-blue-900 text-base">Profile Tips</h4>
              <p className="text-blue-700 text-xs mt-1">Your profile details appear on every tour offer you publish. High-quality cover banners and complete bios increase client inquiry rates by up to 40%.</p>
            </div>
            <Link to="/agency/create-offer" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all shrink-0">
              + Publish New Offer
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AgencyProfilePage;
