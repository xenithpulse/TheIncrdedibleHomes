import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const TrackingChart = ({ trackingData, timeframe }) => {
  const prepareVisitorsLineData = () => {
    const timeIntervals = {
      '1 Hour': { unit: 'minute', interval: 60, labelStep: 8 },
      '1 Day': { unit: 'hour', interval: 24, labelStep: 8 },
      '7 Days': { unit: 'day', interval: 7, labelStep: 8 },
      '30 Days': { unit: 'day', interval: 30, labelStep: 8 },
    };

    const { unit, interval, labelStep } = timeIntervals[timeframe] || {};
    if (!unit) {
      return { labels: [], datasets: [] };
    }

    const now = new Date();
    const labels = [];
    const groupedData = {};

    // Generate the time labels for the entire range
    for (let i = interval; i > 0; i--) {
      const labelDate = new Date(now);
      if (unit === 'minute') labelDate.setMinutes(now.getMinutes() - i);
      else if (unit === 'hour') labelDate.setHours(now.getHours() - i);
      else if (unit === 'day') labelDate.setDate(now.getDate() - i);

      let label;
      if (unit === 'minute') label = `${labelDate.getHours()}:${labelDate.getMinutes().toString().padStart(2, '0')}`;
      else if (unit === 'hour') label = `${labelDate.getDate()}/${labelDate.getHours()}`;
      else if (unit === 'day') label = `${labelDate.getFullYear()}-${labelDate.getMonth() + 1}-${labelDate.getDate()}`;

      labels.push(label);
      groupedData[label] = new Set(); // Initialize with empty sets
    }

    // Populate data
    trackingData.forEach(({ timestamp, sessionId }) => {
      const date = new Date(timestamp?.$date || timestamp); // Handle $date format
      let key;

      if (unit === 'minute') key = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
      else if (unit === 'hour') key = `${date.getDate()}/${date.getHours()}`;
      else if (unit === 'day') key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

      if (groupedData[key]) groupedData[key].add(sessionId); // Only add if the key exists
    });

    const visitors = labels.map((label) => groupedData[label]?.size || 0);

    const maxVisitors = Math.max(...visitors);
    const yMax = maxVisitors || 10; // Default to 10 if no data

    return {
      labels: labels.filter((_, index) => index % Math.ceil(interval / labelStep) === 0), // Reduce labels for neat structure
      datasets: [
        {
          label: 'Visitors',
          data: visitors,
          borderColor: '#36A2EB',
          backgroundColor: 'rgba(54, 162, 235, 0.2)', // Dim color for the filled area
          fill: true,
          pointRadius: 0,
          pointBackgroundColor: '#36A2EB',
          borderWidth: 2,
        },
      ],
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: ``,
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.raw} visitors`,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: unit.charAt(0).toUpperCase() + unit.slice(1),
            },
          },
          y: {
            title: {
              display: true,
              text: 'Number of Visitors',
            },
            min: 0,
            max: Math.ceil(yMax / 10) * 10,
            ticks: {
              stepSize: Math.ceil(yMax / labelStep),
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.9)', // Dim color for grid lines
              drawBorder: false,
            },
          },
        },
        elements: {
          line: {
            tension: 0.4, // Smooth line curve
          },
        },
      },
    };
  };

  const chartData = prepareVisitorsLineData();

  return <Line data={chartData} options={chartData.options} />;
};

export default TrackingChart;
