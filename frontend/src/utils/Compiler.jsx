import React from "react";

const EmptyState = ({ icon, title, subtitle, darkMode }) => (
  <div className={`rounded-lg p-8 text-center h-full flex flex-col items-center justify-center ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
    <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
      darkMode ? "bg-blue-900/50" : "bg-blue-100"
    }`}>
      {React.cloneElement(icon, { 
        className: `h-5 w-5 ${darkMode ? "text-blue-400" : "text-blue-600"}` 
      })}
    </div>
    <h3 className={`mt-3 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-900"}`}>
      {title}
    </h3>
    {subtitle && (
      <p className={`mt-1 text-sm ${darkMode ? "text-gray-500" : "text-gray-600"}`}>
        {subtitle}
      </p>
    )}
  </div>
);

const StatusIndicator = ({ status, size = "sm", darkMode }) => {
  const sizeClasses = size === "lg" ? "h-10 w-10" : "h-6 w-6";
  const iconSize = size === "lg" ? "h-5 w-5" : "h-3 w-3";
  
  const statusClasses = {
    success: {
      bg: darkMode ? "bg-green-900/50" : "bg-green-100",
      text: darkMode ? "text-green-200" : "text-green-800",
      icon: (
        <svg className={iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    error: {
      bg: darkMode ? "bg-red-900/50" : "bg-red-100",
      text: darkMode ? "text-red-200" : "text-red-800",
      icon: (
        <svg className={iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    },
    neutral: {
      bg: darkMode ? "bg-gray-700/50" : "bg-gray-100",
      text: darkMode ? "text-gray-200" : "text-gray-800",
      icon: (
        <svg className={iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    }
  };

  return (
    <div className={`${sizeClasses} rounded-full flex items-center justify-center ${statusClasses[status].bg} ${statusClasses[status].text}`}>
      {statusClasses[status].icon}
    </div>
  );
};

const CodeBlock = ({ label, content, status, darkMode }) => {
  const bgColor = status 
    ? status === "success"
      ? darkMode ? "bg-green-900/30" : "bg-green-100"
      : darkMode ? "bg-red-900/30" : "bg-red-100"
    : darkMode ? "bg-gray-800" : "bg-gray-100";
  
  const textColor = status
    ? status === "success"
      ? darkMode ? "text-green-200" : "text-green-800"
      : darkMode ? "text-red-200" : "text-red-800"
    : darkMode ? "text-gray-200" : "text-gray-800";

  // Format the content for better display
  const formatContent = (content) => {
    if (content === undefined || content === null) return '""';
    if (typeof content === 'string') {
      // If it's a string with newlines (like the input "7 0\n4 5 6 7 0 1 2")
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
      <p className={`text-xs mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
      <pre className={`p-3 rounded text-sm font-mono whitespace-pre-wrap ${bgColor} ${textColor}`}>
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

const MetricItem = ({ label, value, color, darkMode }) => {
  const colorClasses = {
    blue: darkMode ? "text-blue-400" : "text-blue-600",
    purple: darkMode ? "text-purple-400" : "text-purple-600",
    green: darkMode ? "text-green-400" : "text-green-600",
    red: darkMode ? "text-red-400" : "text-red-600"
  };

  return (
    <div className="text-center">
      <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
      <p className={`text-lg font-semibold ${colorClasses[color]}`}>{value}</p>
    </div>
  );
};

export { EmptyState, StatusIndicator, CodeBlock, LanguageTag, MetricItem };