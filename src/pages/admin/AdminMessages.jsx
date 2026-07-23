import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { FaPaperPlane, FaComments, FaSearch } from 'react-icons/fa';

const AdminMessages = () => {
  const { user, chats, sendMessageToThread } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const threads = (chats || []).filter(t => t.agencyId === user?.id);

  const threadParam = searchParams.get('thread');
  const [activeThreadId, setActiveThreadId] = useState(threadParam);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync state parameters during rendering to bypass useEffect rules
  const [prevThreadParam, setPrevThreadParam] = useState(threadParam);
  if (threadParam !== prevThreadParam) {
    setActiveThreadId(threadParam);
    setPrevThreadParam(threadParam);
  }

  const messagesEndRef = useRef(null);

  const activeThread = threads.find(t => t.id === activeThreadId);
  const activeMessagesLength = activeThread?.messages.length || 0;

  // Scroll to bottom of chat safely using primitive triggers
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeThreadId, activeMessagesLength]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThreadId) return;

    await sendMessageToThread(activeThreadId, replyText.trim());
    setReplyText('');
  };

  const handleSelectThread = (threadId) => {
    setActiveThreadId(threadId);
    setSearchParams({ thread: threadId });
  };

  // Filter threads by search query
  const filteredThreads = threads.filter(t => 
    t.travelerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex selection:bg-blue-500 selection:text-white">
      <AdminSidebar />

      <div className="flex-1 lg:ml-64 pt-24 pb-8 px-4 lg:p-10 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <div className="mb-6 shrink-0">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Message Center</h1>
          <p className="text-slate-500">Reply to travelers inquiring about your tour offers.</p>
        </div>

        {/* Dual Panel Messenger */}
        <div className="flex-1 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex overflow-hidden mb-6">
          
          {/* Left panel: Threads List */}
          <div className="w-full md:w-80 border-r border-slate-100 flex flex-col h-full bg-slate-50/50">
            {/* Search */}
            <div className="p-4 border-b border-slate-100 shrink-0">
              <div className="relative">
                <FaSearch className="absolute left-3.5 top-3 text-slate-400 text-sm" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chats..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl outline-none text-xs font-bold focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Threads Scrollable */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100/60">
              {filteredThreads.length > 0 ? (
                filteredThreads.map((t) => {
                  const isActive = t.id === activeThreadId;
                  const latestMsg = t.messages[t.messages.length - 1];
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleSelectThread(t.id)}
                      className={`w-full text-left p-4 transition-colors flex items-center gap-3 ${isActive ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-100/50'}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-extrabold shrink-0 shadow-sm">
                        {t.travelerName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h4 className="font-extrabold text-xs text-slate-800 truncate">{t.travelerName}</h4>
                          <span className="text-[9px] text-slate-400 font-medium shrink-0">
                            {latestMsg ? new Date(latestMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate font-medium">
                          {latestMsg ? latestMsg.text : 'No messages'}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">
                  No active chats
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Chat Window */}
          <div className="flex-1 flex flex-col h-full">
            {activeThread ? (
              <>
                {/* Active Chat Header */}
                <div className="p-4 border-b border-slate-100 flex items-center gap-3 shrink-0 bg-slate-50/30">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-extrabold">
                    {activeThread.travelerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800">{activeThread.travelerName}</h4>
                    <span className="text-[9px] font-bold text-green-500 uppercase tracking-wide">Traveler Client</span>
                  </div>
                </div>

                {/* Message Log */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40">
                  {activeThread.messages.map((msg) => {
                    const isMe = msg.senderId === user.id;
                    const isSystem = msg.senderId === 'system';

                    if (isSystem) {
                      return (
                        <div key={msg.id} className="text-center">
                          <span className="bg-blue-50 text-blue-600 text-xs font-extrabold px-4 py-1.5 rounded-full border border-blue-100 shadow-sm">
                            {msg.text}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-4 rounded-2xl text-sm font-medium ${isMe ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-500/10' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm'}`}>
                          <p>{msg.text}</p>
                          <span className={`block text-[10px] text-right mt-1.5 ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="p-4 border-t border-slate-100 flex gap-3 shrink-0 bg-white">
                  <input 
                    type="text" 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 bg-slate-50 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 border border-slate-200 focus:border-blue-500 transition-all"
                  />
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-all">
                    <FaPaperPlane />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center text-2xl border border-slate-100 shadow-inner">
                  <FaComments />
                </div>
                <p className="font-extrabold text-sm uppercase tracking-wider text-slate-400">Select a traveler thread to chat</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminMessages;