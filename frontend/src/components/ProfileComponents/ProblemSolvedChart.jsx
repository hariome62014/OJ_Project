import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProblemSolvedChart = ({ monthlyUniqueProblems, darkMode }) => {
  const textColor = darkMode ? '#E5E7EB' : '#111827';
  const gridColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const tooltipBgColor = darkMode ? '#1F2937' : '#FFFFFF';

  // Transform monthlyUniqueProblems into chart data format
  const chartLabels = monthlyUniqueProblems?.map(item => `${item.month}`) || [];
  const chartData = monthlyUniqueProblems?.map(item => item.count) || [];

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Problems Solved',
        data: chartData,
        borderColor: '#6366f1', // Indigo
        backgroundColor: darkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: darkMode ? '#1F2937' : '#FFFFFF',
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#6366f1',
        pointHoverBorderColor: darkMode ? '#1F2937' : '#FFFFFF',
        pointHitRadius: 10,
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: tooltipBgColor,
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: gridColor,
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: gridColor,
          drawBorder: false,
        },
        ticks: {
          color: textColor,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor,
          drawBorder: false,
        },
        ticks: {
          color: textColor,
          stepSize: 1,
          precision: 0,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div className={`rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 h-full`}>
     
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ProblemSolvedChart;