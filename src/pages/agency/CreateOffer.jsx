import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import hook for redirection
import Sidebar from '../../components/layout/Sidebar';
import { FaCloudUploadAlt, FaMoneyBillWave, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

const CreateOffer = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate(); // 2. Initialize the hook

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // 3. The "Publish" Action
  const handlePublish = (e) => {
    e.preventDefault(); // Stop page reload
    
    // In a real app, you would send data to backend here.
    // For now, we simulate success:
    alert("Offer Published Successfully! 🚀");
    
    // Redirect back to dashboard
    navigate('/agency/dashboard'); 
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      <Sidebar />

      <div className="flex-1 lg:ml-64 p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Create New Offer</h1>
        <p className="text-slate-500 mb-8">Post a new tour or service to the marketplace.</p>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 max-w-4xl">
          <form className="space-y-8">
            
            {/* 1. Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Offer Title</label>
                <input type="text" placeholder="e.g. 3 Days in Merzouga" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Price (DH)</label>
                <div className="relative">
                   <FaMoneyBillWave className="absolute left-4 top-4 text-slate-400" />
                   <input type="number" placeholder="1200" className="w-full pl-10 px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-bold" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Destination / City</label>
                <div className="relative">
                   <FaMapMarkerAlt className="absolute left-4 top-4 text-slate-400" />
                   <select className="w-full pl-10 px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium bg-white">
                     <option>Select City</option>
                     <option>Merzouga</option>
                     <option>Chefchaouen</option>
                     <option>Marrakech</option>
                     <option>Ifrane</option>
                   </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Duration</label>
                <div className="relative">
                   <FaCalendarAlt className="absolute left-4 top-4 text-slate-400" />
                   <input type="text" placeholder="e.g. 3 Days / 2 Nights" className="w-full pl-10 px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium" />
                </div>
              </div>
            </div>

            {/* 2. Media Upload */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Cover Image</label>
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:bg-slate-50 transition cursor-pointer relative overflow-hidden group">
                <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="w-full h-64 object-cover rounded-xl" />
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                      <FaCloudUploadAlt />
                    </div>
                    <p className="text-slate-600 font-medium">Click to upload image</p>
                    <p className="text-slate-400 text-sm">SVG, PNG, JPG (Max 2MB)</p>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Description */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
              <textarea rows="5" placeholder="Describe the trip program..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium"></textarea>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4">
              <button 
                type="button" 
                onClick={() => navigate('/agency/dashboard')} // Cancel goes back
                className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              
              <button 
                type="button" 
                onClick={handlePublish} // Calls the simulated publish function
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/30 transition-transform active:scale-95"
              >
                Publish Offer
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOffer;