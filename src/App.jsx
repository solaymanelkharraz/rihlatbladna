import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';

// --- PUBLIC PAGES ---
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import TourDetails from './pages/public/TourDetails';
import Search from './pages/public/Search';
import Agencies from './pages/public/Agencies';
import Community from './pages/public/Community';
import AgencyProfile from './pages/public/AgencyProfile';
import { About, Contact, Terms, Deals, ForgotPassword, NotFound } from './pages/public/StaticPages';

// --- TRAVELER PAGES ---
import Profile from './pages/traveler/Profile';

// --- AGENCY PAGES ---
import AgencyDashboard from './pages/agency/Dashboard';
import AgencyProfilePage from './pages/agency/Profile';
import CreateOffer from './pages/agency/CreateOffer';
import MyOffers from './pages/agency/MyOffers';
import Bookings from './pages/agency/Bookings';
import AgencyPostsPage from './pages/agency/Posts';
import AgencyCreateUpdatePage from './pages/agency/CreateUpdate';
import Messages from './pages/agency/Messages';
import AgencySettingsPage from './pages/agency/Settings';
import Wallet from './pages/agency/Wallet';

// --- ADMIN PAGES ---
import AdminPanel from './pages/admin/AdminPanel';
import AdminAgencyDetails from './pages/admin/AdminAgencyDetails';
import AdminPostsPage from './pages/admin/AdminPosts';
import AdminCreateUpdatePage from './pages/admin/AdminCreateUpdate';
import AdminMessages from './pages/admin/AdminMessages';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* === PUBLIC ROUTES === */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/search" element={<Search />} />
          <Route path="/agencies" element={<Agencies />} />
          <Route path="/agency/:id" element={<AgencyProfile />} />
          <Route path="/community" element={<Community />} />
          <Route path="/tour/:id" element={<TourDetails />} />

          {/* Footer & Static Info Links */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/deals" element={<Deals />} />

          {/* === TRAVELER ROUTES === */}
          <Route element={<PrivateRoute allowedRoles={['traveler']} />}>
            <Route path="/traveler/profile" element={<Profile />} />
          </Route>

          {/* === AGENCY ROUTES (Base) === */}
          <Route element={<PrivateRoute allowedRoles={['agency']} />}>
            <Route path="/agency/dashboard" element={<AgencyDashboard />} />
            <Route path="/agency/profile" element={<AgencyProfilePage />} />
            <Route path="/agency/settings" element={<AgencySettingsPage />} />
            <Route path="/settings" element={<Navigate to="/agency/settings" replace />} />
          </Route>

          {/* === AGENCY ROUTES (Verified Only) === */}
          <Route element={<PrivateRoute allowedRoles={['agency']} requireVerification={true} />}>
            <Route path="/agency/create-offer" element={<CreateOffer />} />
            <Route path="/agency/offers" element={<MyOffers />} />
            <Route path="/agency/bookings" element={<Bookings />} />
            <Route path="/agency/posts" element={<AgencyPostsPage />} />
            <Route path="/agency/story" element={<AgencyCreateUpdatePage />} />
            <Route path="/agency/create-update" element={<AgencyCreateUpdatePage />} />
            <Route path="/agency/messages" element={<Messages />} />
            <Route path="/agency/wallet" element={<Wallet />} />
          </Route>

          {/* === ADMIN ROUTES === */}
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/agency/:id" element={<AdminAgencyDetails />} />
            <Route path="/admin/posts" element={<AdminPostsPage />} />
            <Route path="/admin/story" element={<AdminCreateUpdatePage />} />
            <Route path="/admin/create-update" element={<AdminCreateUpdatePage />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>

          {/* === 404 ROUTE === */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;