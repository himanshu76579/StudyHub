import { useState, useEffect } from 'react';
import API from '../utils/api';

const SuperAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Fetch the list of pending admins when the panel loads
  useEffect(() => {
    fetchPendingAdmins();
  }, []);

  const fetchPendingAdmins = async () => {
    try {
      const res = await API.get('/auth/pending-admins');
      setRequests(res.data);
    } catch (err) {
      console.error('Failed to load pending applications', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. The action trigger to allow the account
  const handleApprove = async (id) => {
    try {
      const res = await API.put(`/auth/approve-admin/${id}`);
      setMessage(res.data.message);
      
      // Remove the newly approved admin from the active screen view list immediately
      setRequests(requests.filter(req => req._id !== id));
      
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error('Approval execution failed', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8 text-white antialiased">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-blue-400">Gatekeeper Command Deck</h1>
          <p className="text-slate-400 mt-2">Authorize or reject incoming instructor/admin registration requests.</p>
        </header>

        {message && (
          <div className="bg-green-900/40 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl mb-6 text-sm">
            ✅ {message}
          </div>
        )}

        {loading ? (
          <p className="text-slate-500">Scanning database collections...</p>
        ) : requests.length === 0 ? (
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700/50 text-center">
            <p className="text-slate-400">No pending admin authorization requests found.</p>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-700/40 text-slate-300 text-sm font-semibold border-b border-slate-700">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-700/20 transition-all">
                    <td className="p-4 font-medium text-slate-200">{req.name}</td>
                    <td className="p-4 text-slate-400">{req.email}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleApprove(req._id)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all shadow-md shadow-blue-900/20 active:scale-95"
                      >
                        Grant Access
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default SuperAdmin;