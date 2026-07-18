import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginSuccess } from '../redux/slices/authSlice';
import API from '../utils/api'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(''); 
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setErrorMsg(''); 

    try {
      const response = await API.post('/auth/login', { email, password });
      
      // Redux mein user data save kiya
      dispatch(loginSuccess(response.data));
      
      // ✅ UPDATED LOGIC: Role nikal kar sahi jagah bhejo!
      // ✅ UPDATED LOGIC: Dono Admin roles ko ek hi Hub par bhejo
      const userRole = response.data?.user?.role;
      
      if (userRole === 'superadmin' || userRole === 'admin') {
        navigate('/admin-hub'); // 👑 & 🛡️ Dono jayenge Command Center par
      } else {
        navigate('/dashboard'); // 👨‍🎓 Student apne Dashboard par jayega
      }
      
    } catch (error) {
      console.error("Login Error:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMsg(error.response.data.message); 
      } else {
        setErrorMsg("Kuch galat ho gaya, backend server on hai na?"); 
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#0a0a0a]">
      <div className="bg-[#111111] p-10 rounded-2xl border border-[#222] w-[400px] shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-blue-500 mb-2">Welcome Back</h2>
        <p className="text-center text-zinc-400 mb-8 text-sm">
          Log in to access your dashboard and study resources.
        </p>

        {/* Agar error aayega toh yahan laal box mein dikhega */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center mb-6">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-zinc-300 text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1a1a1a] text-white border border-[#333] p-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-zinc-300 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1a1a1a] text-white border border-[#333] p-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-zinc-400 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;