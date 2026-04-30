import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaGoogle, FaFacebook, FaArrowLeft } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  
  // Local state for LocalStorage integration prep
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
    // TODO: Wire up to LocalStorage fake API later
    // Redirect to the dashboard
    navigate('/traveler/profile');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans selection:bg-blue-500 selection:text-white">
      {/* Left Side (Image with Premium Gradient Overlay) */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-[10000ms]" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2070')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-slate-900/80 to-black/90 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 text-center px-12 max-w-2xl animate-fade-in-up">
          <div className="inline-block mb-6 p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-2xl">
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-300">
              RihlatBladna
            </h2>
          </div>
          <h3 className="text-3xl font-bold text-white mb-6 leading-tight">
            Welcome Back to Your Next Adventure!
          </h3>
          <p className="text-slate-300 text-lg font-light leading-relaxed">
            "Travel is the only thing you buy that makes you richer. Sign in to continue your journey with local experts and authentic experiences."
          </p>
        </div>
      </div>

      {/* Right Side (Form Area) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 relative bg-white">
        <Link to="/" className="absolute top-8 left-8 sm:top-12 sm:left-12 flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-semibold group">
          <FaArrowLeft className="transform group-hover:-translate-x-1 transition-transform" /> 
          Back to Home
        </Link>

        <div className="w-full max-w-md mt-12 lg:mt-0 animate-fade-in">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Log In</h1>
            <p className="text-slate-500 text-lg">Enter your details to access your account.</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-blue-600">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <FaEnvelope />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" 
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-700 transition-colors group-focus-within:text-blue-600">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <FaLock />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-[0_8px_30px_rgb(37,99,235,0.2)] hover:shadow-[0_8px_30px_rgb(37,99,235,0.3)] transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex justify-center items-center gap-2"
            >
              Sign In to Your Account
            </button>
          </form>

          {/* Social Login Separator */}
          <div className="my-10 flex items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="px-5 text-slate-400 text-sm font-medium uppercase tracking-wider">Or continue with</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 bg-white border border-slate-200 py-3.5 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all font-semibold text-slate-700 hover:-translate-y-0.5 shadow-sm hover:shadow">
              <FaGoogle className="text-red-500 text-lg" /> Google
            </button>
            <button className="flex items-center justify-center gap-3 bg-white border border-slate-200 py-3.5 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all font-semibold text-slate-700 hover:-translate-y-0.5 shadow-sm hover:shadow">
              <FaFacebook className="text-blue-600 text-lg" /> Facebook
            </button>
          </div>

          <p className="text-center mt-10 text-slate-500 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-all">
              Sign up today
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;