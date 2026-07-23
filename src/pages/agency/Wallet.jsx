import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { FaWallet, FaCreditCard, FaLock, FaCheckCircle, FaPlus } from 'react-icons/fa';

const Wallet = () => {
  const { user, topUpWallet } = useAuth();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [amount, setAmount] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fake form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const handlePay = async (e) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvc) {
      alert("Please fill out all card details.");
      return;
    }

    setIsProcessing(true);
    
    // Fake 2-second delay
    setTimeout(async () => {
      const res = await topUpWallet(amount);
      setIsProcessing(false);
      
      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setIsCheckoutOpen(false);
          setCardNumber('');
          setExpiry('');
          setCvc('');
        }, 2000);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex pb-24">
      <Sidebar />

      <div className="flex-1 lg:ml-64 pt-24 px-4 lg:p-10 animate-fade-in-up">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">My Wallet</h1>
          <p className="text-slate-500 text-lg">Manage your credits to boost tours and get more bookings.</p>
        </div>

        {/* Current Balance Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl max-w-lg mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <FaWallet className="text-2xl text-blue-400" />
            </div>
            <span className="font-bold text-slate-300 tracking-widest uppercase text-sm">Available Credits</span>
          </div>

          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-6xl font-black">{user?.credits || 0}</span>
            <span className="text-xl font-bold text-slate-400">CR</span>
          </div>

          <button 
            onClick={() => { setAmount(100); setIsCheckoutOpen(true); }}
            className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl transition-colors cursor-pointer flex justify-center items-center gap-2"
          >
            <FaPlus className="hidden" /> Add Credits
          </button>
        </div>

        {/* Pricing/Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          {[
            { credits: 50, price: 50, popular: false },
            { credits: 100, price: 90, popular: true },
            { credits: 500, price: 400, popular: false },
          ].map((pkg, idx) => (
            <div key={idx} className={`bg-white rounded-3xl p-6 border ${pkg.popular ? 'border-blue-500 shadow-blue-500/10 shadow-xl relative' : 'border-slate-100 shadow-sm'} cursor-pointer hover:border-blue-300 transition-colors`} onClick={() => { setAmount(pkg.credits); setIsCheckoutOpen(true); }}>
              {pkg.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</div>}
              <h3 className="text-2xl font-black text-slate-900 mb-1">{pkg.credits} Credits</h3>
              <p className="text-slate-500 font-medium mb-6">{pkg.price} MAD</p>
              <button className={`w-full py-2.5 rounded-xl font-bold transition-colors ${pkg.popular ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>Select</button>
            </div>
          ))}
        </div>

      </div>

      {/* Mock Stripe Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isProcessing && setIsCheckoutOpen(false)} />
          
          <div className="relative bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-scale-up">
            
            {isSuccess ? (
              <div className="text-center py-10">
                <FaCheckCircle className="text-6xl text-emerald-500 mx-auto mb-6 animate-bounce" />
                <h3 className="text-2xl font-black text-slate-900 mb-2">Payment Successful!</h3>
                <p className="text-slate-500 font-medium">Your wallet has been topped up.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Buy Credits</h3>
                    <p className="text-slate-500 text-sm">Secure checkout</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-2xl font-black text-blue-600">{amount}</span>
                    <span className="text-slate-400 text-xs font-bold uppercase">MAD</span>
                  </div>
                </div>

                <form onSubmit={handlePay}>
                  <div className="space-y-4 mb-8">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Card Information</label>
                      <div className="relative">
                        <FaCreditCard className="absolute left-4 top-3.5 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="0000 0000 0000 0000" 
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1">
                        <input 
                          type="text" 
                          placeholder="MM/YY" 
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <input 
                          type="text" 
                          placeholder="CVC" 
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-70 flex justify-center items-center gap-2 cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaLock className="text-slate-400" /> Pay {amount} MAD
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-slate-400 font-medium mt-4 flex items-center justify-center gap-1">
                    <FaLock /> Payments are secure and encrypted
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
