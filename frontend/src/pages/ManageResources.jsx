import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllResources } from '../redux/slices/resourceSlice';
import ResourceCard from '../components/ResourceCard';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

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
  ECE: { 1: ['General / Other Subjects'] /* Baaki add kar lena */ },
  ME: { 1: ['General / Other Subjects'] },
  CE: { 1: ['General / Other Subjects'] },
  EE: { 1: ['General / Other Subjects'] },
};

const ManageResources = () => {
  const dispatch = useDispatch();
  
  const authState = useSelector((state) => state.auth);
  const actualUser = authState.user?.user || authState.user;
  const { resources, loading: resourcesLoading } = useSelector((state) => state.resources);

  const [filterBranch, setFilterBranch] = useState('All');
  const [filterSemester, setFilterSemester] = useState('All');
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  const filterAvailableSubjects = (filterBranch !== 'All' && filterSemester !== 'All') 
    ? (subjectSyllabus[filterBranch]?.[filterSemester] || ['General / Other Subjects'])
    : [];

  useEffect(() => {
    setFilterSubject('All');
  }, [filterBranch, filterSemester]);

  useEffect(() => {
    dispatch(fetchAllResources());
  }, [dispatch]);

  const filteredResources = resources ? resources.filter((res) => {
    const matchBranch = filterBranch === 'All' || res.branch === filterBranch;
    const matchSem = filterSemester === 'All' || res.semester?.toString() === filterSemester;
    const matchSub = filterSubject === 'All' || res.subject === filterSubject;
    const matchCat = filterCategory === 'All' || res.category === filterCategory;
    return matchBranch && matchSem && matchSub && matchCat;
  }) : [];

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-zinc-300 font-sans pb-12">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12"> 
        
        {/* Header & Back Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <Link to="/admin" className="text-blue-500 hover:text-blue-400 text-sm font-semibold mb-2 inline-flex items-center gap-1">
              <span>←</span> Back to Upload Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-zinc-100 mt-2">🗑️ Manage Resources</h1>
          </div>
          <span className="mt-4 md:mt-0 bg-[#222] border border-[#333] text-blue-400 px-5 py-2 rounded-full text-sm font-bold">
            Total Found: {filteredResources.length}
          </span>
        </div>

        {/* 🎛️ ADMIN FILTER PANEL */}
        <div className="bg-[#111111] p-6 rounded-xl border border-[#222] mb-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="text-zinc-500 text-xs font-bold uppercase mb-2 block">Branch</label>
              <select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} className="w-full bg-[#0a0a0a] border border-[#333] text-zinc-300 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 outline-none">
                <option value="All">All Branches</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
                <option value="EE">EE</option>
              </select>
            </div>
            <div>
              <label className="text-zinc-500 text-xs font-bold uppercase mb-2 block">Semester</label>
              <select value={filterSemester} onChange={(e) => setFilterSemester(e.target.value)} className="w-full bg-[#0a0a0a] border border-[#333] text-zinc-300 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 outline-none">
                <option value="All">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => <option key={sem} value={sem}>Semester {sem}</option>)}
              </select>
            </div>
            <div>
              <label className="text-zinc-500 text-xs font-bold uppercase mb-2 block">Subject</label>
              <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="w-full bg-[#0a0a0a] border border-[#333] text-zinc-300 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 outline-none">
                <option value="All">All Subjects</option>
                {filterAvailableSubjects.map((sub, idx) => <option key={idx} value={sub}>{sub}</option>)}
              </select>
            </div>
            <div>
              <label className="text-zinc-500 text-xs font-bold uppercase mb-2 block">Type</label>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full bg-[#0a0a0a] border border-[#333] text-zinc-300 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 outline-none">
                <option value="All">All Types</option>
                <option value="Notes/PDF">Notes/PDF</option>
                <option value="Experiments">Experiments</option>
                <option value="Ref Videos">Ref Videos</option>
                <option value="Important Links">Important Links</option>
              </select>
            </div>
          </div>
        </div>

        {/* 🌟 CARDS GRID */}
        {resourcesLoading ? (
          <div className="text-center p-12"><p className="text-blue-500 animate-pulse font-medium">Fetching database...</p></div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-16 bg-[#111] rounded-xl border border-[#222] border-dashed">
            <p className="text-zinc-500 text-lg">Is filter ke hisaab se koi file nahi mili.</p>
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
  );
};

export default ManageResources;