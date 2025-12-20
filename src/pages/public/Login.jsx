import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { FaEnvelope, FaLock, FaGoogle, FaFacebook, FaArrowLeft } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate(); // 2. Create the hook

  // 3. Fake Login Function
  const handleLogin = (e) => {
    e.preventDefault(); // Stop page refresh
    // Simulate processing...
    console.log("Logging in..."); 
    // Redirect to the dashboard
    navigate('/traveler/profile');
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side (Image) - same as before */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2070')" }}></div>
        <div className="relative z-10 text-center px-10">
          <h2 className="text-4xl font-bold text-white mb-4">Welcome Back!</h2>
          <p className="text-slate-200 text-lg">"Travel is the only thing you buy that makes you richer."</p>
        </div>
      </div>

      {/* Right Side (Form) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative">
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition font-bold">
          <FaArrowLeft /> Back to Home
        </Link>

        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Log In</h1>
            <p className="text-slate-500">Enter your details to access your account.</p>
          </div>

          {/* Form with onSubmit Handler */}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><FaEnvelope /></div>
                <input type="email" placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-700"/>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <Link to="/forgot-password" class="text-xs font-bold text-blue-600 hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><FaLock /></div>
                <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-700"/>
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform active:scale-95">
              Sign In
            </button>
          </form>

          {/* ... Social buttons and footer remain the same ... */}
          <div className="my-8 flex items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="px-4 text-slate-400 text-sm font-medium">Or continue with</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 border border-slate-200 py-2.5 rounded-xl hover:bg-slate-50 transition font-medium text-slate-600"><FaGoogle className="text-red-500" /> Google</button>
            <button className="flex items-center justify-center gap-2 border border-slate-200 py-2.5 rounded-xl hover:bg-slate-50 transition font-medium text-slate-600"><FaFacebook className="text-blue-600" /> Facebook</button>
          </div>
          <p className="text-center mt-8 text-slate-500 text-sm">Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;