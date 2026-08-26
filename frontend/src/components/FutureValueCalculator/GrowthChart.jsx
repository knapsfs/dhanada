import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from 'chart.js';
import { formatIndianCurrency } from './calculatorUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function GrowthChart({ chartData }) {
  const data = useMemo(() => {
    return {
      labels: chartData.labels,
      datasets: [
        {
          fill: true,
          label: 'Total Invested',
          data: chartData.investedData,
          borderColor: '#e8edf7',
          backgroundColor: 'rgba(232, 237, 247, 0.5)',
          pointRadius: 0,
          pointHoverRadius: 6,
          tension: 0.4,
        },
        {
          fill: true,
          label: 'Potential Future Value',
          data: chartData.fvData,
          borderColor: '#032e92',
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(3, 46, 146, 0.3)');
            gradient.addColorStop(1, 'rgba(3, 46, 146, 0)');
            return gradient;
          },
          pointRadius: 0,
          pointHoverRadius: 6,
          pointBackgroundColor: '#032e92',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          tension: 0.4,
        },
      ],
    };
  }, [chartData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        displayColors: true,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatIndianCurrency(context.parsed.y);
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af',
          font: { size: 11, weight: 'bold' },
          maxTicksLimit: 8
        }
      },
      y: {
        grid: {
          color: '#f3f4f6',
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af',
          font: { size: 11, weight: 'bold' },
          callback: function(value) {
            if (value >= 10000000) return '₹' + (value / 10000000).toFixed(1) + ' Cr';
            if (value >= 100000) return '₹' + (value / 100000).toFixed(0) + ' L';
            if (value >= 1000) return '₹' + (value / 1000).toFixed(0) + ' k';
            return '₹' + value;
          }
        }
      }
    }
  };

  return (
    <div className="w-full h-64 lg:h-80 mt-6 relative">
      <Line data={data} options={options} />
    </div>
  );
}
