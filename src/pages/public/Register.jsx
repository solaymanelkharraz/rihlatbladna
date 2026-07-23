import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaBuilding, FaArrowLeft, FaExclamationCircle, FaPhone, FaMapMarkerAlt, FaIdCard, FaUpload, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [role, setRole] = useState('traveler'); // 'traveler' or 'agency'
  const [step, setStep] = useState(1); // Used for agency wizard
  
  // Step 1: Auth
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Step 2: Business Details
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [tourismLicenseNumber, setTourismLicenseNumber] = useState('');
  const [licenseDocumentUrl, setLicenseDocumentUrl] = useState('');
  
  // Step 3: Branding
  const [logoPreview, setLogoPreview] = useState(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNextStep = (e) => {
    e.preventDefault();
    setError('');
    if (step === 1 && (!name || !email || !password)) {
      return setError('Please fill out all auth fields.');
    }
    if (step === 2 && (!phone || !city || !tourismLicenseNumber)) {
      return setError('Please fill out all business details including your Tourism License.');
    }
    setStep(step + 1);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await register(name, email, password, role, tourismLicenseNumber, licenseDocumentUrl);
    if (res.success) {
      if (role === 'agency') {
        navigate('/agency/dashboard');
      } else {
        navigate('/traveler/profile');
      }
    } else {
      setError(res.error);
      setLoading(false);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
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
            <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
              {role === 'agency' && step > 1 ? "Agency Onboarding" : "Create Account"}
            </h1>
            <p className="text-slate-500 text-lg">
              {role === 'agency' 
                ? step === 1 ? "Step 1: Account Setup" 
                : step === 2 ? "Step 2: Business Details" 
                : "Step 3: Branding & Finish"
                : "Join RihlatBladna today."}
            </p>
            {role === 'agency' && (
              <div className="flex justify-center gap-2 mt-4">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`h-2 rounded-full transition-all duration-500 ${step >= s ? 'w-8 bg-purple-600 shadow-md shadow-purple-500/30' : 'w-4 bg-slate-200'}`} />
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-2xl text-sm font-semibold mb-6 flex items-center gap-2 animate-shake">
              <FaExclamationCircle className="text-lg shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Switcher (Only visible on Step 1) */}
          {step === 1 && (
            <div className="bg-slate-100 p-1.5 rounded-2xl flex mb-8 shadow-inner">
              <button 
                type="button"
                onClick={() => { setRole('traveler'); setStep(1); }}
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
          )}

          <form className="space-y-6" onSubmit={role === 'traveler' || step === 3 ? handleRegister : handleNextStep}>
            
            {/* STEP 1: Basic Auth */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
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
                      placeholder="agency@example.com" 
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
              </div>
            )}

            {/* STEP 2: Business Details (Agency Only) */}
            {role === 'agency' && step === 2 && (
              <div className="space-y-6 animate-fade-in">
                {/* Phone Number */}
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-purple-600">Business Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 transition-colors group-focus-within:text-purple-500">
                      <FaPhone />
                    </div>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+212 600 000000" 
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                      required
                    />
                  </div>
                </div>

                {/* City */}
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-purple-600">HQ City</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 transition-colors group-focus-within:text-purple-500">
                      <FaMapMarkerAlt />
                    </div>
                    <input 
                      type="text" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Marrakech" 
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                      required
                    />
                  </div>
                </div>

                {/* Tourism License Number */}
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-purple-600">
                    Moroccan Tourism License Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 transition-colors group-focus-within:text-purple-500">
                      <FaIdCard />
                    </div>
                    <input 
                      type="text" 
                      value={tourismLicenseNumber}
                      onChange={(e) => setTourismLicenseNumber(e.target.value)}
                      placeholder="Enter your official license ID" 
                      className="w-full pl-11 pr-4 py-3.5 bg-purple-50 border border-purple-200 rounded-2xl focus:bg-white outline-none transition-all font-medium text-slate-700 placeholder:text-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Required to verify your agency for B2B features.</p>
                </div>

                {/* License Document Upload */}
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-purple-600">
                    Upload License Document (PDF/Image) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            setError('Document must be smaller than 5MB');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setLicenseDocumentUrl(reader.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white outline-none transition-all font-medium text-slate-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                      required
                    />
                  </div>
                  {licenseDocumentUrl && <p className="text-xs text-green-600 mt-2 font-bold flex items-center gap-1"><FaCheckCircle /> Document attached successfully</p>}
                </div>
              </div>
            )}

            {/* STEP 3: Branding (Agency Only) */}
            {role === 'agency' && step === 3 && (
              <div className="space-y-6 animate-fade-in text-center">
                <div className="mb-6">
                  <div className="w-32 h-32 mx-auto rounded-[2rem] border-4 border-slate-100 bg-slate-50 flex flex-col items-center justify-center overflow-hidden relative shadow-lg group">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <FaUpload className="text-3xl text-slate-300 mb-2 group-hover:text-purple-500 transition-colors" />
                        <span className="text-xs font-bold text-slate-400 group-hover:text-purple-600">Upload Logo</span>
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-4 font-medium">Make a great first impression. You can also skip and add this later.</p>
                </div>

                <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 p-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2">
                  <FaCheckCircle className="text-lg" />
                  <span>You're all set to join RihlatBladna!</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              {role === 'agency' && step > 1 && (
                <button 
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-4 rounded-2xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors active:scale-95"
                >
                  Back
                </button>
              )}
              <button 
                type="submit"
                disabled={loading}
                className={`flex-1 text-white font-bold py-4 rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex justify-center items-center gap-2 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                } ${
                  role === 'traveler' 
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 hover:shadow-blue-600/30' 
                    : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20 hover:shadow-purple-600/30'
                }`}
              >
                {loading ? "Processing..." : (role === 'agency' && step < 3) ? (
                  <>Continue <FaArrowRight /></>
                ) : (
                  "Complete Registration"
                )}
              </button>
            </div>
          </form>

          {step === 1 && (
            <p className="text-center mt-10 text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className={`font-bold hover:underline transition-colors ${role === 'traveler' ? 'text-blue-600 hover:text-blue-700' : 'text-purple-600 hover:text-purple-700'}`}>
                Log in here
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;