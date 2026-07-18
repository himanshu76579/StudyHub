import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import SuperAdmin from './pages/SuperAdmin.jsx';
import SuperDashboard from './pages/SuperDashboard.jsx'; 
import Navbar from './components/Navbar.jsx'; 
// 👇 YAHAN FIX KIYA HAI: Purana AdminDashboard hata kar UploadResource import kiya
import UploadResource from './pages/UploadResource.jsx'; 
import StudentDashboard from './pages/StudentDashboard.jsx';
import UserProfile from './pages/UserProfile.jsx';
import ManageResources from './pages/ManageResources.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* SMART HUB */}
        <Route path="/admin-hub" element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}> 
            <SuperDashboard />
          </ProtectedRoute>
        } />

        {/* GATEKEEPER ROUTE */}
        <Route path="/super-admin" element={
          <ProtectedRoute allowedRoles={['superadmin']}> 
            <SuperAdmin />
          </ProtectedRoute>
        } />

        {/* STUDENT DASHBOARD */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['student', 'admin', 'superadmin']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />

        {/* PROFILE ROUTE */}
        <Route path="/profile/:id" element={
          <ProtectedRoute allowedRoles={['student', 'admin', 'superadmin']}>
            <UserProfile />
          </ProtectedRoute>
        } />

        {/* ADMIN UPLOAD PAGE */}
        <Route path="/admin/upload" element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
            {/* 👇 YAHAN FIX KIYA HAI: Component ka naam UploadResource kar diya */}
            <UploadResource /> 
          </ProtectedRoute>
        } />

        {/* ADMIN MANAGE PAGE */}
        <Route path="/admin/manage" element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
            <ManageResources />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;