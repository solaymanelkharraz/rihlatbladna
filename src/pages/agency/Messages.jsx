import React from 'react';
import Sidebar from '../../components/layout/Sidebar';

const Messages = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-8 flex items-center justify-center">
        <div className="text-center p-12 bg-white rounded-3xl shadow-sm border border-slate-100 max-w-lg">
          <img src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png" alt="Chat" className="w-24 h-24 mx-auto mb-6 opacity-50" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Messages</h2>
          <p className="text-slate-500">
            For now, all communication happens directly on WhatsApp for better trust and speed.
          </p>
          <button className="mt-6 bg-green-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-600 transition">
            Open WhatsApp Web
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;