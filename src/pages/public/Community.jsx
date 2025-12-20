import React, { useState } from 'react';
import { FaHeart, FaComment, FaShare, FaMapMarkerAlt, FaCamera, FaSearch } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';

const Community = () => {
  // --- MOCK DATA: Stories (Agencies) ---
  const stories = [
    { id: 1, name: "Sahara Travels", img: "https://i.pravatar.cc/150?u=agency1", isLive: true },
    { id: 2, name: "Blue Pearl", img: "https://i.pravatar.cc/150?u=agency2", isLive: false },
    { id: 3, name: "Atlas Pro", img: "https://i.pravatar.cc/150?u=agency3", isLive: false },
    { id: 4, name: "Surf Morocco", img: "https://i.pravatar.cc/150?u=agency5", isLive: false },
    { id: 5, name: "City Vibes", img: "https://i.pravatar.cc/150?u=agency6", isLive: false },
  ];

  // --- MOCK DATA: Feed Posts ---
  const posts = [
    {
      id: 1,
      agency: "Sahara Travels",
      avatar: "https://i.pravatar.cc/150?u=agency1",
      time: "2 hours ago",
      location: "Merzouga, Morocco",
      image: "https://images.unsplash.com/photo-1542044896530-05d85be9b11a?q=80&w=1000",
      content: "Sunset camel rides are magical this time of year! 🐪✨ Who is joining our next group this Friday?",
      likes: 124,
      comments: 18,
      hasOffer: true, // Special tag if this post links to a trip
      offerLink: "/tour/1"
    },
    {
      id: 2,
      agency: "Blue Pearl Tours",
      avatar: "https://i.pravatar.cc/150?u=agency2",
      time: "5 hours ago",
      location: "Chefchaouen",
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071",
      content: "The blue streets are waiting for you. 💙 We just found this hidden corner near the main square.",
      likes: 89,
      comments: 5,
      hasOffer: false
    }
  ];

  const [activeLike, setActiveLike] = useState(null);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT: Sidebar (Trending) --- */}
        <div className="hidden lg:block space-y-6">
           {/* Search */}
           <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
             <div className="relative">
               <FaSearch className="absolute left-3 top-3 text-slate-400" />
               <input type="text" placeholder="Search posts..." className="w-full pl-10 px-4 py-2 bg-slate-50 rounded-xl outline-none text-sm font-bold" />
             </div>
           </div>

           {/* Trending Topics */}
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
             <h3 className="font-bold text-slate-900 mb-4">Trending Now 📈</h3>
             <ul className="space-y-3 text-sm font-medium text-slate-600">
               <li className="flex justify-between cursor-pointer hover:text-blue-600"><span>#SaharaMagic</span> <span className="text-slate-400">1.2k</span></li>
               <li className="flex justify-between cursor-pointer hover:text-blue-600"><span>#BlueCity</span> <span className="text-slate-400">850</span></li>
               <li className="flex justify-between cursor-pointer hover:text-blue-600"><span>#MoroccoFood</span> <span className="text-slate-400">640</span></li>
               <li className="flex justify-between cursor-pointer hover:text-blue-600"><span>#AtlasHike</span> <span className="text-slate-400">420</span></li>
             </ul>
           </div>
        </div>

        {/* --- CENTER: Main Feed --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stories Bar */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex gap-4 overflow-x-auto no-scrollbar">
            {/* My Story Add */}
            <div className="flex flex-col items-center gap-2 cursor-pointer min-w-[60px]">
               <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 text-slate-400">
                 <FaCamera />
               </div>
               <span className="text-xs font-bold text-slate-500">Add Story</span>
            </div>

            {stories.map((story) => (
              <div key={story.id} className="flex flex-col items-center gap-2 cursor-pointer min-w-[60px]">
                <div className={`w-16 h-16 rounded-full p-0.5 ${story.isLive ? 'bg-gradient-to-tr from-amber-400 to-fuchsia-600' : 'border-2 border-slate-200'}`}>
                  <img src={story.img} alt={story.name} className="w-full h-full rounded-full border-2 border-white object-cover" />
                </div>
                <span className="text-xs font-bold text-slate-700 truncate w-16 text-center">{story.name}</span>
              </div>
            ))}
          </div>

          {/* Posts Feed */}
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              
              {/* Post Header */}
              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img src={post.avatar} alt={post.agency} className="w-10 h-10 rounded-full border border-slate-100" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{post.agency}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      {post.time} • <FaMapMarkerAlt className="text-slate-400" /> {post.location}
                    </p>
                  </div>
                </div>
                <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">Follow</button>
              </div>

              {/* Post Image */}
              <div className="relative">
                <img src={post.image} alt="Post" className="w-full h-80 object-cover" />
                {post.hasOffer && (
                   <a href={post.offerLink} className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-blue-600 font-bold px-4 py-2 rounded-full text-sm shadow-lg hover:scale-105 transition transform">
                     View Trip Offer ➜
                   </a>
                )}
              </div>

              {/* Actions */}
              <div className="p-4">
                <div className="flex gap-4 mb-4">
                  <button 
                    onClick={() => setActiveLike(post.id)}
                    className={`text-xl transition ${activeLike === post.id ? 'text-red-500 scale-125' : 'text-slate-400 hover:text-red-500'}`}
                  >
                    <FaHeart />
                  </button>
                  <button className="text-xl text-slate-400 hover:text-blue-500 transition"><FaComment /></button>
                  <button className="text-xl text-slate-400 hover:text-green-500 transition ml-auto"><FaShare /></button>
                </div>
                
                <p className="text-sm font-bold text-slate-800 mb-2">{post.likes} likes</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-900 mr-2">{post.agency}</span>
                  {post.content}
                </p>
                <p className="text-xs text-slate-400 mt-2 cursor-pointer hover:underline">View all {post.comments} comments</p>
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Community;