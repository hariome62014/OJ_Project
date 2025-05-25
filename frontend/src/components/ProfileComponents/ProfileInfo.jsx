import React from 'react';
import { FaUser, FaEdit, FaGlobe, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const ProfileInfo = ({ user }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-24"></div>
      
      {/* Profile Content */}
      <div className="px-6 pb-6 relative">
        <div className="flex justify-center -mt-12 mb-4">
          <div className="relative">
            <img 
              src={user?.image || '/default-avatar.jpg'} 
              alt="Profile" 
              className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover"
            />
            <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
              <FaEdit size={14} />
            </button>
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">{user?.username}</h2>
          <p className="text-gray-600 dark:text-gray-400">Code Enthusiast</p>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 text-center">
            Passionate about solving problems and building amazing things with code.
            Competitive programmer and full-stack developer.
          </p>
        </div>

        {/* Social Links */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <FaGlobe className="text-gray-500 dark:text-gray-400" />
            <a href="#" className="text-blue-500 hover:underline">mywebsite.com</a>
          </div>
          <div className="flex items-center space-x-3">
            <FaGithub className="text-gray-500 dark:text-gray-400" />
            <a href="#" className="text-blue-500 hover:underline">github.com/{user?.username}</a>
          </div>
          <div className="flex items-center space-x-3">
            <FaLinkedin className="text-gray-500 dark:text-gray-400" />
            <a href="#" className="text-blue-500 hover:underline">linkedin.com/in/{user?.username}</a>
          </div>
          <div className="flex items-center space-x-3">
            <FaTwitter className="text-gray-500 dark:text-gray-400" />
            <a href="#" className="text-blue-500 hover:underline">twitter.com/{user?.username}</a>
          </div>
        </div>

        {/* Edit Button */}
        <button className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2">
          <FaEdit />
          <span>Edit Profile</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;