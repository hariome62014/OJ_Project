import React from 'react'

const PanelTabButton = ({ children, active, onClick, icon, darkMode }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
      active
        ? `${darkMode ? "text-blue-400 border-b-2 border-blue-400" : "text-blue-600 border-b-2 border-blue-600"}`
        : `${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-800"}`
    }`}
  >
    {icon}
    {children}
  </button>
);

export default PanelTabButton