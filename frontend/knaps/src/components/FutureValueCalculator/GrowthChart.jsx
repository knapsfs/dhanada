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

const fmt = (value) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)} k`;
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
};

export default function GrowthChart({ chartData }) {
  const data = useMemo(() => {
    return {
      labels: chartData.labels,
      datasets: [
        {
          fill: true,
          label: 'Total Invested',
          data: chartData.investedData,
          borderColor: '#94a3b8',
          backgroundColor: 'rgba(148,163,184,0.08)',
          borderWidth: 2,
          borderDash: [5, 4],
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBackgroundColor: '#94a3b8',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 1.5,
          tension: 0.4,
        },
        {
          fill: true,
          label: 'Potential Future Value',
          data: chartData.fvData,
          borderColor: '#032e92',
          borderWidth: 2.5,
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(3, 46, 146, 0.22)');
            gradient.addColorStop(1, 'rgba(3, 46, 146, 0.01)');
            return gradient;
          },
          pointRadius: 4.5,
          pointHoverRadius: 8,
          pointBackgroundColor: '#032e92',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 1.5,
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
        backgroundColor: '#ffffff',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        cornerRadius: 12,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12, weight: '600' },
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
          color: '#94a3b8',
          font: { size: 11, weight: '600' },
        }
      },
      y: {
        grid: {
          color: '#f1f5f9',
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
          font: { size: 11, weight: '600' },
          callback: function (value) {
            return fmt(value);
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