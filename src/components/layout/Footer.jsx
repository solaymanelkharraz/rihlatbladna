import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaGlobeAfrica, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white mb-6">
              <FaGlobeAfrica className="text-amber-500" />
              <span>Rihlat<span className="text-blue-500">Bladna</span></span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              The #1 Social Marketplace for authentic Moroccan travel. Connect with local agencies and discover hidden gems.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><FaFacebook /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all"><FaInstagram /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all"><FaTwitter /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Discover</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/search" className="hover:text-amber-500 transition-colors">Find Tours</Link></li>
              <li><Link to="/agencies" className="hover:text-amber-500 transition-colors">Top Agencies</Link></li>
              <li><Link to="/community" className="hover:text-amber-500 transition-colors">Travel Feed</Link></li>
              <li><Link to="/deals" className="hover:text-amber-500 transition-colors">Flash Deals</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Support</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/about" className="hover:text-amber-500 transition-colors">About Us</Link></li>
              <li><Link to="/agencies/join" className="hover:text-amber-500 transition-colors">Become a Partner</Link></li>
              <li><Link to="/contact" className="hover:text-amber-500 transition-colors">Contact Support</Link></li>
              <li><Link to="/terms" className="hover:text-amber-500 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Join the Newsletter</h3>
            <p className="text-xs text-slate-500 mb-4">Get the latest "Hidden Gem" locations sent to your inbox weekly.</p>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; 2025 RihlatBladna. Made with ❤️ in Tangier, Morocco.</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2"><FaPhone className="text-slate-600" /> +212 600 000 000</div>
            <div className="flex items-center gap-2"><FaEnvelope className="text-slate-600" /> support@rihlatbladna.ma</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;