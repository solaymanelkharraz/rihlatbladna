import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { FaEdit, FaTrash, FaEye, FaPlus, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const MyOffers = () => {
  // --- MOCK DATA ---
  const offers = [
    { id: 1, title: "Sahara Desert Trek", price: "1,200 DH", views: 342, status: "Active", image: "https://images.unsplash.com/photo-1542044896530-05d85be9b11a?q=80&w=1000", location: "Merzouga" },
    { id: 2, title: "Blue City Day Trip", price: "450 DH", views: 125, status: "Active", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071", location: "Chefchaouen" },
    { id: 3, title: "Marrakech Souk Tour", price: "300 DH", views: 89, status: "Draft", image: "https://plus.unsplash.com/premium_photo-1661962360706-538096f9c948?q=80&w=2070", location: "Marrakech" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      <Sidebar />

      <div className="flex-1 lg:ml-64 p-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">My Offers</h1>
            <p className="text-slate-500">Manage your active listings.</p>
          </div>
          <Link to="/agency/create-offer" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2">
            <FaPlus /> Create New
          </Link>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden group">
              
              {/* Image */}
              <div className="relative h-48">
                <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${offer.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
                  {offer.status}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-800 leading-tight">{offer.title}</h3>
                  <span className="font-bold text-blue-600">{offer.price}</span>
                </div>
                
                <p className="text-xs text-slate-500 flex items-center gap-1 mb-4">
                  <FaMapMarkerAlt /> {offer.location}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <FaEye /> {offer.views} views
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition"><FaEdit /></button>
                    <button className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition"><FaTrash /></button>
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