import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from "../redux/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // 1. Redux se poora auth state nikal rahe hain
  const authState = useSelector((state) => state.auth);
  
  // 2. Nested user ka perfect ilaj - ye exact user object nikalega
  const actualUser = authState.user?.user || authState.user;

  const handleLogout = () => {
    // Redux store aur localStorage dono se user ko hatayega
    dispatch(logout()); 
    // Wapas login page par bhej dega
    navigate('/login');  
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
      {/* Logo / Brand Name */}
      <div className="text-blue-400 font-extrabold text-2xl tracking-wide flex items-center gap-2">
        📚 StudyHub
      </div>
      
      {/* User Info & Logout Button */}
      <div className="flex items-center gap-5">
        <div className="hidden sm:block text-right">
          {/* 3. Yahan par actualUser use kiya gaya hai taaki naam aur role sahi dikhe */}
          <p className="text-slate-200 font-medium text-sm leading-tight">
            {actualUser?.name || 'Welcome!'}
          </p>
          <p className="text-blue-400 text-xs font-semibold capitalize">
            {actualUser?.role || 'Student'}
          </p>
        </div>
        
        <button 
          onClick={handleLogout}
          className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/50 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;