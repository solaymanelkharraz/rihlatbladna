import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaBuilding, FaArrowLeft } from 'react-icons/fa';

const Register = () => {
  const [role, setRole] = useState('traveler'); // 'traveler' or 'agency'

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* --- LEFT SIDE: IMAGE (Changes based on role) --- */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60 transition-all duration-700"
          style={{ 
            backgroundImage: role === 'traveler' 
              ? "url('https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071')" // Blue City for Traveler
              : "url('https://images.unsplash.com/photo-1518182170546-0766ce6fec56?q=80&w=2070')" // Workspace/Desert for Agency
          }}
        ></div>
        <div className="relative z-10 text-center px-10 max-w-lg">
          <h2 className="text-4xl font-bold text-white mb-4">
            {role === 'traveler' ? "Start Your Adventure" : "Grow Your Business"}
          </h2>
          <p className="text-slate-200 text-lg">
            {role === 'traveler' 
              ? "Join thousands of travelers discovering the hidden gems of Morocco."
              : "Connect with travelers, manage bookings, and showcase your tours to the world."}
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE: FORM --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative overflow-y-auto">
        
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition font-bold">
          <FaArrowLeft /> Home
        </Link>

        <div className="w-full max-w-md mt-12 lg:mt-0">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500">Join RihlatBladna today.</p>
          </div>

          {/* Role Switcher */}
          <div className="bg-slate-100 p-1 rounded-xl flex mb-8">
            <button 
              onClick={() => setRole('traveler')}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${role === 'traveler' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              I am a Traveler
            </button>
            <button 
              onClick={() => setRole('agency')}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${role === 'agency' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              I am an Agency
            </button>
          </div>

          {/* Form */}
          <form className="space-y-5">
            
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {role === 'traveler' ? "Full Name" : "Agency Name"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  {role === 'traveler' ? <FaUser /> : <FaBuilding />}
                </div>
                <input 
                  type="text" 
                  placeholder={role === 'traveler' ? "Soulayman Elkharraz" : "Best Morocco Tours"} 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FaEnvelope />
                </div>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FaLock />
                </div>
                <input 
                  type="password" 
                  placeholder="Create a strong password" 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <button className={`w-full text-white font-bold py-3 rounded-xl shadow-lg transition-all transform active:scale-95 ${role === 'traveler' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/30'}`}>
              {role === 'traveler' ? "Sign Up as Traveler" : "Register Agency"}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-500 text-sm">
            Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;