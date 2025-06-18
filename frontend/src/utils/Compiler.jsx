import React from "react";
import {
  FaCheck,
  FaClock,
  FaBolt,
  FaMemory,
  FaTimes,
  FaExclamationTriangle,
  FaBug,
  FaCode,
  FaRobot,
  FaSpinner,
  FaCheckCircle
} from "react-icons/fa";

// Consolidated status configuration
export const STATUS_CONFIG = {
  "Accepted": {
    icon: FaCheck,
    color: "green",
    bgColor: "bg-green-100",
    darkBgColor: "bg-green-900/30",
    textColor: "text-green-800",
    darkTextColor: "text-green-300",
    displayName: "Accepted"
  },
  "Time Limit Exceeded": {
    icon: FaClock,
    color: "yellow",
    bgColor: "bg-yellow-100",
    darkBgColor: "bg-yellow-900/30",
    textColor: "text-yellow-800",
    darkTextColor: "text-yellow-300",
    displayName: "Time Limit Exceeded"
  },
  "Memory Limit Exceeded": {
    icon: FaMemory,
    color: "purple",
    bgColor: "bg-purple-100",
    darkBgColor: "bg-purple-900/30",
    textColor: "text-purple-800",
    darkTextColor: "text-purple-300",
    displayName: "Memory Limit Exceeded"
  },
  "Compilation Error": {
    icon: FaTimes,
    color: "red",
    bgColor: "bg-red-100",
    darkBgColor: "bg-red-900/30",
    textColor: "text-red-800",
    darkTextColor: "text-red-300",
    displayName: "Compilation Error"
  },
  "Runtime Error": {
    icon: FaBug,
    color: "red",
    bgColor: "bg-red-100",
    darkBgColor: "bg-red-900/30",
    textColor: "text-red-800",
    darkTextColor: "text-red-300",
    displayName: "Runtime Error"
  },
  "Segmentation Fault": {
    icon: FaBug,
    color: "red",
    bgColor: "bg-red-100",
    darkBgColor: "bg-red-900/30",
    textColor: "text-red-800",
    darkTextColor: "text-red-300",
    displayName: "Segmentation Fault"
  },
  "Wrong Answer": {
    icon: FaTimes,
    color: "red",
    bgColor: "bg-red-100",
    darkBgColor: "bg-red-900/30",
    textColor: "text-red-800",
    darkTextColor: "text-red-300",
    displayName: "Wrong Answer"
  },
  default: {
    icon: FaExclamationTriangle,
    color: "orange",
    bgColor: "bg-orange-100",
    darkBgColor: "bg-orange-900/30",
    textColor: "text-orange-800",
    darkTextColor: "text-orange-300",
    displayName: "Unknown Status"
  }
};

// Helper function to get status config
 const getStatusConfig = (status) => {
  return STATUS_CONFIG[status] || STATUS_CONFIG.default;
};

const EmptyState = ({ icon, title, subtitle, darkMode }) => (
  <div className={`rounded-lg p-8 text-center h-full flex flex-col items-center justify-center ${
    darkMode ? "bg-gray-700" : "bg-gray-50"
  }`}>
    <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
      darkMode ? "bg-blue-900/50" : "bg-blue-100"
    }`}>
      {React.cloneElement(icon, { 
        className: `h-5 w-5 ${darkMode ? "text-blue-400" : "text-blue-600"}` 
      })}
    </div>
    <h3 className={`mt-3 text-sm font-medium ${
      darkMode ? "text-gray-300" : "text-gray-900"
    }`}>
      {title}
    </h3>
    {subtitle && (
      <p className={`mt-1 text-sm ${
        darkMode ? "text-gray-500" : "text-gray-600"
      }`}>
        {subtitle}
      </p>
    )}
  </div>
);

const StatusIndicator = ({ status, size = "sm", darkMode }) => {
  const config = getStatusConfig(status);
  
  const sizeClasses = size === "lg" ? "h-10 w-10" : "h-6 w-6";
  const iconSize = size === "lg" ? "h-5 w-5" : "h-3 w-3";
  
  return (
    <div className={`${sizeClasses} rounded-full flex items-center justify-center ${
      darkMode ? config.darkBgColor : config.bgColor
    } ${darkMode ? config.darkTextColor : config.textColor}`}>
      <config.icon className={iconSize} />
    </div>
  );
};

const CodeBlock = ({ label, content, status, darkMode }) => {
  const config = status ? getStatusConfig(status) : null;
  
  const bgColor = config 
    ? darkMode ? config.darkBgColor : config.bgColor
    : darkMode ? "bg-gray-800" : "bg-gray-100";
  
  const textColor = config
    ? darkMode ? config.darkTextColor : config.textColor
    : darkMode ? "text-gray-200" : "text-gray-800";

  const formatContent = (content) => {
    if (content === undefined || content === null) return '""';
    if (typeof content === 'string') {
      if (content.includes('\n')) {
        return content.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < content.split('\n').length - 1 && <br />}
          </span>
        ));
      }
      return content;
    }
    return JSON.stringify(content, null, 2);
  };

  return (
    <div className="mb-3">
      <p className={`text-xs mb-1 ${
        darkMode ? "text-gray-400" : "text-gray-500"
      }`}>{label}</p>
      <pre className={`p-3 rounded text-sm font-mono whitespace-pre-wrap ${
        bgColor
      } ${textColor}`}>
        {formatContent(content)}
      </pre>
    </div>
  );
};

const LanguageTag = ({ language, darkMode }) => (
  <span className={`text-xs px-2 py-1 rounded-full ${
    darkMode ? "bg-gray-600 text-gray-300" : "bg-gray-200 text-gray-700"
  }`}>
    {language}
  </span>
);

const MetricItem = ({ icon, label, value, color, darkMode }) => {
  const colorClasses = {
    blue: darkMode ? "text-blue-400" : "text-blue-600",
    purple: darkMode ? "text-purple-400" : "text-purple-600",
    green: darkMode ? "text-green-400" : "text-green-600",
    red: darkMode ? "text-red-400" : "text-red-600",
    yellow: darkMode ? "text-yellow-400" : "text-yellow-600",
    orange: darkMode ? "text-orange-400" : "text-orange-600"
  };

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 mb-1">
        {React.cloneElement(icon, {
          className: `text-sm ${colorClasses[color]}`
        })}
        <p className={`text-xs ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}>{label}</p>
      </div>
      <p className={`text-lg font-semibold ${
        colorClasses[color]
      }`}>{value}</p>
    </div>
  );
};

export { 
  EmptyState, 
  StatusIndicator, 
  CodeBlock, 
  LanguageTag, 
  MetricItem,
  getStatusConfig
};