import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../utils/api';

const UserProfile = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Backend se naye route par call
        const res = await API.get(`/auth/user/${id}`);
        setProfileData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-slate-900 min-h-screen font-sans">
        <Navbar />
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900 min-h-screen font-sans">
        <Navbar />
        <div className="text-center py-20 text-red-500 font-bold text-xl">{error}</div>
      </div>
    );
  }

  const { profile, notes } = profileData;

  return (
    <div className="bg-slate-900 min-h-screen text-slate-200 font-sans">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* User Info Card */}
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl mb-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-4xl shadow-lg border-4 border-slate-900">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-white mb-2">{profile.name}</h1>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
  <span className="px-3 py-1 bg-slate-700 text-blue-300 text-sm font-bold rounded-full">
    {profile.role.toUpperCase()}
  </span>
  <span className="px-3 py-1 bg-slate-700 text-slate-300 text-sm font-medium rounded-full">
    {profile.branch || 'Branch N/A'}
  </span>
  {/* 👇 Naya Contact Info (Email) Button */}
  {profile.email && (
    <a 
      href={`mailto:${profile.email}`} 
      className="px-3 py-1 bg-slate-800 border border-slate-600 text-slate-400 hover:text-white hover:border-blue-400 text-sm font-medium rounded-full transition-colors flex items-center gap-1"
      title="Send Email"
    >
      <span>✉️</span> {profile.email}
    </a>
  )}
</div>
          </div>
          <div className="md:ml-auto text-center bg-slate-900 px-6 py-4 rounded-xl border border-slate-700">
            <div className="text-3xl font-bold text-blue-400">{notes.length}</div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Uploads</div>
          </div>
        </div>

        {/* User's Uploaded Resources List */}
        <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-3">
          Contributions by {profile.name}
        </h2>

        {notes.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <p className="text-slate-400">No resources uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {notes.map((note) => (
              <div key={note._id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center hover:border-blue-500/50 transition-colors">
                <div>
                  <h3 className="text-white font-bold mb-1">{note.title}</h3>
                  <p className="text-xs text-slate-400">
                    {note.type.toUpperCase()} • {note.branch} • Sem {note.semester}
                  </p>
                </div>
                <a 
                  href={note.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;