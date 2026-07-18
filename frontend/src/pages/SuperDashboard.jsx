import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const SuperDashboard = () => {
  const authState = useSelector((state) => state.auth);
  const actualUser = authState.user?.user || authState.user;
  
  // ✅ Check kar rahe hain ki banda superadmin hai ya normal admin
  const isSuper = actualUser?.role === 'superadmin';

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-zinc-300 font-sans pb-12">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 py-16">
        
        {/* HEADER SECTION */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 mb-3">
            {isSuper ? 'Supreme Command Center 👑' : 'Admin Command Center 🛡️'}
          </h1>
          <p className="text-zinc-400 text-lg">
            Welcome back, <span className="text-zinc-200 font-semibold">{actualUser?.name || 'Admin'}</span>. Choose a module to proceed.
          </p>
        </div>

        {/* 🌟 CARDS GRID 🌟 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: UPLOAD RESOURCE (Sabke liye) */}
          <Link 
            to="/admin/upload" 
            className="group bg-[#111] border border-[#222] hover:border-blue-500 rounded-2xl p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] flex flex-col items-center text-center hover:-translate-y-2"
          >
            <div className="w-16 h-16 bg-blue-900/20 text-blue-400 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
              📤
            </div>
            <h2 className="text-xl font-bold text-zinc-100 mb-2">Upload Resource</h2>
            <p className="text-zinc-500 text-sm">Add new PDFs, notes, or links for students.</p>
          </Link>

          {/* Card 2: MANAGE & DELETE RESOURCE (Sabke liye) */}
          <Link 
            to="/admin/manage" 
            className="group bg-[#111] border border-[#222] hover:border-red-500 rounded-2xl p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] flex flex-col items-center text-center hover:-translate-y-2"
          >
            <div className="w-16 h-16 bg-red-900/20 text-red-400 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
              🗑️
            </div>
            <h2 className="text-xl font-bold text-zinc-100 mb-2">Manage Resources</h2>
            <p className="text-zinc-500 text-sm">Filter, find, and delete existing study materials.</p>
          </Link>

          {/* Card 3: GRANT ACCESS (GATEKEEPER) - SIRF SUPER ADMIN KE LIYE */}
          {isSuper && (
            <Link 
              to="/super-admin" 
              className="group bg-[#111] border border-[#222] hover:border-indigo-500 rounded-2xl p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] flex flex-col items-center text-center hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-indigo-900/20 text-indigo-400 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                🔐
              </div>
              <h2 className="text-xl font-bold text-zinc-100 mb-2">Grant Access</h2>
              <p className="text-zinc-500 text-sm">Approve or reject new admin registration requests.</p>
            </Link>
          )}

        </div>
      </div>
    </div>
  );
};

export default SuperDashboard;