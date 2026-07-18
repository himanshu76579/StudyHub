import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState(''); // 🆕 Username state hook
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [branch, setBranch] = useState('ECE'); 
  const [rollNo, setRollNo] = useState('');      // 🆕 Roll Number state hook
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Build the payload package dynamically based on the chosen role
    const payload = {
      name,
      username,
      email,
      password,
      role,
      ...(role === 'student' && { branch, rollNo }) // Only append academic items if student
    };

    try {
      await API.post('/auth/register', payload);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 antialiased text-white">
      <div className="w-full max-w-md rounded-2xl bg-slate-800 p-8 border border-slate-700/60 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-blue-400">Create Account</h2>
          <p className="text-slate-400 text-sm mt-2">Join StudyHub to access and organize academic materials.</p>
        </div>

        {error && <div className="text-red-400 bg-red-900/30 border border-red-500/20 px-4 py-3 rounded-xl mb-4 text-sm">⚠️ {error}</div>}
        {success && <div className="text-green-400 bg-green-900/30 border border-green-500/20 px-4 py-3 rounded-xl mb-4 text-sm">✅ {success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Grid container for Name & Username */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" className="w-full rounded-xl bg-slate-700/50 border border-slate-600 px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="johndoe12" className="w-full rounded-xl bg-slate-700/50 border border-slate-600 px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@example.com" className="w-full rounded-xl bg-slate-700/50 border border-slate-600 px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
          </div>
          
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="w-full rounded-xl bg-slate-700/50 border border-slate-600 px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Account Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-xl bg-slate-700/50 border border-slate-600 px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all">
              <option value="student">Student</option>
              <option value="admin">Admin / Instructor</option>
            </select>
          </div>

          {/* 🔐 DYNAMIC STUDENT INFO SECTION: Only renders if user is a student */}
          {role === 'student' && (
            <div className="grid grid-cols-2 gap-4 border-t border-slate-700/50 pt-4 mt-2">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Roll Number</label>
                <input 
                  type="text" 
                  value={rollNo} 
                  onChange={(e) => setRollNo(e.target.value)} 
                  required={role === 'student'} 
                  placeholder="e.g. 2101110" 
                  className="w-full rounded-xl bg-slate-700/50 border border-slate-600 px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Academic Branch</label>
                <select value={branch} onChange={(e) => setBranch(e.target.value)} className="w-full rounded-xl bg-slate-700/50 border border-slate-600 px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all">
                  <option value="ECE">ECE</option>
                  <option value="CSE">CSE</option>
                  <option value="EE">EE</option>
                  <option value="ME">ME</option>
                  <option value="CE">CE</option>
                </select>
              </div>
            </div>
          )}
          
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-500 active:bg-blue-700 transition-all shadow-lg shadow-blue-900/30 disabled:opacity-50 mt-4">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-slate-400 text-sm">Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-all">Log in here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;