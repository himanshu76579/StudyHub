import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'; 
import { fetchAllResources } from '../redux/slices/resourceSlice';
import Navbar from '../components/Navbar';
import API from '../utils/api';

// 👇 Dynamic Syllabus Dictionary
const subjectSyllabus = {
  CSE: {
    1: ['Mathematics-I', 'Engineering Physics', 'Basic Electrical Engineering', 'Engineering Graphics', 'Introduction to Programming'],
    2: ['Mathematics-II', 'Engineering Chemistry', 'Communicative English', 'Elements of Mechanical Engineering', 'Basic Electronics'],
    3: ['Data Structures and Algorithms', 'Discrete Mathematics', 'Digital Logic Design', 'Object Oriented Programming', 'Computer Organization and Architecture'],
    4: ['Design and Analysis of Algorithms', 'Database Management Systems', 'Operating Systems', 'Formal Languages and Automata Theory', 'Probability and Statistics'],
    5: ['Computer Networks', 'Software Engineering', 'Microprocessors and Interfaces', 'Compiler Design', 'Web Technologies'],
    6: ['Artificial Intelligence', 'Machine Learning', 'Cryptography and Network Security', 'Computer Graphics', 'Advanced Java'],
    7: ['Cloud Computing', 'Internet of Things', 'Big Data Analytics', 'Mobile Computing'],
    8: ['Major Project', 'Seminar', 'Professional Ethics', 'General / Other Subjects'] 
  },
  ECE: {
    1: ['Engineering Chemistry', 'Engineering Mathematics', 'Introduction to Computing', 'Elements of Electronics Engineering', 'Electronics Workshop'],
    2: ['Engineering Physics', 'Communicative English', 'Elements of Electrical Engineering', 'Computer Hardware and Networking', 'Fundamentals of Communication Engineering'],
    3: ['Semiconductor Devices and Technology', 'Digital Electronics', 'Networks, Signals and Systems', 'Analog Electronics'],
    4: ['Electromagnetic Field Theory', 'Microprocessors & Microcontrollers', 'Digital Signal Processing', 'Object Oriented Programming'],
    5: ['Advanced Communication Engineering', 'Microwave Engineering', 'Control system', 'VLSI Design'],
    6: ['Wireless Communication', 'Antenna and Wave Propagation'],
    7: ['Optical Communication', 'Internet of Things'],
    8: ['General / Other Subjects'] 
  },
  ME: { 1: ['General / Other Subjects'] },
  CE: { 1: ['General / Other Subjects'] },
  EE: { 1: ['General / Other Subjects'] },
};

const AdminDashboard = () => {
  const dispatch = useDispatch();
  
  // ✅ Redux se Token aur User extract kiya
  const authState = useSelector((state) => state.auth);
  const actualToken = authState.token || authState.user?.token; 
  const actualUser = authState.user?.user || authState.user;

  // Form States
  const [title, setTitle] = useState('');
  const [type, setType] = useState('pdf');
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [branch, setBranch] = useState(actualUser?.branch || 'CSE');
  const [semester, setSemester] = useState(actualUser?.semester?.toString() || '1');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Notes/PDF');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const availableSubjects = subjectSyllabus[branch]?.[semester] || ['General / Other Subjects'];
  const fileInputRef = useRef(null);

  // Subject Update Logic
  useEffect(() => {
    setSubject(availableSubjects[0]);
  }, [branch, semester, availableSubjects]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData(); 
    formData.append('title', title);
    formData.append('type', type);         
    formData.append('branch', branch);
    formData.append('semester', semester);
    formData.append('subject', subject);
    formData.append('category', category); 

    if (type === 'link') {
      formData.append('externalUrl', url); 
    } else {
      if (!file) {
        setMessage('Please select a file to upload.');
        setLoading(false);
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { 
        setMessage('❌ Error: File size should be less than 10MB!');
        setLoading(false);
        return;
      }
      formData.append('file', file);
    }

    try {
      await API.post('/resources/upload', formData, {
        headers: { 
          Authorization: `Bearer ${actualToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setMessage('✅ Resource uploaded successfully!');
      setTitle('');
      setUrl('');
      setFile(null); 
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Upload ke baad background me list refresh kar lo
      dispatch(fetchAllResources());

    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.message || 'Upload failed'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-zinc-300 font-sans pb-12">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12"> 

        {/* 🌟 SMART NAVIGATION BANNER 🌟 */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-[#111] p-6 rounded-xl border border-[#222] shadow-lg">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h2 className="text-xl font-bold text-zinc-100">
              📤 Upload Module
            </h2>
            <p className="text-zinc-500 text-sm mt-1">Add new PDFs, notes, or external links for the students.</p>
          </div>
          
          <div>
            {/* 🌟 FIX: Sabhi Admins ko wapas Command Center (Hub) par bhejenge */}
            <Link 
              to="/admin-hub" 
              className="text-blue-500 hover:text-blue-400 font-semibold flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 rounded-lg border border-[#333] hover:border-blue-500/50 transition-all"
            >
              <span>←</span> Back to Command Center
            </Link>
          </div>
        </div>
        
        {/* 📤 UPLOAD FORM WALA SECTION */}
        <div className="bg-[#111111] border border-[#222] rounded-xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-zinc-100 mb-6">Upload Study Material</h1>

          {message && (
            <div className={`p-4 mb-6 rounded border ${message.includes('✅') ? 'bg-green-900/20 border-green-500/20 text-green-400' : 'bg-red-900/20 border-red-500/20 text-red-400'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Title / Topic Name</label>
              <input 
                type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#333] text-zinc-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                placeholder="e.g. Logic Gates Notes Chapter 1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Branch</label>
                <select 
                  value={branch} onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#333] text-zinc-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                >
                  <option value="CSE">Computer Science</option>
                  <option value="ECE">Electronics and Communication</option>
                  <option value="ME">Mechanical</option>
                  <option value="CE">Civil</option>
                  <option value="EE">Electrical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Semester</label>
                <select 
                  value={semester} onChange={(e) => setSemester(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#333] text-zinc-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Subject</label>
                <select 
                  value={subject} onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#333] text-zinc-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                >
                  {availableSubjects.map((sub, idx) => (
                    <option key={idx} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Category</label>
                <select 
                  value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#333] text-zinc-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                >
                  <option value="Notes/PDF">Notes/PDF</option>
                  <option value="Experiments">Experiments</option>
                  <option value="Ref Videos">Ref Videos</option>
                  <option value="Important Links">Important Links</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-[#222]">
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" value="pdf" checked={type === 'pdf'} onChange={() => setType('pdf')}
                    className="accent-blue-500"
                  />
                  <span className="text-zinc-300 text-sm">Upload PDF/Image</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" value="link" checked={type === 'link'} onChange={() => setType('link')}
                    className="accent-blue-500"
                  />
                  <span className="text-zinc-300 text-sm">External Link</span>
                </label>
              </div>

              {type === 'pdf' ? (
                <input 
                  type="file" accept=".pdf, image/*" required ref={fileInputRef} onChange={(e) => setFile(e.target.files[0])}
                  className="w-full text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#222] file:text-zinc-200 hover:file:bg-[#333] cursor-pointer"
                />
              ) : (
                <input 
                  type="url" required value={url} onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#333] text-zinc-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                  placeholder="https://youtube.com/..."
                />
              )}
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-6 disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload Resource'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;