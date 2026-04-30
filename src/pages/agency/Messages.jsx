import React from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { FaWhatsapp, FaShieldAlt } from 'react-icons/fa';

const Messages = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex selection:bg-blue-500 selection:text-white pb-24">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-4 lg:p-10 flex items-center justify-center animate-fade-in-up">
        <div className="text-center p-10 md:p-14 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.06)] border border-slate-100 max-w-lg w-full relative overflow-hidden group">
          {/* Background decorations */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-100 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="w-28 h-28 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-green-100 group-hover:-translate-y-2 transition-transform duration-300">
            <FaWhatsapp className="text-6xl text-green-500" />
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Direct Messaging</h2>
          <p className="text-slate-500 text-lg leading-relaxed mb-8">
            To ensure the fastest response times and maximum trust between agencies and travelers, all direct communication happens securely on WhatsApp.
          </p>
          
          <div className="bg-slate-50 p-4 rounded-2xl mb-8 flex items-center justify-center gap-3 border border-slate-100 text-sm font-bold text-slate-600">
             <FaShieldAlt className="text-blue-500 text-lg" />
             End-to-End Encrypted
          </div>
          
          <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl shadow-[0_8px_20px_rgb(34,197,94,0.3)] hover:shadow-[0_8px_25px_rgb(34,197,94,0.4)] transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 text-lg">
            <FaWhatsapp className="text-2xl" /> Open WhatsApp Web
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;