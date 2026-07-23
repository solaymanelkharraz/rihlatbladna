import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { toursAPI } from '../../api/endpoints';
import { FaTrash, FaPlus, FaMapMarkerAlt, FaSearch, FaToggleOn, FaToggleOff, FaEye, FaRocket } from 'react-icons/fa';

const MyOffers = () => {
  const { user, deleteTour, updateTourStatus, toggleBoostTour } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [boostModalTourId, setBoostModalTourId] = useState(null);
  const [isBoosting, setIsBoosting] = useState(false);
  const [myTours, setMyTours] = useState([]);

  const fetchMyTours = async () => {
    if (!user?.id) return;
    try {
      const data = await toursAPI.getAll({ agencyId: user.id });
      setMyTours(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyTours();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer? This cannot be undone.")) return;

    await deleteTour(id);
    fetchMyTours();
  };

  const handleToggleStatus = async (id) => {
    const offer = myTours.find(t => t.id === id);
    if (!offer) return;
    const newStatus = offer.status === 'Active' ? 'Archived' : 'Active';
    await updateTourStatus(id, { status: newStatus });
    fetchMyTours();
  };

  // Filter listings
  const filteredTours = myTours.filter(tour => {
    const matchesSearch = 
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tour.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'All Status' || 
      tour.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex selection:bg-blue-500 selection:text-white pb-24">
      <Sidebar />

      <div className="flex-1 lg:ml-64 pt-24 pb-8 px-4 lg:p-10 animate-fade-in-up">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">My Offers</h1>
            <p className="text-slate-500 text-lg">Manage your active listings and drafts.</p>
          </div>
          <Link to="/agency/create-offer" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold shadow-md flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 w-full md:w-auto">
            <FaPlus /> Create New Offer
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
           <div className="relative w-full md:w-96 group focus-within:shadow-sm transition-shadow rounded-2xl">
             <FaSearch className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
             <input 
               type="text" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Search your offers..." 
               className="w-full pl-12 px-4 py-3 bg-slate-50 rounded-2xl outline-none text-sm font-bold border border-slate-100 focus:border-blue-500 focus:bg-white transition-all text-slate-700" 
             />
           </div>
           <div className="flex gap-2 w-full md:w-auto">
             <select 
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
               className="w-full md:w-auto bg-slate-50 px-6 py-3 rounded-2xl text-sm font-bold text-slate-600 outline-none cursor-pointer border border-slate-100 focus:border-blue-500 transition-colors"
             >
               <option>All Status</option>
               <option>Active</option>
               <option>Draft</option>
             </select>
           </div>
        </div>

        {/* Offers Grid */}
        {filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredTours.map((offer) => (
              <div key={offer.id} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 flex flex-col">
                
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img src={offer.image} alt={offer.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-50"></div>
                  
                  {offer.isBoosted && (
                    <div className="absolute top-5 left-5 px-4 py-1.5 rounded-full text-xs font-black shadow-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white animate-pulse z-10">
                      🚀 Sponsored
                    </div>
                  )}

                  <div className={`absolute top-5 right-5 px-4 py-1.5 rounded-full text-xs font-black shadow-lg backdrop-blur-md ${offer.status === 'Active' ? 'bg-green-500/90 text-white' : 'bg-slate-500/90 text-white'} z-10`}>
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

                  <div className="mt-auto pt-5 border-t border-slate-100 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-slate-400 flex items-center gap-1.5">
                        <FaEye className="text-slate-300 text-lg" /> <span className="text-slate-700">{offer.views || 0}</span> views
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleToggleStatus(offer.id)}
                          className={`px-3 h-9 flex items-center justify-center gap-1.5 rounded-lg font-bold text-xs transition-colors duration-300 border ${offer.status === 'Active' ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-500 hover:text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-500 hover:text-white border-slate-200'}`}
                        >
                          {offer.status === 'Active' ? <><FaToggleOn className="text-lg" /> Active</> : <><FaToggleOff className="text-lg" /> Draft</>}
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(offer.id)}
                          className="w-9 h-9 flex items-center justify-center bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors duration-300 border border-red-100" 
                          title="Delete Offer"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        if (offer.isBoosted) return;
                        setBoostModalTourId(offer.id);
                      }}
                      disabled={offer.isBoosted}
                      className={`w-full py-2.5 flex items-center justify-center gap-2 rounded-xl font-bold text-sm transition-colors duration-300 border ${offer.isBoosted ? 'bg-amber-100 text-amber-600 border-amber-200 cursor-not-allowed opacity-70' : 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-md shadow-amber-500/30'}`}
                      title={offer.isBoosted ? "Already Sponsored 🚀" : "Boost Offer (50 Credits)"}
                    >
                      <FaRocket /> {offer.isBoosted ? 'Sponsored' : 'Boost (50 cr)'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl p-8">
            <p className="text-slate-500 text-lg font-bold mb-2">You haven't created any offers yet.</p>
            <p className="text-slate-400 text-sm mb-6">Create a trip experience to advertise it to travelers.</p>
            <Link to="/agency/create-offer" className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm">
              Create First Offer
            </Link>
          </div>
        )}

      </div>

      {/* Boost Confirmation Modal */}
      {boostModalTourId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setBoostModalTourId(null)} />
          <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-inner">
              <FaRocket />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Boost Tour</h3>
            <p className="text-slate-500 mb-6 font-medium leading-relaxed">
              This will deduct <strong className="text-slate-800 text-lg">50 credits</strong> from your wallet to sponsor this tour for 7 days.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setBoostModalTourId(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  setIsBoosting(true);
                  await toggleBoostTour(boostModalTourId);
                  setIsBoosting(false);
                  setBoostModalTourId(null);
                  fetchMyTours();
                }}
                disabled={isBoosting}
                className="flex-1 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all disabled:opacity-50 cursor-pointer flex justify-center items-center gap-2"
              >
                {isBoosting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing
                  </>
                ) : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOffers;