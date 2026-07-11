import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, toursAPI, agenciesAPI, postsAPI, bookingsAPI, chatsAPI, adminAPI, uploadAPI } from '../api/endpoints';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Global Data States
  const [tours, setTours] = useState([]);
  const [posts, setPosts] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [chats, setChats] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);

  // Alert Dialog State
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showAlert = (title, message, type = 'info') => {
    setAlertConfig({
      isOpen: true,
      title,
      message,
      type
    });
  };

  const closeAlert = () => {
    setAlertConfig(prev => ({ ...prev, isOpen: false }));
  };

  // Refresher Actions
  const fetchTours = async () => {
    try {
      const data = await toursAPI.getAll();
      setTours(data);
    } catch (err) {
      console.error('Error fetching tours:', err);
    }
  };

  const fetchPosts = async () => {
    try {
      const data = await postsAPI.getAll();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const fetchAgencies = async () => {
    try {
      const data = await agenciesAPI.getAll();
      setAgencies(data);
    } catch (err) {
      console.error('Error fetching agencies:', err);
    }
  };

  const fetchBookings = async () => {
    try {
      const data = await bookingsAPI.getAll();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const fetchChats = async () => {
    try {
      const data = await chatsAPI.getAll();
      setChats(data);
    } catch (err) {
      console.error('Error fetching chats:', err);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const data = await adminAPI.getUsers();
      setAdminUsers(data);
    } catch (err) {
      console.error('Error fetching admin users:', err);
    }
  };

  // Load initial data
  useEffect(() => {
    const initApp = async () => {
      setLoading(true);
      const token = localStorage.getItem('rb_token');
      
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.success) {
            setUser(res.user);
            localStorage.setItem('rb_current_user', JSON.stringify(res.user));
            // Fetch authenticated user's private data
            const fetches = [fetchBookings(), fetchChats()];
            if (res.user.role === 'admin') {
              fetches.push(fetchAdminUsers());
            }
            await Promise.all(fetches);
          }
        } catch (err) {
          console.error('Failed to restore session:', err);
          localStorage.removeItem('rb_token');
          localStorage.removeItem('rb_current_user');
          setUser(null);
        }
      }

      // Fetch public data
      await Promise.all([fetchTours(), fetchPosts(), fetchAgencies()]);
      setLoading(false);
    };

    initApp();
  }, []);

  // Authentication operations
  const login = async (email, password) => {
    try {
      const res = await authAPI.login(email, password);
      if (res.success) {
        localStorage.setItem('rb_token', res.token);
        localStorage.setItem('rb_current_user', JSON.stringify(res.user));
        setUser(res.user);
        
        // Load user's private data
        const fetches = [fetchBookings(), fetchChats()];
        if (res.user.role === 'admin') {
          fetches.push(fetchAdminUsers());
        }
        await Promise.all(fetches);
        return { success: true, user: res.user };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Invalid email or password';
      return { success: false, error: errMsg };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const res = await authAPI.register(name, email, password, role);
      if (res.success) {
        localStorage.setItem('rb_token', res.token);
        localStorage.setItem('rb_current_user', JSON.stringify(res.user));
        setUser(res.user);
        
        // Load user's private data
        const fetches = [fetchBookings(), fetchChats()];
        if (res.user.role === 'admin') {
          fetches.push(fetchAdminUsers());
        }
        await Promise.all(fetches);
        return { success: true, user: res.user };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed';
      return { success: false, error: errMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('rb_token');
    localStorage.removeItem('rb_current_user');
    setUser(null);
    setBookings([]);
    setChats([]);
    setAdminUsers([]);
  };

  // User Profile actions
  const updateProfile = async (nameOrObj, locationArg, avatarArg, coverArg, bioArg) => {
    try {
      let name = nameOrObj;
      let location = locationArg;
      let avatar = avatarArg;
      let cover = coverArg;
      let bio = bioArg;

      if (nameOrObj && typeof nameOrObj === 'object') {
        name = nameOrObj.name;
        location = nameOrObj.location;
        avatar = nameOrObj.avatar !== undefined ? nameOrObj.avatar : nameOrObj.avatarUrl;
        cover = nameOrObj.cover !== undefined ? nameOrObj.cover : nameOrObj.coverUrl;
        bio = nameOrObj.bio;
      }

      const payload = {
        name,
        location,
        avatar: avatar !== undefined ? avatar : undefined,
        avatarUrl: avatar !== undefined ? avatar : undefined,
        cover: cover !== undefined ? cover : undefined,
        coverUrl: cover !== undefined ? cover : undefined,
        bio
      };

      const res = await authAPI.updateProfile(payload);
      if (res.success) {
        setUser(res.user);
        localStorage.setItem('rb_current_user', JSON.stringify(res.user));
        await fetchAgencies(); // Reload agency lists in case user was an agency
        return { success: true };
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      showAlert('Update Error', err.response?.data?.message || 'Failed to update profile.', 'error');
      return { success: false };
    }
  };

  const adminDeleteUser = async (userId) => {
    try {
      const res = await adminAPI.deleteUser(userId);
      if (res.success) {
        await fetchAdminUsers();
        await fetchAgencies();
        return { success: true };
      }
    } catch (err) {
      console.error('Error admin deleting user:', err);
      showAlert('Deletion Error', err.response?.data?.message || 'Failed to delete user.', 'error');
      return { success: false };
    }
  };

  // Traveler Interactions
  const toggleFollowAgency = async (agencyId) => {
    if (!user || user.role !== 'traveler') return;

    try {
      const res = await agenciesAPI.toggleFollow(agencyId);
      if (res.success) {
        // Update user state followings
        const updatedUser = { ...user, followingAgencies: res.followingAgencies };
        setUser(updatedUser);
        localStorage.setItem('rb_current_user', JSON.stringify(updatedUser));
        await fetchAgencies(); // Reload rankings/followers
      }
    } catch (err) {
      console.error('Error toggling agency follow:', err);
    }
  };

  const toggleSaveTour = async (tourId) => {
    if (!user || user.role !== 'traveler') return;

    try {
      const res = await toursAPI.toggleWishlist(tourId);
      if (res.success) {
        // Update user state wishlist
        const updatedUser = { ...user, savedTours: res.savedTours };
        setUser(updatedUser);
        localStorage.setItem('rb_current_user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  const addInquiry = async (tourId, tourTitle, agencyId, agencyName, travelerPhone = '+212 600 000 000', guestsCount = 1) => {
    if (!user) return null;

    try {
      if (tourId === 'general') {
        const res = await chatsAPI.initiate(agencyId);
        if (res.success) {
          await fetchChats();
          return res.threadId;
        }
      } else {
        const res = await bookingsAPI.create({ tourId, travelerPhone, guestsCount });
        if (res.success) {
          await Promise.all([fetchBookings(), fetchChats()]);
          return res.threadId;
        }
      }
    } catch (err) {
      console.error('Error creating inquiry:', err);
    }
    return null;
  };

  const sendMessageToThread = async (threadId, text) => {
    if (!user) return;
    try {
      const res = await chatsAPI.sendMessage(threadId, text);
      if (res.success) {
        // Update chats in state
        setChats(prev => prev.map(c => c.id === threadId ? res.thread : c));
        return res.thread;
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  // Agency Specific Actions
  const createTour = async (tourData) => {
    try {
      const res = await toursAPI.create(tourData);
      if (res.success) {
        await fetchTours();
        return { success: true };
      }
    } catch (err) {
      console.error('Error creating tour:', err);
      showAlert('Creation Error', err.response?.data?.message || 'Failed to list tour.', 'error');
      return { success: false };
    }
  };

  const deleteTour = async (tourId) => {
    try {
      const res = await toursAPI.delete(tourId);
      if (res.success) {
        await fetchTours();
        return { success: true };
      }
    } catch (err) {
      console.error('Error deleting tour:', err);
      return { success: false };
    }
  };

  const uploadImage = async (file) => {
    try {
      const res = await uploadAPI.uploadImage(file);
      if (res.success) {
        return res.url;
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      showAlert('Upload Error', err.response?.data?.message || 'Failed to upload image.', 'error');
    }
    return null;
  };

  const updateTourStatus = async (tourId, statusData) => {
    try {
      const res = await toursAPI.update(tourId, statusData);
      if (res.success) {
        await fetchTours();
        return { success: true };
      }
    } catch (err) {
      console.error('Error updating tour:', err);
      return { success: false };
    }
  };

  const toggleBoostTour = async (tourId) => {
    try {
      const res = await toursAPI.toggleBoost(tourId);
      if (res.success) {
        await fetchTours();
        showAlert("Success", res.message || "Tour boost updated! 🚀", "success");
        return { success: true };
      }
    } catch (err) {
      console.error('Error toggling tour boost:', err);
      showAlert("Error", err.response?.data?.message || "Failed to update tour boost.", "error");
      return { success: false };
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const res = await bookingsAPI.updateStatus(bookingId, status);
      if (res.success) {
        setBookings(res.bookings);
        return { success: true };
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
      return { success: false };
    }
  };

  const sharePost = async (postData) => {
    try {
      const res = await postsAPI.create(postData);
      if (res.success) {
        await fetchPosts();
        return { success: true };
      }
    } catch (err) {
      console.error('Error sharing post:', err);
      return { success: false };
    }
  };

  const deletePost = async (postId) => {
    try {
      const res = await postsAPI.delete(postId);
      if (res.success) {
        await fetchPosts();
        return { success: true };
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      return { success: false };
    }
  };

  const updatePost = async (postId, postData) => {
    try {
      const res = await postsAPI.update(postId, postData);
      if (res.success) {
        await fetchPosts();
        return { success: true };
      }
    } catch (err) {
      console.error('Error updating post:', err);
      showAlert("Error", err.response?.data?.message || "Failed to edit post.", "error");
      return { success: false };
    }
  };

  const toggleLikePost = async (postId) => {
    try {
      const res = await postsAPI.toggleLike(postId);
      if (res.success) {
        // Update likes in local posts state
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: res.likes } : p));
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const addCommentToPost = async (postId, text) => {
    try {
      const res = await postsAPI.addComment(postId, text);
      if (res.success) {
        // Update comments in local posts state
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: res.comments } : p));
        return { success: true };
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      return { success: false };
    }
  };

  const deleteCommentFromPost = async (postId, commentId) => {
    try {
      const res = await postsAPI.deleteComment(postId, commentId);
      if (res.success) {
        // Update comments in local posts state
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: res.comments } : p));
        return { success: true };
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      showAlert("Error", err.response?.data?.message || "Failed to delete comment.", "error");
      return { success: false };
    }
  };

  const shareStory = async (storyImage) => {
    try {
      const res = await agenciesAPI.postStory(storyImage);
      if (res.success) {
        setUser(res.user);
        localStorage.setItem('rb_current_user', JSON.stringify(res.user));
        await fetchAgencies();
        return { success: true, story: res.story };
      }
    } catch (err) {
      console.error('Error sharing story:', err);
      return { success: false };
    }
  };

  const getMyStories = async () => {
    try {
      const res = await agenciesAPI.getMyStories();
      if (res.success) {
        return { success: true, stories: res.stories || [] };
      }
    } catch (err) {
      console.error('Error fetching stories:', err);
    }
    return { success: false, stories: [] };
  };

  const deleteStory = async (storyId = 'active') => {
    try {
      const res = await agenciesAPI.deleteStory(storyId);
      if (res.success) {
        if (res.user) {
          setUser(res.user);
          localStorage.setItem('rb_current_user', JSON.stringify(res.user));
        }
        await fetchAgencies();
        return { success: true, stories: res.stories || [] };
      }
    } catch (err) {
      console.error('Error deleting story:', err);
    }
    return { success: false };
  };

  const viewStory = async (agencyId, storyId) => {
    try {
      const res = await agenciesAPI.viewStory(agencyId, storyId);
      if (res.success) {
        await fetchAgencies();
      }
    } catch (err) {
      console.error('Error recording story view:', err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      tours,
      posts,
      agencies,
      bookings,
      chats,
      adminUsers,
      login,
      register,
      logout,
      updateProfile,
      toggleFollowAgency,
      toggleSaveTour,
      addInquiry,
      sendMessageToThread,
      createTour,
      deleteTour,
      updateTourStatus,
      toggleBoostTour,
      updateBookingStatus,
      sharePost,
      deletePost,
      updatePost,
      toggleLikePost,
      addCommentToPost,
      deleteCommentFromPost,
      shareStory,
      getMyStories,
      deleteStory,
      viewStory,
      adminDeleteUser,
      uploadImage,
      showAlert,
      refreshData: {
        tours: fetchTours,
        posts: fetchPosts,
        agencies: fetchAgencies,
        bookings: fetchBookings,
        chats: fetchChats,
        adminUsers: fetchAdminUsers
      }
    }}>
      {children}

      {/* Root Custom Premium Alert Modal */}
      {alertConfig.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop Overlay */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
            onClick={closeAlert}
          />
          
          {/* Modal Card */}
          <div className="relative bg-white border border-slate-100 rounded-[2.5rem] p-8 max-w-sm w-full shadow-[0_30px_70px_rgba(0,0,0,0.22)] z-10 text-center flex flex-col items-center animate-scale-up">
            
            {/* Close Button */}
            <button 
              onClick={closeAlert}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-650 transition-colors p-1.5 rounded-full hover:bg-slate-50 cursor-pointer border-none bg-transparent"
              aria-label="Close alert"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Premium Icon Header */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-6 shadow-md ${
              alertConfig.type === 'success' 
                ? 'bg-emerald-50 text-emerald-600 shadow-emerald-500/10' 
                : alertConfig.type === 'error'
                ? 'bg-rose-50 text-rose-600 shadow-rose-500/10'
                : 'bg-blue-50 text-blue-600 shadow-blue-500/10'
            }`}>
              {alertConfig.type === 'success' ? (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : alertConfig.type === 'error' ? (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>

            {/* Title */}
            <h3 className="font-extrabold text-2xl text-slate-900 mb-3 tracking-tight">
              {alertConfig.title}
            </h3>

            {/* Message Description */}
            <p className="text-slate-500 text-sm leading-relaxed mb-8 px-2">
              {alertConfig.message}
            </p>

            {/* Action button */}
            <button 
              onClick={closeAlert}
              className={`w-full font-bold py-3.5 px-6 rounded-2xl text-center text-sm shadow-md hover:shadow-lg transition-all cursor-pointer text-white border-none ${
                alertConfig.type === 'success'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                  : alertConfig.type === 'error'
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
              }`}
            >
              Understand
            </button>

          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
