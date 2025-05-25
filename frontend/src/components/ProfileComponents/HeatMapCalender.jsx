import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const HeatmapCalendar = ({ submissionData }) => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);

  const getTooltipDataAttrs = (value) => {
    if (!value || !value.date) {
      return null;
    }
    return {
      'data-tip': `${value.date}: ${value.count} submission${value.count !== 1 ? 's' : ''}`,
    };
  };

  const classForValue = (value) => {
    if (!value || !value.count) {
      return 'color-empty';
    }
    if (value.count >= 10) return 'color-scale-4';
    if (value.count >= 5) return 'color-scale-3';
    if (value.count >= 2) return 'color-scale-2';
    return 'color-scale-1';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Submission Heatmap</h2>
      <div className="overflow-x-auto">
        <CalendarHeatmap
          startDate={startDate}
          endDate={new Date()}
          values={submissionData || []}
          classForValue={classForValue}
          tooltipDataAttrs={getTooltipDataAttrs}
          showWeekdayLabels
        />
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
        <span>Less</span>
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-color-scale-1"></div>
          <div className="w-3 h-3 bg-color-scale-2"></div>
          <div className="w-3 h-3 bg-color-scale-3"></div>
          <div className="w-3 h-3 bg-color-scale-4"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default HeatmapCalendar;