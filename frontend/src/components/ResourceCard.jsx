import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'; 
import { deleteResource } from '../redux/slices/resourceSlice'; 

const ResourceCard = ({ resource, currentUser }) => {
  const dispatch = useDispatch(); 

  // Smart Link Function
  const getValidUrl = (url) => {
    if (!url) return "#";
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }
    return url;
  };

  const linkToOpen = resource.type === 'link' 
    ? (resource.externalUrl || resource.fileUrl) 
    : resource.fileUrl;

  // 🌟 DELETE HANDLER (Ab ye directly Redux action fire karega)
 // 🌟 SMART DELETE HANDLER (Ab yeh error bhi batayega!)
 const handleDeleteClick = () => {
  const confirmDelete = window.confirm(`Are you sure you want to delete "${resource.title}"?`);
  if (confirmDelete) {
    
    // Dispatch ko unwrap karke success ya error check karenge
    dispatch(deleteResource(resource._id))
      .unwrap() // 👈 Yeh Redux ka magic function hai
      .then(() => {
        alert("✅ File deleted successfully!"); // Agar sab badhiya raha
      })
      .catch((error) => {
        // Agar fail hua, toh yeh pop-up asli problem dikhayega
        alert(`❌ Delete Failed: ${error.message || JSON.stringify(error)}`);
        console.error("Asli Error Detail:", error);
      });
  }
};

  return (
    <div className="bg-[#111111] p-6 rounded-xl border border-[#222] hover:border-[#444] transition-all shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className="bg-blue-900/30 text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {resource.category}
          </span>
          <span className="text-zinc-500 text-xs font-medium">Sem {resource.semester}</span>
        </div>
        
        <h3 className="text-xl font-bold text-zinc-100 mb-2 leading-tight line-clamp-2">
          {resource.title}
        </h3>
        
        <p className="text-sm text-zinc-400 mb-4 font-medium">
          📚 {resource.subject}
        </p>

        {/* 🌟 Uploader Info & Link */}
        {resource.uploadedBy && (
          <div className="flex items-center gap-2 mb-4">
            {/* Chhota Avatar */}
            <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-blue-400 text-xs font-bold">
              {resource.uploadedBy.name ? resource.uploadedBy.name.charAt(0).toUpperCase() : 'U'}
            </div>
            {/* Clickable Profile Link */}
            <Link 
              to={`/profile/${resource.uploadedBy._id}`} 
              className="text-sm text-zinc-400 hover:text-blue-400 hover:underline transition-colors"
            >
              Uploaded by <span className="text-zinc-300 font-medium">{resource.uploadedBy.name}</span>
            </Link>
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-[#222]">
        {/* Open/Download Link */}
        <a 
          href={getValidUrl(linkToOpen)} 
          target="_blank" 
          rel="noreferrer" 
          className="block text-center w-full bg-[#1a1a1a] hover:bg-blue-600 text-zinc-300 hover:text-white border border-[#333] hover:border-blue-600 py-2.5 rounded-lg font-semibold transition-colors cursor-pointer"
        >
          {resource.type === 'link' ? '🔗 Open External Link' : '📄 View / Download File'}
        </a>

        {/* 🌟 DELETE POWER: Maalik (Uploader) YA Admin dono ko dikhega */}
        {currentUser && (
          (resource.uploadedBy && currentUser._id === resource.uploadedBy._id) || 
          (currentUser.role === 'admin' || currentUser.role === 'superadmin')
        ) && (
          <button 
            onClick={handleDeleteClick}
            className="mt-3 w-full bg-red-900/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-900/50 hover:border-red-600 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Delete Resource
          </button>
        )}
      </div>
    </div>
  );
};

export default ResourceCard;