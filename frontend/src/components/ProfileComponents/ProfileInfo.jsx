// import React from 'react';
// import { useSelector } from 'react-redux';
// import { 
//   FaUser, 
//   FaEdit, 
//   FaGlobe, 
//   FaGithub, 
//   FaLinkedin, 
//   FaTwitter,
//   FaCode,
//   FaTrophy,
//   FaCalendarAlt
// } from 'react-icons/fa';

// const ProfileInfo = ({ darkMode, stats }) => {
//   const { user } = useSelector((state) => state.profile);
  
//   // Default values if data isn't available
//   const userData = {
//     username: user?.username || 'Username',
//     email: user?.email || 'user@example.com',
//     image: user?.image || '/default-avatar.jpg',
//     role: user?.role || 'user',
//     joinedDate: user?.createdAt || new Date().toISOString(),
//     bio: "Passionate about solving problems and building amazing things with code.",
//     socialLinks: {
//       website: '#',
//       github: `https://github.com/${user?.username || 'user'}`,
//       linkedin: `https://linkedin.com/in/${user?.username || 'user'}`,
//       twitter: `https://twitter.com/${user?.username || 'user'}`
//     }
//   };

//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   return (
//     <div className={`rounded-xl overflow-hidden shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-6`}>
//       {/* Profile Header */}
//       <div className={`h-24 ${darkMode ? 'bg-gradient-to-r from-blue-700 to-purple-800' : 'bg-gradient-to-r from-blue-500 to-purple-600'}`}></div>
      
//       {/* Profile Content */}
//       <div className="px-6 pb-6 relative">
//         <div className="flex justify-center -mt-12 mb-4">
//           <div className="relative">
//             <img 
//               src={userData.image} 
//               alt="Profile" 
//               className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover"
//             />
//             <button 
//               className={`absolute bottom-0 right-0 p-2 rounded-full ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
//               aria-label="Edit profile"
//             >
//               <FaEdit size={14} />
//             </button>
//           </div>
//         </div>

//         <div className="text-center mb-6">
//           <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//             {userData.username}
//           </h2>
         
//         </div>

      
//         <div className="mb-6">
//           <p className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//             {userData.bio}
//           </p>
//         </div>

//         {/* User Details */}
//         <div className="space-y-3 mb-6">
//           <div className={`flex items-center p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
//             <FaUser className={`mr-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
//             <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{userData.email}</span>
//           </div>
//           <div className={`flex items-center p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
//             <FaCode className={`mr-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
//             <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
//               {Object.keys(stats?.languages || {}).join(', ') || 'No languages yet'}
//             </span>
//           </div>
//           <div className={`flex items-center p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
//             <FaCalendarAlt className={`mr-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
//             <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
//               Joined {formatDate(userData.joinedDate)}
//             </span>
//           </div>
//         </div>

      

        
//       </div>
//     </div>
//   );
// };

// export default ProfileInfo;


import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaUser, 
  FaEdit, 
  FaGlobe, 
  FaGithub, 
  FaLinkedin, 
  FaTwitter,
  FaCode,
  FaTrophy,
  FaCalendarAlt
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { updateProfilePicture } from '../../../services/operations/ProfileAPI'; // Import your Redux action

const ProfileInfo = ({ darkMode, stats }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);

  // Default values if data isn't available
  const userData = {
    username: user?.username || 'Username',
    email: user?.email || 'user@example.com',
    image: user?.image || '/default-avatar.jpg',
    role: user?.role || 'user',
    joinedDate: user?.createdAt || new Date().toISOString(),
    bio: "Passionate about solving problems and building amazing things with code.",
    socialLinks: {
      website: '#',
      github: `https://github.com/${user?.username || 'user'}`,
      linkedin: `https://linkedin.com/in/${user?.username || 'user'}`,
      twitter: `https://twitter.com/${user?.username || 'user'}`
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    try {
      
      // Dispatch the Redux action to update profile picture
const response = await updateProfilePicture({ token, file });

      toast.success("Profile Picture Updated Successfully");
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "An error occurred while updating the profile picture1";
      toast.error(errorMessage);
    }
  };

  return (
    <div className={`rounded-xl overflow-hidden shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-6`}>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {/* Profile Header */}
      <div className={`h-24 ${darkMode ? 'bg-gradient-to-r from-blue-700 to-purple-800' : 'bg-gradient-to-r from-blue-500 to-purple-600'}`}></div>
      
      {/* Profile Content */}
      <div className="px-6 pb-6 relative">
        <div className="flex justify-center -mt-12 mb-4">
          <div className="relative">
            <img 
              src={userData.image} 
              alt="Profile" 
              className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover"
            />
            <button 
              onClick={handleEditClick}
              className={`absolute bottom-0 right-0 p-2 rounded-full ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
              aria-label="Edit profile picture"
            >
              <FaEdit size={14} />
            </button>
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {userData.username}
          </h2>
         
        </div>

        <div className="mb-6">
          <p className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {userData.bio}
          </p>
        </div>

        {/* User Details */}
        <div className="space-y-3 mb-6">
          <div className={`flex items-center p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <FaUser className={`mr-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{userData.email}</span>
          </div>
          <div className={`flex items-center p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <FaCode className={`mr-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              {Object.keys(stats?.languages || {}).join(', ') || 'No languages yet'}
            </span>
          </div>
          <div className={`flex items-center p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <FaCalendarAlt className={`mr-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              Joined {formatDate(userData.joinedDate)}
            </span>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default ProfileInfo;