// Database Layer using localStorage for RihlatBladna

const DEFAULT_USERS = [
  {
    id: "user_traveler",
    name: "Soulayman Elkharraz",
    email: "soulayman@example.com",
    password: "password123",
    role: "traveler",
    avatar: "https://i.pravatar.cc/150?u=soulayman",
    location: "Tangier, Morocco",
    savedTours: ["tour_1", "tour_2"],
    followingAgencies: ["agency_1"]
  },
  {
    id: "agency_1",
    name: "Atlas Nomads Travel",
    email: "sahara@travels.ma",
    password: "password123",
    role: "agency",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150",
    cover: "https://images.unsplash.com/photo-1542044896530-05d85be9b11a?q=80&w=1000",
    location: "Merzouga",
    followersCount: 12400,
    rating: 4.9,
    isVerified: true,
    storyImage: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=1000",
    storyCreatedAt: new Date().toISOString()
  },
  {
    id: "agency_2",
    name: "BlueCity Guides",
    email: "bluecity@travels.ma",
    password: "password123",
    role: "agency",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150",
    cover: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1000",
    location: "Chefchaouen",
    followersCount: 8900,
    rating: 4.8,
    isVerified: true
  },
  {
    id: "agency_3",
    name: "Marrakech Desert Star",
    email: "marrakech@travels.ma",
    password: "password123",
    role: "agency",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=150",
    cover: "https://plus.unsplash.com/premium_photo-1661962360706-538096f9c948?q=80&w=1000",
    location: "Marrakech",
    followersCount: 15100,
    rating: 5.0,
    isVerified: true
  },
  {
    id: "user_admin",
    name: "System Admin",
    email: "admin@rihlatbladna.ma",
    password: "password123",
    role: "admin",
    avatar: "https://i.pravatar.cc/150?u=admin"
  }
];

const DEFAULT_TOURS = [
  { 
    id: "tour_1", 
    title: "Luxury Sahara Desert Experience", 
    price: 1200, 
    location: "Merzouga Dunes", 
    duration: "3 Days", 
    rating: 4.9, 
    reviews: 124, 
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=800", 
    agencyId: "agency_1", 
    agencyName: "Atlas Nomads Travel", 
    description: "Experience the magic of the golden dunes. Includes private transport, luxury tent accommodation, camel trekking at sunset, and traditional Berber music around the fire. This is a journey that will stay with you forever.",
    included: ["Private 4x4 Transport", "Luxury Tent Accommodation", "Traditional Dinner & Breakfast", "Camel Trekking Experience", "Professional Local Guide"],
    notIncluded: ["Lunch Meals", "Personal Expenses", "Tips for Guides"],
    tags: ["Adventure", "Desert"], 
    status: "Active", 
    views: 342 
  },
  { 
    id: "tour_2", 
    title: "High Atlas Peaks & Berber Villages", 
    price: 1850, 
    location: "Imlil Valley", 
    duration: "4 Days", 
    rating: 5.0, 
    reviews: 64,
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800", 
    agencyId: "agency_1", 
    agencyName: "Atlas Nomads Travel", 
    description: "Trek through Berber villages in the High Atlas Mountains. Climb scenic passes, dine in authentic mountain homestays, and witness Toubkal summit views.",
    included: ["Guided trek", "Berber house lodging", "Meals during trek"],
    notIncluded: ["Sleeping bags", "Mule hire tips"],
    tags: ["Hiking", "Nature"], 
    status: "Active", 
    views: 540 
  },
  { 
    id: "tour_3", 
    title: "Blue Pearl Wandering Tour", 
    price: 750, 
    location: "Chefchaouen Medina", 
    duration: "2 Days", 
    rating: 4.8, 
    reviews: 88,
    image: "https://images.unsplash.com/photo-1548786811-dd6e453ccca7?q=80&w=800", 
    agencyId: "agency_2", 
    agencyName: "BlueCity Guides", 
    description: "Explore the blue-washed streets of Chefchaouen, nestled in the Rif mountains. Walk through the historic medina, take stunning photos, and enjoy traditional hospitality.",
    included: ["Round-trip transport", "Professional Local Guide", "Water bottle"],
    notIncluded: ["Lunch & dinner", "Entrance tickets"],
    tags: ["Culture", "Photography"], 
    status: "Active", 
    views: 125 
  },
  { 
    id: "tour_4", 
    title: "Akchour Waterfalls Day Hike", 
    price: 350, 
    location: "Rif Mountains", 
    duration: "1 Day", 
    rating: 4.7, 
    reviews: 32,
    image: "https://images.unsplash.com/photo-1509529711801-deac231925ac?q=80&w=800", 
    agencyId: "agency_2", 
    agencyName: "BlueCity Guides", 
    description: "Visit the stunning Akchour Cascades. Walk through beautiful mountain trails and see the God's Bridge natural rock arch.",
    included: ["Shared transport", "Local hiking guide"],
    notIncluded: ["Lunch at local cafes", "Tips"],
    tags: ["Nature", "Day Trip"], 
    status: "Active", 
    views: 189 
  },
  { 
    id: "tour_5", 
    title: "Marrakech Medina Secret Souks", 
    price: 300, 
    location: "Marrakech Medina", 
    duration: "1 Day", 
    rating: 4.7, 
    reviews: 156,
    image: "https://images.unsplash.com/photo-1597212618440-806262de4fe6?q=80&w=800", 
    agencyId: "agency_3", 
    agencyName: "Marrakech Desert Star", 
    description: "Navigate the vibrant, labyrinthine souks of Marrakech with a certified local guide. Find authentic crafts, spices, and carpets while learning history.",
    included: ["Certified local guide", "Moroccan tea tasting"],
    notIncluded: ["Shopping costs", "Tips"],
    tags: ["City", "Shopping"], 
    status: "Active", 
    views: 89 
  },
  { 
    id: "tour_6", 
    title: "Agafay Desert Dinner & Camel Trek", 
    price: 600, 
    location: "Agafay Desert", 
    duration: "1 Day", 
    rating: 4.9, 
    reviews: 45,
    image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=800", 
    agencyId: "agency_3", 
    agencyName: "Marrakech Desert Star", 
    description: "Experience sunset and dining in the rocky Agafay Desert. Camel trekking, Gnaoua music, and traditional cuisine under the sky.",
    included: ["Surf gear hire", "5 Lessons with instructors", "Shared villa lodging"],
    notIncluded: ["Flights", "Custom insurance"],
    tags: ["Sports", "Beach"], 
    status: "Active", 
    views: 250 
  }
];

