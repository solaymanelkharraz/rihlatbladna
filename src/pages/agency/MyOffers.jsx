import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { FaEdit, FaTrash, FaEye, FaPlus, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

const MyOffers = () => {
  // --- MOCK DATA ---
  const offers = [
    { id: 1, title: "Sahara Desert Trek", price: "1,200", views: 342, status: "Active", image: "https://images.unsplash.com/photo-1542044896530-05d85be9b11a?q=80&w=1000", location: "Merzouga" },
    { id: 2, title: "Blue City Day Trip", price: "450", views: 125, status: "Active", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071", location: "Chefchaouen" },
    { id: 3, title: "Marrakech Souk Tour", price: "300", views: 89, status: "Draft", image: "https://plus.unsplash.com/premium_photo-1661962360706-538096f9c948?q=80&w=2070", location: "Marrakech" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex selection:bg-blue-500 selection:text-white pb-24">
      <Sidebar />

      <div className="flex-1 lg:ml-64 p-4 lg:p-10 animate-fade-in-up">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">My Offers</h1>
            <p className="text-slate-500 text-lg">Manage your active listings and drafts.</p>
          </div>
          <Link to="/agency/create-offer" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold shadow-[0_8px_30px_rgb(37,99,235,0.24)] hover:shadow-[0_8px_30px_rgb(37,99,235,0.4)] flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 w-full md:w-auto">
            <FaPlus /> Create New Offer
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
           <div className="relative w-full md:w-96 group focus-within:shadow-sm transition-shadow rounded-2xl">
             <FaSearch className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
             <input type="text" placeholder="Search your offers..." className="w-full pl-12 px-4 py-3 bg-slate-50 rounded-2xl outline-none text-sm font-bold border border-slate-100 focus:border-blue-500 focus:bg-white transition-all text-slate-700" />
           </div>
           <div className="flex gap-2 w-full md:w-auto">
             <select className="w-full md:w-auto bg-slate-50 px-6 py-3 rounded-2xl text-sm font-bold text-slate-600 outline-none cursor-pointer border border-slate-100 focus:border-blue-500 transition-colors">
               <option>All Status</option>
               <option>Active</option>
               <option>Draft</option>
               <option>Expired</option>
             </select>
           </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 flex flex-col">
              
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img src={offer.image} alt={offer.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-50"></div>
                
                <div className={`absolute top-5 right-5 px-4 py-1.5 rounded-full text-xs font-black shadow-lg backdrop-blur-md ${offer.status === 'Active' ? 'bg-green-500/90 text-white' : 'bg-slate-200/90 text-slate-700'}`}>
                  {offer.status}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h3 className="font-extrabold text-xl text-slate-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">{offer.title}</h3>
                </div>
                
                <div className="flex flex-col mb-4">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Price</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-black text-2xl text-blue-600">{offer.price}</span>
                    <span className="font-bold text-slate-500 text-sm">DH</span>
                  </div>
                </div>
                
                <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-6 bg-slate-50 w-fit px-3 py-1.5 rounded-xl border border-slate-100">
                  <FaMapMarkerAlt className="text-blue-400" /> {offer.location}
                </p>

                <div className="mt-auto flex items-center justify-between pt-5 border-t border-slate-100">
                  <div className="text-sm font-bold text-slate-400 flex items-center gap-1.5">
                    <FaEye className="text-slate-300 text-lg" /> <span className="text-slate-700">{offer.views}</span> views
                  </div>
                  <div className="flex gap-3">
                    <button className="w-10 h-10 flex items-center justify-center bg-blue-50 hover:bg-blue-500 text-blue-600 hover:text-white rounded-xl transition-colors duration-300" title="Edit Offer"><FaEdit /></button>
                    <button className="w-10 h-10 flex items-center justify-center bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-colors duration-300" title="Delete Offer"><FaTrash /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default MyOffers;