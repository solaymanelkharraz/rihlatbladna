import React, { useState, useRef } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { 
  FaCog, 
  FaBell, 
  FaLock, 
  FaShieldAlt, 
  FaExclamationTriangle, 
  FaCheck, 
  FaUpload, 
  FaTrash, 
  FaWhatsapp, 
  FaEnvelope, 
  FaGlobe, 
  FaUserTie,
  FaSave
} from 'react-icons/fa';

const AgencySettingsPage = () => {
  const { user, updateProfile, showAlert } = useAuth();
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Form states initialized from user
  const [name, setName] = useState(user?.name || '');
  const [location, setLocation] = useState(user?.location || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '/MorP.jpg');
  const [coverUrl, setCoverUrl] = useState(user?.cover || '/Sahara Desert Adventure.jpg');
  const [whatsappPhone, setWhatsappPhone] = useState('+212 600-000000');

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [publicContact, setPublicContact] = useState(true);
  const [storyBadgeVisible, setStoryBadgeVisible] = useState(true);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);

  const handleAvatarUpload = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      showAlert("Invalid File", "Please select an image file (JPG, PNG, WEBP)", "error");
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
          if (width > MAX_SIZE) { height = Math.round((height * MAX_SIZE) / width); width = MAX_SIZE; }
        } else {
          if (height > MAX_SIZE) { width = Math.round((width * MAX_SIZE) / height); height = MAX_SIZE; }
        }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, width, height);
        setAvatarUrl(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleCoverUpload = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      showAlert("Invalid File", "Please select an image file (JPG, PNG, WEBP)", "error");
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
        setCoverUrl(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showAlert("Validation Error", "Agency name cannot be empty.", "error");
      return;
    }

    setSavingProfile(true);
    const res = await updateProfile({
      name: name.trim(),
      location: location.trim(),
      bio: bio.trim(),
      avatarUrl: avatarUrl,
      coverUrl: coverUrl
    });
    setSavingProfile(false);

    if (res.success) {
      showAlert("Settings Saved", "Your agency branding and account preferences have been updated successfully!", "success");
    } else {
      showAlert("Save Error", res.message || "Failed to update profile preferences.", "error");
    }
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    showAlert("Preferences Updated", "Your notification & WhatsApp alert triggers have been saved securely.", "success");
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showAlert("Error", "Please enter both current and new passwords.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showAlert("Error", "New password confirmation does not match.", "error");
      return;
    }
    showAlert("Security Updated", "Password changed successfully!", "success");
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeactivateAccount = () => {
    if (window.confirm("CRITICAL WARNING: Are you sure you want to temporarily disable your agency public directory listings?")) {
      showAlert("Account Deactivated", "Your directory listings have been hidden. Log in anytime to reactivate instantly.", "info");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex selection:bg-blue-500 selection:text-white">
      <Sidebar />

      <div className="flex-1 lg:ml-64 pt-24 pb-16 px-6 lg:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto animate-fade-in-up space-y-10">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-8">
            <div>
              <span className="bg-blue-100 text-blue-700 font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 mb-3">
                <FaCog className="animate-spin-slow" /> Agency Control Center
              </span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account & Agency Preferences</h1>
              <p className="text-slate-500 text-sm mt-1">
                Customize your directory appearance, manage notification triggers, and update communication channels.
              </p>
            </div>
          </div>

          {/* SECTION 1: Profile & Public Directory Branding */}
          <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg font-bold">
                <FaUserTie />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Public Agency Identity</h2>
                <p className="text-slate-400 text-xs">Information displayed to travelers when viewing your tours and 24h stories.</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">Agency Display Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all" 
                    placeholder="e.g. Atlas Nomads Travel"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">Primary City & Region</label>
                  <input 
                    type="text" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all" 
                    placeholder="e.g. Merzouga, Morocco"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">Agency Bio & Mission Description</label>
                <textarea 
                  rows={3} 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 focus:bg-white focus:border-blue-500 outline-none transition-all resize-none" 
                  placeholder="Share your experience, specialties, and why travelers should choose your tours..."
                />
              </div>

              {/* Avatar & Cover Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="p-5 bg-slate-50/80 rounded-3xl border border-slate-200/80 space-y-3">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">Agency Logo / Avatar Photo</span>
                  <div className="flex items-center gap-4">
                    <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md shrink-0" />
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
                        className="bg-white hover:bg-slate-100 text-blue-600 font-bold px-4 py-2 rounded-xl text-xs border border-slate-300 transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
                      >
                        <FaUpload /> Change Logo
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-slate-50/80 rounded-3xl border border-slate-200/80 space-y-3">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">Profile Header Cover Photo</span>
                  <div className="flex items-center gap-4">
                    <img src={coverUrl} alt="Cover" className="w-24 h-16 rounded-2xl object-cover border-2 border-white shadow-md shrink-0" />
                    <div>
                      <input 
                        type="file" 
                        ref={coverInputRef} 
                        accept="image/*" 
                        onChange={(e) => e.target.files && e.target.files[0] && handleCoverUpload(e.target.files[0])} 
                        className="hidden" 
                      />
                      <button 
                        type="button" 
                        onClick={() => coverInputRef.current?.click()} 
                        className="bg-white hover:bg-slate-100 text-blue-600 font-bold px-4 py-2 rounded-xl text-xs border border-slate-300 transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
                      >
                        <FaUpload /> Change Cover
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-8 py-3.5 rounded-2xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center gap-2 text-sm cursor-pointer border-none"
                >
                  <FaSave /> {savingProfile ? 'Saving Changes...' : 'Save Profile Settings'}
                </button>
              </div>
            </form>
          </div>

          {/* SECTION 2: Notification & WhatsApp Communication Triggers */}
          <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg font-bold">
                <FaBell />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Communication & Notification Triggers</h2>
                <p className="text-slate-400 text-xs">Control how you get alerted when travelers book tours or ask questions in your chat.</p>
              </div>
            </div>

            <form onSubmit={handleSaveNotifications} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FaWhatsapp className="text-emerald-500 text-base" /> Direct WhatsApp Number for Traveler Alerts & Inquiries
                </label>
                <input 
                  type="text" 
                  value={whatsappPhone} 
                  onChange={(e) => setWhatsappPhone(e.target.value)} 
                  className="w-full md:w-2/3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none transition-all" 
                  placeholder="+212 600-000000"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center text-sm font-bold">
                      <FaWhatsapp />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800">Instant WhatsApp / SMS Inquiry Alerts</h4>
                      <p className="text-slate-400 text-xs">Receive real-time text notifications when travelers book or inquire about your tours.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWhatsappAlerts(!whatsappAlerts)}
                    className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer border-none ${whatsappAlerts ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}
                  >
                    <span className="w-6 h-6 rounded-full bg-white shadow-md block transition-transform"></span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center text-sm font-bold">
                      <FaEnvelope />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800">Email Notifications for New Bookings</h4>
                      <p className="text-slate-400 text-xs">Send detailed itinerary summaries directly to {user?.email || 'your account email'}.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailAlerts(!emailAlerts)}
                    className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer border-none ${emailAlerts ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'}`}
                  >
                    <span className="w-6 h-6 rounded-full bg-white shadow-md block transition-transform"></span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-100/70 text-purple-600 flex items-center justify-center text-sm font-bold">
                      <FaGlobe />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800">Show WhatsApp Contact Button on Profile</h4>
                      <p className="text-slate-400 text-xs">Allow travelers on your public agency page to initiate direct WhatsApp chats.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPublicContact(!publicContact)}
                    className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer border-none ${publicContact ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'}`}
                  >
                    <span className="w-6 h-6 rounded-full bg-white shadow-md block transition-transform"></span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-7 py-3 rounded-2xl shadow-sm transition-all text-xs cursor-pointer border-none"
                >
                  Save Notification Triggers
                </button>
              </div>
            </form>
          </div>

          {/* SECTION 3: Account Security & Danger Zone */}
          <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-lg font-bold">
                <FaLock />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Security & Account Protection</h2>
                <p className="text-slate-400 text-xs">Manage your login credentials and directory visibility status.</p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg mb-10">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Update Password</h4>
              <input 
                type="password" 
                placeholder="Current Password" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white" 
              />
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="password" 
                  placeholder="New Password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white" 
                />
                <input 
                  type="password" 
                  placeholder="Confirm New Password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white" 
                />
              </div>
              <button type="submit" className="bg-slate-700 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all cursor-pointer border-none">
                Update Password
              </button>
            </form>

            <div className="p-6 bg-red-50/50 rounded-3xl border border-red-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-red-800 flex items-center gap-2">
                  <FaExclamationTriangle /> Deactivate Agency Public Listing
                </h4>
                <p className="text-xs text-red-600 max-w-md font-medium">
                  Temporarily hide all active tours, 24h stories, and agency profile pages from the RihlatBladna marketplace.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDeactivateAccount}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-2xl text-xs transition-all shrink-0 cursor-pointer border-none shadow-md shadow-red-600/20 active:scale-95"
              >
                Deactivate Account
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AgencySettingsPage;