const DEFAULT_POSTS = [
  {
    id: "post_1",
    agencyId: "agency_1",
    agencyName: "Atlas Nomads Travel",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150",
    time: "2 hours ago",
    location: "Merzouga, Morocco",
    image: "https://images.unsplash.com/photo-1542044896530-05d85be9b11a?q=80&w=1000",
    content: "Sunset camel rides are magical this time of year! 🐪✨ Who is joining our next group this Friday? We have limited spots left for the ultimate desert experience.",
    likes: ["user_traveler"],
    comments: [
      {
        id: "c_1",
        userName: "Sarah M.",
        avatar: "https://i.pravatar.cc/150?u=1",
        text: "Stunning shot! Adding this to my wishlist."
      }
    ],
    hasOffer: true,
    offerLink: "/tour/tour_1"
  },
  {
    id: "post_2",
    agencyId: "agency_2",
    agencyName: "BlueCity Guides",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150",
    time: "5 hours ago",
    location: "Chefchaouen",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071",
    content: "The blue streets are waiting for you. 💙 We just found this hidden corner near the main square. Taking bookings for our weekend photography tour!",
    likes: [],
    comments: [],
    hasOffer: true,
    offerLink: "/tour/tour_3"
  }
];

const DEFAULT_MESSAGES = [
  {
    id: "thread_user_traveler_agency_1",
    travelerId: "user_traveler",
    travelerName: "Soulayman Elkharraz",
    agencyId: "agency_1",
    agencyName: "Atlas Nomads Travel",
    messages: [
      {
        id: "msg_init",
        senderId: "user_traveler",
        text: "Hello! I am interested in booking the Luxury Sahara Desert Experience. Is there availability for next week?",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: "msg_reply",
        senderId: "agency_1",
        text: "Hello Soulayman! Yes, we have standard group availability departing next Tuesday. How many people are in your party?",
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ]
  }
];

const DEFAULT_BOOKINGS = [
  {
    id: "booking_1",
    travelerId: "user_traveler",
    travelerName: "Soulayman Elkharraz",
    travelerPhone: "+212 600 000 000",
    agencyId: "agency_1",
    tourId: "tour_1",
    tourTitle: "Luxury Sahara Desert Experience",
    date: "2026-06-29T00:30:00.000Z",
    status: "New"
  }
];

// Initialize Data
export const initStorage = () => {
  if (!localStorage.getItem("rb_seeded_v3")) {
    localStorage.setItem("rb_users", JSON.stringify(DEFAULT_USERS));
    localStorage.setItem("rb_tours", JSON.stringify(DEFAULT_TOURS));
    localStorage.setItem("rb_posts", JSON.stringify(DEFAULT_POSTS));
    localStorage.setItem("rb_messages", JSON.stringify(DEFAULT_MESSAGES));
    localStorage.setItem("rb_bookings", JSON.stringify(DEFAULT_BOOKINGS));
    localStorage.setItem("rb_seeded_v3", "true");
    
    // Clear old seed keys if they exist
    localStorage.removeItem("rb_seeded");
    localStorage.removeItem("rb_seeded_v2");
  }
};

// Generic getters/setters
const getCollection = (key, defaultVal = []) => {
  initStorage();
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultVal;
};

const saveCollection = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const cleanExpiredStories = (users) => {
  let updated = false;
  const now = Date.now();
  const cleaned = users.map(user => {
    if (user.storyCreatedAt) {
      const createdAt = new Date(user.storyCreatedAt).getTime();
      if (now - createdAt > 24 * 60 * 60 * 1000) { // 24 hours
        const { storyImage, storyCreatedAt, ...rest } = user;
        updated = true;
        return rest;
      }
    }
    return user;
  });
  if (updated) {
    localStorage.setItem("rb_users", JSON.stringify(cleaned));
  }
  return cleaned;
};

export const getUsers = () => {
  const users = getCollection("rb_users");
  return cleanExpiredStories(users);
};
export const saveUsers = (users) => saveCollection("rb_users", users);

export const getTours = () => getCollection("rb_tours");
export const saveTours = (tours) => saveCollection("rb_tours", tours);

export const getPosts = () => getCollection("rb_posts");
export const savePosts = (posts) => saveCollection("rb_posts", posts);

export const getMessages = () => getCollection("rb_messages");
export const saveMessages = (msgs) => saveCollection("rb_messages", msgs);

export const getBookings = () => getCollection("rb_bookings");
export const saveBookings = (bookings) => saveCollection("rb_bookings", bookings);

export const getCurrentUser = () => {
  const user = localStorage.getItem("rb_current_user");
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem("rb_current_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("rb_current_user");
  }
};
