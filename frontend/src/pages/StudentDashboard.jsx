import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllResources } from '../redux/slices/resourceSlice';
import ResourceCard from '../components/ResourceCard';
import Navbar from '../components/Navbar';

// 📚 Dynamic Syllabus Dictionary (Tumhara purana wala)
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

const categories = ['All', 'Notes/PDF', 'Experiments', 'Ref Videos', 'Important Links'];
const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

const StudentDashboard = () => {
  const dispatch = useDispatch();
  
  // 1. Get User and Resources from Redux
  const authState = useSelector((state) => state.auth);
  const actualUser = authState.user?.user || authState.user;
  const { resources, loading } = useSelector((state) => state.resources);

  // 2. Setup States for Filtering (Branch fixed hai user ke hisaab se)
  const userBranch = actualUser?.branch || 'CSE'; 
  const [selectedSem, setSelectedSem] = useState(actualUser?.semester?.toString() || '1');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Available subjects based on branch and selected semester
  const availableSubjects = subjectSyllabus[userBranch]?.[selectedSem] || ['General / Other Subjects'];

  // Fetch all resources on page load
  useEffect(() => {
    dispatch(fetchAllResources());
  }, [dispatch]);

  // Jab bhi Semester change ho, Subject ko wapas 'All' par set kar do
  useEffect(() => {
    setSelectedSubject('All');
  }, [selectedSem]);

  // 🌟 THE MAGIC FILTER LOGIC
  const filteredResources = resources.filter((res) => {
    const matchBranch = res.branch === userBranch;
    const matchSem = res.semester?.toString() === selectedSem;
    const matchSub = selectedSubject === 'All' || res.subject === selectedSubject;
    const matchCat = selectedCategory === 'All' || res.category === selectedCategory;
    
    // Sirf wahi dikhega jo in chaaro (Branch -> Sem -> Sub -> Cat) conditions ko pass karega
    return matchBranch && matchSem && matchSub && matchCat;
  });

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-zinc-300 font-sans pb-12">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100">📚 Student Hub</h1>
          <p className="text-zinc-500 mt-2">Showing resources for <strong className="text-blue-400">{userBranch}</strong> Branch</p>
        </div>

        {/* 🎛️ MASTER FILTER PANEL */}
        <div className="bg-[#111111] p-6 rounded-xl border border-[#222] mb-8 shadow-lg">
          
          {/* STEP 1: SEMESTER SELECTOR */}
          <div className="mb-6 border-b border-[#333] pb-6">
            <label className="text-zinc-400 text-sm font-medium mb-3 block">1. Select Semester:</label>
            <div className="flex flex-wrap gap-2">
              {semesters.map((sem) => (
                <button
                  key={sem}
                  onClick={() => setSelectedSem(sem)}
                  className={`w-12 h-12 rounded-full font-bold transition-all ${
                    selectedSem === sem 
                      ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                      : 'bg-[#222] text-zinc-400 hover:bg-[#333] hover:text-white'
                  }`}
                >
                  {sem}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2: SUBJECT SELECTOR */}
          <div className="mb-6 border-b border-[#333] pb-6">
            <label className="text-zinc-400 text-sm font-medium mb-2 block">2. Select Subject:</label>
            <select 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full md:w-1/2 bg-[#0a0a0a] border border-[#333] text-zinc-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="All">📚 All Subjects (Semester {selectedSem})</option>
              {availableSubjects.map((sub, idx) => (
                <option key={idx} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* STEP 3: CATEGORY TABS */}
          <div>
            <label className="text-zinc-400 text-sm font-medium mb-3 block">3. Select Material Type:</label>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === cat 
                      ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(22,163,74,0.4)]' 
                      : 'bg-[#222] text-zinc-400 hover:bg-[#333] hover:text-zinc-200'
                  }`}
                >
                  {cat === 'All' ? 'View All Types' : cat}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* 🌟 RESULTS SECTION */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-zinc-100 flex-1 truncate">
              {selectedSubject === 'All' ? `All Semester ${selectedSem} Subjects` : selectedSubject} 
            </h2>
            <span className="bg-[#222] border border-[#333] text-blue-400 px-4 py-1.5 rounded-full text-sm font-bold ml-4 whitespace-nowrap">
              {filteredResources.length} Results
            </span>
          </div>

          {loading ? (
            <div className="text-center p-12">
               <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
               <p className="text-blue-500 font-medium">Fetching resources...</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-16 bg-[#111] rounded-xl border border-[#222] border-dashed">
              <span className="text-4xl mb-4 block">📭</span>
              <p className="text-zinc-400 text-lg mb-2">No materials found for this filter.</p>
              <p className="text-zinc-600 text-sm">Try changing the subject or category!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((res) => (
                <ResourceCard key={res._id} resource={res} currentUser={actualUser} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;