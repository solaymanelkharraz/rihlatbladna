import api from './axios';

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // { success, token, user }
  },
  register: async (name, email, password, role, tourismLicenseNumber = null) => {
    const response = await api.post('/auth/register', { name, email, password, role, tourismLicenseNumber });
    return response.data; // { success, token, user }
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data; // { success, user }
  },
  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    return response.data; // { success, message, user }
  }
};

export const toursAPI = {
  getAll: async (filters = {}) => {
    const response = await api.get('/tours', { params: filters });
    return response.data; // array of tours
  },
  getById: async (id) => {
    const response = await api.get(`/tours/${id}`);
    return response.data; // tour details
  },
  create: async (data) => {
    const response = await api.post('/tours', data);
    return response.data; // { success, message, tour }
  },
  update: async (id, data) => {
    const response = await api.put(`/tours/${id}`, data);
    return response.data; // { success, message, tour }
  },
  delete: async (id) => {
    const response = await api.delete(`/tours/${id}`);
    return response.data; // { success, message }
  },
  toggleWishlist: async (id) => {
    const response = await api.post(`/tours/${id}/wishlist`);
    return response.data; // { success, saved, savedTours }
  },
  toggleBoost: async (id) => {
    const response = await api.put(`/tours/${id}/boost`);
    return response.data; // { success, message, tour }
  }
};

export const agenciesAPI = {
  getAll: async () => {
    const response = await api.get('/agencies');
    return response.data; // array of agencies
  },
  getById: async (id) => {
    const response = await api.get(`/agencies/${id}`);
    return response.data; // { success, agency, tours, posts, stories }
  },
  toggleFollow: async (id) => {
    const response = await api.post(`/agencies/${id}/follow`);
    return response.data; // { success, following, followingAgencies }
  },
  postStory: async (storyImage) => {
    const response = await api.post('/agencies/story', { storyImage });
    return response.data; // { success, message, user, story }
  },
  getMyStories: async () => {
    const response = await api.get('/agencies/stories/my');
    return response.data; // { success, stories }
  },
  deleteStory: async (storyId = 'active') => {
    const response = await api.delete(`/agencies/stories/${storyId}`);
    return response.data; // { success, message, user, stories }
  },
  viewStory: async (agencyId, storyId) => {
    const response = await api.post(`/agencies/${agencyId}/story/view`, { storyId });
    return response.data; // { success }
  }
};

export const postsAPI = {
  getAll: async () => {
    const response = await api.get('/posts');
    return response.data; // array of posts
  },
  create: async (data) => {
    const response = await api.post('/posts', data);
    return response.data; // { success, message, post }
  },
  toggleLike: async (id) => {
    const response = await api.post(`/posts/${id}/like`);
    return response.data; // { success, liked, likes }
  },
  addComment: async (id, text) => {
    const response = await api.post(`/posts/${id}/comment`, { text });
    return response.data; // { success, message, comments }
  },
  update: async (id, data) => {
    const response = await api.put(`/posts/${id}`, data);
    return response.data; // { success, message, post }
  },
  delete: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data; // { success, message }
  },
  deleteComment: async (postId, commentId) => {
    const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
    return response.data; // { success, message, comments }
  }
};

export const bookingsAPI = {
  getAll: async () => {
    const response = await api.get('/bookings');
    return response.data; // array of bookings
  },
  create: async (data) => {
    const response = await api.post('/bookings', data);
    return response.data; // { success, message, bookingId, threadId }
  },
  updateStatus: async (id, status) => {
    const response = await api.put(`/bookings/${id}/status`, { status });
    return response.data; // { success, message, bookings }
  }
};

export const chatsAPI = {
  getAll: async () => {
    const response = await api.get('/chats');
    return response.data; // array of threads
  },
  initiate: async (agencyId) => {
    const response = await api.post('/chats/initiate', { agencyId });
    return response.data; // { success, threadId, chatId }
  },
  sendMessage: async (threadId, text) => {
    const response = await api.post(`/chats/${threadId}/messages`, { text });
    return response.data; // { success, message, thread }
  }
};

export const adminAPI = {
  getUsers: async () => {
    const response = await api.get('/auth/users');
    return response.data; // array of users
  },
  deleteUser: async (id) => {
    const response = await api.delete(`/auth/users/${id}`);
    return response.data; // { success, message }
  },
  verifyAgency: async (id) => {
    const response = await api.put(`/auth/verify-agency/${id}`);
    return response.data; // { success, message }
  }
};

export const uploadAPI = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data; // { success, message, url }
  }
};

export const walletAPI = {
  topUp: async (amount) => {
    const response = await api.post('/wallet/topup', { amount });
    return response.data; // { success, message, credits }
  }
};

