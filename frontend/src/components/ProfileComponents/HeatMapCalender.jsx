// import React from 'react';
// import CalendarHeatmap from 'react-calendar-heatmap';
// import 'react-calendar-heatmap/dist/styles.css';

// const HeatmapCalendar = ({ submissionData }) => {
//   const startDate = new Date();
//   startDate.setMonth(startDate.getMonth() - 6);

//   const getTooltipDataAttrs = (value) => {
//     if (!value || !value.date) {
//       return null;
//     }
//     return {
//       'data-tip': `${value.date}: ${value.count} submission${value.count !== 1 ? 's' : ''}`,
//     };
//   };

//   const classForValue = (value) => {
//     if (!value || !value.count) {
//       return 'color-empty';
//     }
//     if (value.count >= 10) return 'color-scale-4';
//     if (value.count >= 5) return 'color-scale-3';
//     if (value.count >= 2) return 'color-scale-2';
//     return 'color-scale-1';
//   };

//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
//       <h2 className="text-xl font-bold mb-4">Submission Heatmap</h2>
//       <div className="overflow-x-auto">
//         <CalendarHeatmap
//           startDate={startDate}
//           endDate={new Date()}
//           values={submissionData || []}
//           classForValue={classForValue}
//           tooltipDataAttrs={getTooltipDataAttrs}
//           showWeekdayLabels
//         />
//       </div>
//       <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
//         <span>Less</span>
//         <div className="flex space-x-1">
//           <div className="w-3 h-3 bg-color-scale-1"></div>
//           <div className="w-3 h-3 bg-color-scale-2"></div>
//           <div className="w-3 h-3 bg-color-scale-3"></div>
//           <div className="w-3 h-3 bg-color-scale-4"></div>
//         </div>
//         <span>More</span>
//       </div>
//     </div>
//   );
// };

// export default HeatmapCalendar;


import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const HeatmapCalendar = ({ submissionData, darkMode }) => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);

  // Enhanced color scales with better contrast
  const colorScale = darkMode 
    ? ['#1e3a8a', '#1e40af', '#1d4ed8', '#3b82f6', '#60a5fa']  // Dark mode blues with extra step
    : ['#dbeafe', '#93c5fd', '#3b82f6', '#1d4ed8', '#1e40af']; // Light mode blues with extra step

  // Ensure all dates are visible with at least minimal coloring
  const enhancedData = (submissionData || []).map(item => ({
    ...item,
    count: Math.max(item.count || 0, 1) // Ensure at least count of 1 for visibility
  }));

  const getTooltipDataAttrs = (value) => {
    if (!value || !value.date) {
      return null;
    }
    const actualCount = submissionData?.find(d => d.date === value.date)?.count || 0;
    return {
      'data-tooltip-id': 'heatmap-tooltip',
      'data-tooltip-content': `${value.date}: ${actualCount} submission${actualCount !== 1 ? 's' : ''}`,
    };
  };

  const classForValue = (value) => {
    if (!value) {
      return 'color-empty';
    }
    const count = value.count || 0;
    if (count >= 10) return 'color-scale-5';
    if (count >= 5) return 'color-scale-4';
    if (count >= 3) return 'color-scale-3';
    if (count >= 2) return 'color-scale-2';
    if (count >= 1) return 'color-scale-1';
    return 'color-empty';
  };

  return (
    <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4`}>
      {/* <h2 className="text-lg font-semibold mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Activity Heatmap
      </h2> */}
      
      <div className="overflow-x-auto">
        <style>
          {`
            .react-calendar-heatmap {
              --color-empty: ${darkMode ? 'rgba(31, 41, 55, 0.4)' : 'rgba(243, 244, 246, 0.8)'};
              --color-scale-1: ${colorScale[0]};
              --color-scale-2: ${colorScale[1]};
              --color-scale-3: ${colorScale[2]};
              --color-scale-4: ${colorScale[3]};
              --color-scale-5: ${colorScale[4]};
            }
            .react-calendar-heatmap text {
              fill: ${darkMode ? '#D1D5DB' : '#4B5563'};
              font-size: 9px;
            }
            .react-calendar-heatmap .color-empty {
              fill: var(--color-empty);
              stroke: ${darkMode ? '#374151' : '#E5E7EB'};
              stroke-width: 1px;
            }
            .react-calendar-heatmap .color-scale-1 {
              fill: var(--color-scale-1);
            }
            .react-calendar-heatmap .color-scale-2 {
              fill: var(--color-scale-2);
            }
            .react-calendar-heatmap .color-scale-3 {
              fill: var(--color-scale-3);
            }
            .react-calendar-heatmap .color-scale-4 {
              fill: var(--color-scale-4);
            }
            .react-calendar-heatmap .color-scale-5 {
              fill: var(--color-scale-5);
            }
            .react-calendar-heatmap rect:hover {
              stroke: ${darkMode ? '#F3F4F6' : '#1F2937'};
              stroke-width: 1px;
            }
          `}
        </style>
        
        <CalendarHeatmap
          startDate={startDate}
          endDate={new Date()}
          values={enhancedData}
          classForValue={classForValue}
          tooltipDataAttrs={getTooltipDataAttrs}
          showWeekdayLabels
          weekdayLabels={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
          monthLabels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
          gutterSize={2}
        />

        <ReactTooltip
          id="heatmap-tooltip"
          place="top"
          effect="solid"
          className="z-50"
          backgroundColor={darkMode ? '#374151' : '#1F2937'}
          textColor={darkMode ? '#F3F4F6' : '#FFFFFF'}
        />

        <div className="flex justify-between items-center mt-4 text-xs">
          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Less</span>
          <div className="flex items-center space-x-1 mx-2">
            {colorScale.map((color, index) => (
              <div 
                key={index}
                className="w-3 h-3 rounded-sm" 
                style={{ 
                  backgroundColor: color,
                  opacity: 0.7 + (index * 0.1)
                }}
              />
            ))}
          </div>
          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>More</span>
        </div>
      </div>
    </div>
  );
};

export default HeatmapCalendar;