import React, { useState } from 'react';
import { FaHeart, FaComment, FaShare, FaMapMarkerAlt, FaCamera, FaSearch, FaEllipsisH, FaCompass } from 'react-icons/fa';
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
      content: "Sunset camel rides are magical this time of year! 🐪✨ Who is joining our next group this Friday? We have limited spots left for the ultimate desert experience.",
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
      content: "The blue streets are waiting for you. 💙 We just found this hidden corner near the main square. Taking bookings for our weekend photography tour!",
      likes: 89,
      comments: 5,
      hasOffer: false
    }
  ];

  const [activeLike, setActiveLike] = useState(null);

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
               {[
                 { tag: "SaharaMagic", count: "1.2k" },
                 { tag: "BlueCity", count: "850" },
                 { tag: "MoroccoFood", count: "640" },
                 { tag: "AtlasHike", count: "420" }
               ].map((item, i) => (
                 <li key={i} className="flex justify-between items-center group cursor-pointer">
                   <div className="flex flex-col">
                     <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">#{item.tag}</span>
                     <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.count} posts</span>
                   </div>
                   <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                     ➜
                   </button>
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
             <button className="bg-white text-blue-600 font-bold px-6 py-2.5 rounded-xl text-sm shadow-lg active:scale-95 transition-transform w-full">
               Explore Directory
             </button>
           </div>
        </div>

        {/* --- CENTER: Main Feed --- */}
        <div className="lg:col-span-2 space-y-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          
          {/* Stories Bar */}
          <div className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex gap-5 overflow-x-auto hide-scrollbar relative">
            {/* Gradient mask for smooth scroll fade */}
            <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 rounded-r-[2rem]"></div>
            
            {/* My Story Add */}
            <div className="flex flex-col items-center gap-2 cursor-pointer min-w-[70px] group">
               <div className="w-16 h-16 rounded-[1.25rem] border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 text-slate-400 group-hover:border-blue-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all duration-300">
                 <FaCamera className="text-xl group-hover:scale-110 transition-transform" />
               </div>
               <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-blue-600 transition-colors">Add Story</span>
            </div>

            {stories.map((story) => (
              <div key={story.id} className="flex flex-col items-center gap-2 cursor-pointer min-w-[70px] group">
                <div className={`w-16 h-16 rounded-[1.25rem] p-0.5 transition-transform duration-300 group-hover:scale-105 ${story.isLive ? 'bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600 animate-gradient-xy' : 'bg-slate-200'}`}>
                  <img src={story.img} alt={story.name} className="w-full h-full rounded-[1.15rem] border-2 border-white object-cover" />
                </div>
                <span className="text-xs font-bold text-slate-700 truncate w-16 text-center group-hover:text-slate-900">{story.name}</span>
              </div>
            ))}
          </div>

          {/* Posts Feed */}
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden mb-8">
              
              {/* Post Header */}
              <div className="p-6 flex justify-between items-center">
                <div className="flex items-center gap-4 cursor-pointer group">
                  <img src={post.avatar} alt={post.agency} className="w-12 h-12 rounded-[1rem] shadow-sm border border-slate-100 group-hover:scale-105 transition-transform" />
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base group-hover:text-blue-600 transition-colors">{post.agency}</h4>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                      {post.time} <span className="w-1 h-1 rounded-full bg-slate-300"></span> <FaMapMarkerAlt className="text-blue-400" /> {post.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 shadow-sm active:scale-95 hidden sm:block">Follow</button>
                  <button className="text-slate-400 hover:text-slate-700 transition-colors p-2"><FaEllipsisH /></button>
                </div>
              </div>

              {/* Post Image */}
              <div className="relative group">
                <img src={post.image} alt="Post" className="w-full h-96 object-cover" />
                
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>

                {post.hasOffer && (
                   <a href={post.offerLink} className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md text-blue-600 font-bold px-6 py-3 rounded-2xl text-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-105 hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center gap-2 group/btn">
                     View Trip Offer <span className="group-hover/btn:translate-x-1 transition-transform">➜</span>
                   </a>
                )}
              </div>

              {/* Actions & Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <button 
                    onClick={() => setActiveLike(post.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 active:scale-75 ${activeLike === post.id ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-red-500'}`}
                  >
                    <FaHeart className={activeLike === post.id ? "scale-110" : ""} />
                  </button>
                  <button className="w-12 h-12 rounded-full flex items-center justify-center text-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-500 transition-colors"><FaComment /></button>
                  <button className="w-12 h-12 rounded-full flex items-center justify-center text-xl bg-slate-50 text-slate-400 hover:bg-green-50 hover:text-green-500 transition-colors ml-auto"><FaShare /></button>
                </div>
                
                <p className="text-sm font-black text-slate-900 mb-3">{post.likes} likes</p>
                
                <p className="text-[15px] text-slate-600 leading-relaxed mb-3">
                  <span className="font-extrabold text-slate-900 mr-2 cursor-pointer hover:underline">{post.agency}</span>
                  {post.content}
                </p>
                
                <div className="flex gap-2 mb-4">
                  {/* Fake tags based on text content */}
                  {post.content.includes("camel") && <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">Desert</span>}
                  {post.content.includes("blue") && <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">Culture</span>}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">Travel</span>
                </div>

                <p className="text-sm font-medium text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">View all {post.comments} comments</p>
                
                {/* Add Comment */}
                <div className="mt-5 pt-5 border-t border-slate-100 flex items-center gap-3">
                  <img src="https://i.pravatar.cc/150?u=current_user" alt="Me" className="w-8 h-8 rounded-full" />
                  <input type="text" placeholder="Add a comment..." className="flex-1 bg-transparent outline-none text-sm font-medium placeholder:text-slate-400" />
                  <button className="text-blue-600 font-bold text-sm hover:text-blue-700 transition-colors">Post</button>
                </div>
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Community;