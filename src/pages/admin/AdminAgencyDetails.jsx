import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { agenciesAPI } from '../../api/endpoints';
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaUsers, FaMapMarkerAlt, FaFileAlt, FaImages, FaSuitcase, FaBuilding } from 'react-icons/fa';

const AdminAgencyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { verifyAgency, showAlert } = useAuth();

  const [agencyData, setAgencyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgencyData = async () => {
      try {
        const data = await agenciesAPI.getById(id);
        if (data.success) {
          setAgencyData(data);
        } else {
          showAlert("Error", "Could not load agency data", "error");
          navigate('/admin');
        }
      } catch (error) {
        console.error(error);
        showAlert("Error", "Failed to fetch agency", "error");
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };
    fetchAgencyData();
  }, [id, navigate, showAlert]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!agencyData || !agencyData.agency) return null;

  const { agency, tours, posts } = agencyData;

  const handleVerify = async () => {
    if (!window.confirm(`Are you sure you want to verify ${agency.name}?`)) return;
    await verifyAgency(agency.id);
    showAlert("Verified", "The agency has been verified successfully.", "success");
    setAgencyData({
      ...agencyData,
      agency: { ...agency, isVerified: true }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex text-slate-900 pb-24">
      <AdminSidebar />

      <div className="flex-1 lg:ml-64 pt-24 pb-12 px-6 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
        <Link to="/admin" className="inline-flex items-center gap-2 text-slate-500 hover:text-amber-500 mb-8 font-bold uppercase tracking-wider text-xs transition-colors">
          <FaArrowLeft /> Back to Admin Panel
        </Link>

        {/* Header */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 flex flex-col md:flex-row gap-8 items-center md:items-start mb-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 opacity-30">
            <img src={agency.cover || agency.avatar} alt="cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
          </div>
          
          <img src={agency.avatar} alt={agency.name} className="w-32 h-32 rounded-3xl object-cover border-4 border-white relative z-10 shadow-md" />
          
          <div className="flex-1 relative z-10 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
              <h1 className="text-4xl font-black text-slate-900">{agency.name}</h1>
              {agency.isVerified ? (
                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-xl text-xs font-bold uppercase flex items-center gap-1 border border-emerald-200">
                  <FaCheckCircle /> Verified Partner
                </span>
              ) : (
                <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-xl text-xs font-bold uppercase flex items-center gap-1 border border-amber-200">
                  <FaExclamationTriangle /> Pending Approval
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 text-sm font-medium mb-6">
              <span className="flex items-center gap-1"><FaMapMarkerAlt /> {agency.location}</span>
              <span className="flex items-center gap-1"><FaBuilding /> ID: {agency.id}</span>
              <span>{agency.email}</span>
            </div>

            {!agency.isVerified && (
              <button 
                onClick={handleVerify}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold uppercase tracking-wider text-sm transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 mx-auto md:mx-0 border-none"
              >
                <FaCheckCircle /> Verify This Agency
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-5 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-2xl border border-blue-100">
              <FaUsers />
            </div>
            <div>
              <span className="block text-slate-500 text-xs font-bold uppercase tracking-wider">Total Followers</span>
              <h3 className="text-3xl font-black text-slate-900 mt-0.5">{agency.followersCount || 0}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-5 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center text-2xl border border-purple-100">
              <FaSuitcase />
            </div>
            <div>
              <span className="block text-slate-500 text-xs font-bold uppercase tracking-wider">Active Offers</span>
              <h3 className="text-3xl font-black text-slate-900 mt-0.5">{tours ? tours.length : 0}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-5 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center text-2xl border border-pink-100">
              <FaImages />
            </div>
            <div>
              <span className="block text-slate-500 text-xs font-bold uppercase tracking-wider">Community Posts</span>
              <h3 className="text-3xl font-black text-slate-900 mt-0.5">{posts ? posts.length : 0}</h3>
            </div>
          </div>
        </div>

        {/* License & Verification Section */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mb-8">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <FaFileAlt className="text-amber-500" /> Verification Documents
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Tourism License Number</h3>
              <p className="text-xl font-bold text-slate-900 bg-slate-50 inline-block px-4 py-2 rounded-xl border border-slate-200">
                {agency.tourismLicenseNumber || <span className="text-slate-400 italic font-medium">Not Provided</span>}
              </p>
              
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                <h4 className="text-blue-700 font-bold flex items-center gap-2 mb-2">
                  <FaExclamationTriangle /> Admin Note
                </h4>
                <p className="text-blue-600 text-sm font-medium">
                  Please review the uploaded license document to ensure it matches the official Moroccan Tourism registry. Ensure the document is clear and legible before verifying the agency.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col items-center justify-center min-h-[250px] text-center">
              {agency.licenseDocumentUrl ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center text-3xl mb-4 border border-emerald-100">
                    <FaFileAlt />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Document Attached</h3>
                  <p className="text-slate-500 text-sm font-medium mb-6 max-w-xs">The agency uploaded a license document during registration.</p>
                  <a 
                    href={agency.licenseDocumentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-amber-500 text-white hover:bg-amber-600 px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-amber-500/20 active:scale-95 w-full text-center"
                  >
                    Open Document Fullscreen
                  </a>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-3xl mb-4 border border-red-100">
                    <FaExclamationTriangle />
                  </div>
                  <h3 className="font-bold text-lg text-red-600 mb-2">No Document Uploaded</h3>
                  <p className="text-slate-500 text-sm font-medium max-w-xs">This agency did not attach a document. You may need to request it manually.</p>
                </>
              )}
            </div>
          </div>
        </div>

        </div>
      </div>
    </div>
  );
};

export default AdminAgencyDetails;
