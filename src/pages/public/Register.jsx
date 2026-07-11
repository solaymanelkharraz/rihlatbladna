import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaBuilding, FaArrowLeft, FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [role, setRole] = useState('traveler'); // 'traveler' or 'agency'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const res = await register(name, email, password, role);
    if (res.success) {
      if (role === 'agency') {
        navigate('/agency/dashboard');
      } else {
        navigate('/traveler/profile');
      }
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* --- LEFT SIDE: IMAGE WITH PREMIUM OVERLAY --- */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-[10000ms] transform scale-105"
          style={{ 
            backgroundImage: role === 'traveler' 
              ? "url('/morocco1.jpg')" 
              : "url('/Sahara Desert Adventure.jpg')" 
          }}
        ></div>
        <div className={`absolute inset-0 backdrop-blur-[2px] transition-colors duration-1000 ${role === 'traveler' ? 'bg-gradient-to-br from-blue-900/90 via-slate-900/80 to-black/90' : 'bg-gradient-to-br from-purple-900/90 via-slate-900/80 to-black/90'}`}></div>
        
        <div className="relative z-10 text-center px-12 max-w-xl animate-fade-in-up">
          <div className="inline-block mb-6 p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-2xl">
            <h2 className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${role === 'traveler' ? 'from-blue-400 to-amber-300' : 'from-purple-400 to-amber-300'}`}>
              {role === 'traveler' ? "Start Your Adventure" : "Grow Your Business"}
            </h2>
          </div>
          <p className="text-slate-300 text-lg font-light leading-relaxed">
            {role === 'traveler' 
              ? "Join thousands of travelers discovering the hidden gems of Morocco. Authentic experiences await."
              : "Connect with travelers, manage bookings seamlessly, and showcase your best tours to the world."}
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE: FORM AREA --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 relative bg-white overflow-y-auto">
        
        <Link to="/" className="absolute top-8 left-8 sm:top-12 sm:left-12 flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-semibold group">
          <FaArrowLeft className="transform group-hover:-translate-x-1 transition-transform" /> 
          Back to Home
        </Link>

        <div className="w-full max-w-md mt-16 lg:mt-0 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Create Account</h1>
            <p className="text-slate-500 text-lg">Join RihlatBladna today.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-2xl text-sm font-semibold mb-6 flex items-center gap-2">
              <FaExclamationCircle className="text-lg shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Switcher */}
          <div className="bg-slate-100 p-1.5 rounded-2xl flex mb-8 shadow-inner">
            <button 
              type="button"
              onClick={() => setRole('traveler')}
              className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${role === 'traveler' ? 'bg-white text-blue-600 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transform scale-[1.02]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
              I am a Traveler
            </button>
            <button 
              type="button"
              onClick={() => setRole('agency')}
              className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${role === 'agency' ? 'bg-white text-purple-600 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transform scale-[1.02]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
              I am an Agency
            </button>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleRegister}>
            
            {/* Name */}
            <div className="group">
              <label className={`block text-sm font-semibold text-slate-700 mb-2 transition-colors ${role === 'traveler' ? 'group-focus-within:text-blue-600' : 'group-focus-within:text-purple-600'}`}>
                {role === 'traveler' ? "Full Name" : "Agency Name"}
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 transition-colors ${role === 'traveler' ? 'group-focus-within:text-blue-500' : 'group-focus-within:text-purple-500'}`}>
                  {role === 'traveler' ? <FaUser /> : <FaBuilding />}
                </div>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'traveler' ? "Soulayman Elkharraz" : "Best Morocco Tours"} 
                  className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400 ${role === 'traveler' ? 'focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10' : 'focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10'}`}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="group">
              <label className={`block text-sm font-semibold text-slate-700 mb-2 transition-colors ${role === 'traveler' ? 'group-focus-within:text-blue-600' : 'group-focus-within:text-purple-600'}`}>Email Address</label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 transition-colors ${role === 'traveler' ? 'group-focus-within:text-blue-500' : 'group-focus-within:text-purple-500'}`}>
                  <FaEnvelope />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400 ${role === 'traveler' ? 'focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10' : 'focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10'}`}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <label className={`block text-sm font-semibold text-slate-700 mb-2 transition-colors ${role === 'traveler' ? 'group-focus-within:text-blue-600' : 'group-focus-within:text-purple-600'}`}>Password</label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 transition-colors ${role === 'traveler' ? 'group-focus-within:text-blue-500' : 'group-focus-within:text-purple-500'}`}>
                  <FaLock />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password" 
                  className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400 ${role === 'traveler' ? 'focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10' : 'focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10'}`}
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex justify-center items-center gap-2 ${role === 'traveler' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 hover:shadow-blue-600/30' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20 hover:shadow-purple-600/30'}`}
            >
              {role === 'traveler' ? "Sign Up as Traveler" : "Register Agency"}
            </button>
          </form>

          <p className="text-center mt-10 text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className={`font-bold hover:underline transition-colors ${role === 'traveler' ? 'text-blue-600 hover:text-blue-700' : 'text-purple-600 hover:text-purple-700'}`}>
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;