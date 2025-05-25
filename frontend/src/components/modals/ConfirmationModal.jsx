import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const ConfirmationModal = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  message ,
  darkMode,
  actionToBeTaken
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Enhanced blur background with fade-in animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onCancel}
          />
          
          {/* Modal content with slide-up animation */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className={`relative z-50 w-full max-w-md rounded-xl shadow-2xl overflow-hidden ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            {/* Modal header */}
            <div className={`p-6 ${
              darkMode ? 'bg-gray-900/50' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${
                  darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-600'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Confirm {actionToBeTaken}</h3>
              </div>
            </div>
            
            {/* Modal body */}
            <div className="p-6">
              <p className="text-shadow-gray-950 dark:text-gray-300">{message}</p>
            </div>
            
            {/* Modal footer */}
            <div className={`flex justify-end gap-3 p-4 ${
              darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
            }`}>
              <button
                onClick={onCancel}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                  darkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-700 hover:text-black hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`px-5 py-2.5 rounded-lg font-medium text-white transition-all ${
                  darkMode 
                    ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/30' 
                    : 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30'
                }`}
              >
                {actionToBeTaken}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};