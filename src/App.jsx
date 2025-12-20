import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- IMPORT REAL PAGES ---
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import TourDetails from './pages/public/TourDetails';
import Search from './pages/public/Search';
import Agencies from './pages/public/Agencies';
import Community from './pages/public/Community'; // <--- Now using the real Community page
import MyOffers from './pages/agency/MyOffers';
import Bookings from './pages/agency/Bookings';
import Messages from './pages/agency/Messages';

// --- TRAVELER PAGES ---
import Profile from './pages/traveler/Profile';

// --- AGENCY PAGES ---
import AgencyDashboard from './pages/agency/Dashboard';
import CreateOffer from './pages/agency/CreateOffer';

function App() {
  return (
    <Router>
      <Routes>
        {/* === PUBLIC ROUTES === */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Discovery Routes */}
        <Route path="/search" element={<Search />} />       {/* Offers List */}
        <Route path="/agencies" element={<Agencies />} />   {/* Agencies List */}
        <Route path="/community" element={<Community />} /> {/* Social Feed */}

        {/* Detail Routes */}
        <Route path="/tour/:id" element={<TourDetails />} />

        {/* === TRAVELER ROUTES === */}
        <Route path="/traveler/profile" element={<Profile />} />

        {/* === AGENCY ROUTES === */}
        <Route path="/agency/dashboard" element={<AgencyDashboard />} />
        <Route path="/agency/create-offer" element={<CreateOffer />} />
        <Route path="/agency/dashboard" element={<AgencyDashboard />} />
        <Route path="/agency/create-offer" element={<CreateOffer />} />
        {/* NEW ROUTES */}
        <Route path="/agency/offers" element={<MyOffers />} />
        <Route path="/agency/bookings" element={<Bookings />} />
        <Route path="/agency/messages" element={<Messages />} />
      </Routes>
    </Router>
  );
}

export default App;