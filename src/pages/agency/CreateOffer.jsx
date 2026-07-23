import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { FaCloudUploadAlt, FaMoneyBillWave, FaMapMarkerAlt, FaCalendarAlt, FaHeading, FaAlignLeft, FaTags, FaClipboardList, FaSpinner, FaPaperPlane } from 'react-icons/fa';

const CreateOffer = () => {
  const navigate = useNavigate();
  const { user, showAlert, createTour, uploadImage } = useAuth();
  
  // Local state for all fields
  const [title, setTitle] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [included, setIncluded] = useState(''); // Comma-separated
  const [notIncluded, setNotIncluded] = useState(''); // Comma-separated
  const [tags, setTags] = useState(''); // Comma-separated
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const url = await uploadImage(file);
    if (url) {
      setImageUrl(url);
    }
    setUploading(false);
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsPublishing(true);

    // Create the new tour object
    const tourData = {
      title: title.trim(),
      price: Number(price),
      location: city,
      duration: duration.trim(),
      image: imageUrl.trim() || "/Sahara Desert Adventure.jpg",
      description: description.trim(),
      included: included ? included.split(',').map(item => item.trim()).filter(Boolean) : ["Transport", "Tour Guide"],
      notIncluded: notIncluded ? notIncluded.split(',').map(item => item.trim()).filter(Boolean) : ["Personal Expenses"],
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : ["Adventure", "Tour"]
    };

    const res = await createTour(tourData);
    if (res.success) {
      showAlert("Success", "Offer Published Successfully! 🚀", "success");
      navigate('/agency/offers'); 
    }
    setIsPublishing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex selection:bg-blue-500 selection:text-white">
      <Sidebar />

      <div className="flex-1 lg:ml-64 pt-24 pb-8 px-6 lg:p-8 xl:p-12 overflow-y-auto h-screen">
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
                        placeholder="e.g. 3 Days in Merzouga Desert" 
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

              {/* 2. Image Upload Input */}
              <div className="space-y-4 pt-4 group">
                <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Cover Image</h3>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Image File</label>
                  <div className="relative">
                    <label className="w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all gap-2 p-4">
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-xs text-slate-500 font-bold">Uploading file...</span>
                        </div>
                      ) : imageUrl ? (
                        <span className="text-xs text-green-600 font-bold">✓ Uploaded successfully (click to change)</span>
                      ) : (
                        <>
                          <FaCloudUploadAlt className="text-3xl text-slate-400" />
                          <span className="text-xs text-slate-500 font-bold">Click to select an image from your computer</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {imageUrl && (
                    <div className="mt-4 rounded-2xl overflow-hidden h-48 max-w-md border border-slate-100 shadow-sm relative group">
                      <img src={imageUrl} alt="Offer Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute top-3 right-3 bg-red-500 hover:bg-red-650 text-white px-3 py-1.5 rounded-xl shadow-md text-xs transition-colors border-none cursor-pointer"
                        title="Remove Image"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Detailed Fields (Tags, Included, Excluded) */}
              <div className="space-y-6 pt-4">
                <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Lists & Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Included */}
                  <div className="group col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">What's Included</label>
                    <input 
                      type="text" 
                      value={included}
                      onChange={(e) => setIncluded(e.target.value)}
                      placeholder="Transport, Guide, Breakfast (comma separated)"
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-500 outline-none transition-all text-xs font-semibold"
                    />
                  </div>
                  {/* Not Included */}
                  <div className="group col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">What's Excluded</label>
                    <input 
                      type="text" 
                      value={notIncluded}
                      onChange={(e) => setNotIncluded(e.target.value)}
                      placeholder="Lunch, Tips, Drinks (comma separated)"
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-500 outline-none transition-all text-xs font-semibold"
                    />
                  </div>
                  {/* Tags */}
                  <div className="group col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Tags / Vibe</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <FaTags />
                      </div>
                      <input 
                        type="text" 
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Desert, Trekking, Adventure (comma separated)"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-500 outline-none transition-all text-xs font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-blue-600">Trip Program / Description</label>
                  <div className="relative">
                    <div className="absolute top-4 left-4 pointer-events-none text-slate-400 group-focus-within:text-blue-500">
                      <FaAlignLeft />
                    </div>
                    <textarea 
                      rows="5" 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the tour details..." 
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400 resize-none"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isPublishing}
                  className={`font-bold py-4 px-10 rounded-2xl shadow-xl shadow-blue-600/20 active:scale-95 transition-all text-sm flex items-center gap-2 border-none cursor-pointer ${isPublishing ? 'bg-slate-400 text-white cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                  {isPublishing ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                  {isPublishing ? 'Publishing...' : 'Publish Offer Live'}
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