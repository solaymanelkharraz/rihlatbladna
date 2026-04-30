import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { FaCloudUploadAlt, FaMoneyBillWave, FaMapMarkerAlt, FaCalendarAlt, FaHeading, FaAlignLeft } from 'react-icons/fa';

const CreateOffer = () => {
  const navigate = useNavigate();
  
  // Local state for all fields
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      // You would normally save the `file` object to state to upload it later
    }
  };

  const handlePublish = (e) => {
    e.preventDefault();
    console.log("Publishing Offer:", { title, price, city, duration, description, hasImage: !!previewImage });
    // In a real app, you would send data to backend here.
    alert("Offer Published Successfully! 🚀");
    navigate('/agency/dashboard'); 
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex selection:bg-blue-500 selection:text-white">
      <Sidebar />

      <div className="flex-1 lg:ml-64 p-8 xl:p-12 h-screen overflow-y-auto">
        <div className="max-w-5xl mx-auto animate-fade-in-up">
          
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Create New Offer</h1>
            <p className="text-slate-500 text-lg">Post a new tour or service to the marketplace.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-10">
            <form className="space-y-8" onSubmit={handlePublish}>
              
              {/* 1. Basic Info Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-blue-600">Offer Title</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500">
                        <FaHeading />
                      </div>
                      <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. 3 Days in Merzouga" 
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400" 
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-blue-600">Price (DH)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500">
                        <FaMoneyBillWave />
                      </div>
                      <input 
                        type="number" 
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="1200" 
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-400" 
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* City */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-blue-600">Destination / City</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500">
                        <FaMapMarkerAlt />
                      </div>
                      <select 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700 cursor-pointer appearance-none"
                        required
                      >
                        <option value="" disabled>Select City</option>
                        <option value="Merzouga">Merzouga</option>
                        <option value="Chefchaouen">Chefchaouen</option>
                        <option value="Marrakech">Marrakech</option>
                        <option value="Ifrane">Ifrane</option>
                        <option value="Agadir">Agadir</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Duration */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-blue-600">Duration</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500">
                        <FaCalendarAlt />
                      </div>
                      <input 
                        type="text" 
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="e.g. 3 Days / 2 Nights" 
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400" 
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Media Upload */}
              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Media</h3>
                <div>
                  <div className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer relative overflow-hidden group ${previewImage ? 'border-transparent' : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50/50'}`}>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    
                    {previewImage ? (
                      <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-md group">
                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <span className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
                             <FaCloudUploadAlt /> Change Image
                           </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10">
                        <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-4xl mb-5 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300 shadow-sm">
                          <FaCloudUploadAlt />
                        </div>
                        <p className="text-slate-700 font-bold text-lg mb-1">Click to upload cover image</p>
                        <p className="text-slate-400 text-sm">SVG, PNG, JPG (Max 2MB)</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Description */}
              <div className="space-y-4 pt-4 group">
                <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Details</h3>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-blue-600">Description</label>
                  <div className="relative">
                    <div className="absolute top-4 left-4 pointer-events-none text-slate-400 group-focus-within:text-blue-500">
                      <FaAlignLeft />
                    </div>
                    <textarea 
                      rows="6" 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the trip program, what's included, etc..." 
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400 resize-y"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-8 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => navigate('/agency/dashboard')}
                  className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all"
                >
                  Cancel
                </button>
                
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold shadow-[0_8px_30px_rgb(37,99,235,0.2)] hover:shadow-[0_8px_30px_rgb(37,99,235,0.3)] transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
                >
                  Publish Offer
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOffer;