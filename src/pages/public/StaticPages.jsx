import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FaGlobeAfrica, FaCompass, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

// Common wrapper to avoid repeating Navbar and Footer code
const PageWrapper = ({ title, children }) => (
  <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between selection:bg-blue-500 selection:text-white">
    <Navbar />
    <div className="flex-1 max-w-4xl mx-auto px-6 pt-36 pb-20 w-full animate-fade-in-up">
      <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">{title}</h1>
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 leading-relaxed text-slate-600 space-y-6">
        {children}
      </div>
    </div>
    <Footer />
  </div>
);

export const About = () => (
  <PageWrapper title="About Us">
    <p className="text-lg font-medium text-slate-700">
      Welcome to <strong>RihlatBladna</strong>, the #1 Social Marketplace for authentic Moroccan travel experiences.
    </p>
    <p>
      Our mission is simple: to connect local Moroccan travel agencies, tour operators, and guides directly with travelers around the world. We believe in travel that supports local economies, respects local culture, and uncovers the true, hidden gems of our beautiful country.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center">
        <h3 className="font-extrabold text-blue-600 text-2xl mb-1">Direct</h3>
        <p className="text-xs text-slate-500 font-medium">Cut out middleman fees and contact local experts directly.</p>
      </div>
      <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 text-center">
        <h3 className="font-extrabold text-amber-600 text-2xl mb-1">Authentic</h3>
        <p className="text-xs text-slate-500 font-medium">Enjoy customized itineraries from desert treks to local food walks.</p>
      </div>
      <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 text-center">
        <h3 className="font-extrabold text-emerald-600 text-2xl mb-1">Social</h3>
        <p className="text-xs text-slate-500 font-medium">Share updates and follow agencies to see new tour packages.</p>
      </div>
    </div>
  </PageWrapper>
);

export const Contact = () => {
  const { showAlert } = useAuth();
  return (
    <PageWrapper title="Contact Support">
      <p>Have questions about a trip or experiencing issues with your account? Our support team is here to help you.</p>
      <form className="space-y-4 pt-4" onSubmit={(e) => { e.preventDefault(); showAlert("Message Sent", "Message sent! We'll reply within 24 hours.", "success"); }}>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Your Name</label>
          <input type="text" placeholder="Soulayman Elkharraz" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all" required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
          <input type="email" placeholder="you@example.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all" required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
          <textarea rows="4" placeholder="How can we help you today?" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all resize-none" required></textarea>
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-colors">Send Message</button>
      </form>
    </PageWrapper>
  );
};

export const Terms = () => (
  <PageWrapper title="Terms of Service">
    <p className="text-xs text-slate-400">Last updated: June 2026</p>
    <h3 className="text-lg font-bold text-slate-800">1. Platform Nature</h3>
    <p>RihlatBladna is a social directory and listing marketplace. We do not operate tours, handle logistics, or collect traveler payments. All transactions are direct agreements between travelers and agencies.</p>
    <h3 className="text-lg font-bold text-slate-800">2. Account Safety</h3>
    <p>Users must provide accurate details. Agencies must hold valid local tourism licenses where applicable to maintain their verified checkmarks.</p>
    <h3 className="text-lg font-bold text-slate-800">3. Code of Conduct</h3>
    <p>Spamming, posting deceptive reviews, or listing fraudulent offers will result in immediate profile suspension by our admins.</p>
  </PageWrapper>
);

export const Deals = () => (
  <PageWrapper title="Flash Deals">
    <p className="text-lg text-slate-500 mb-8">Exclusive, limited-time discounts uploaded by our premier agencies.</p>
    <div className="bg-gradient-to-r from-red-500 to-amber-500 p-8 rounded-3xl text-white relative overflow-hidden shadow-lg mb-8">
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
      <span className="bg-white text-red-600 font-extrabold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4 inline-block">Deal of the Week</span>
      <h3 className="text-3xl font-black mb-2">Merzouga Desert Camp</h3>
      <p className="mb-6 opacity-90 text-sm">3 Days / 2 Nights camel trek with traditional music, private tents, and sunset dune views.</p>
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-4xl font-black">1,200 DH</span>
        <span className="text-sm line-through opacity-60">2,500 DH</span>
      </div>
      <Link to="/tour/tour_1" className="bg-white text-slate-900 font-bold px-8 py-3 rounded-xl shadow-md hover:bg-slate-100 transition-colors inline-block text-sm">View Trip Details</Link>
    </div>
  </PageWrapper>
);

export const ForgotPassword = () => {
  const { showAlert } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 font-sans text-slate-800">
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 text-center animate-fade-in">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6">
          <FaShieldAlt />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Reset Password</h1>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">Enter your email and we'll send a code to reset your password.</p>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); showAlert("Recovery Email", "Recovery link sent if account exists!", "success"); }}>
          <input type="email" placeholder="you@example.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-colors" required />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-colors">Send Reset Link</button>
        </form>
        <Link to="/login" className="block text-slate-400 hover:text-blue-600 text-sm font-bold mt-6 transition-colors">Back to Log In</Link>
      </div>
    </div>
  );
};

export const NotFound = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 font-sans text-slate-800 text-center">
    <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-4xl mb-8 animate-bounce">
      <FaCompass />
    </div>
    <h1 className="text-7xl md:text-8xl font-black text-slate-900 tracking-tighter mb-4 leading-none">404</h1>
    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-4">Destination Not Found</h2>
    <p className="text-slate-500 text-lg max-w-md mb-8 leading-relaxed">The page you are looking for has been moved, renamed, or doesn't exist in our itinerary.</p>
    <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg transition-colors hover:-translate-y-0.5 transform active:scale-95 duration-200">Go Back Home</Link>
  </div>
);
