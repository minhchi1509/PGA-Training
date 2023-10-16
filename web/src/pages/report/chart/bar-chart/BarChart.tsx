import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: false,
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        min: 0,
        autoSkip: false,
      },
    },
    y: {
      min: 0,
      max: 100,
      ticks: {
        stepSize: 20,
      },
    },
  },
  plugins: {
    legend: {
      position: 'top' as const,
      display: false,
    },
  },
};

interface TBarChartProps {
  labels: string[];
  revenue: number[];
}

const BarChart = ({ labels, revenue }: TBarChartProps) => {
  const data = {
    labels,
    datasets: [
      {
        label: '',
        data: revenue,
      },
    ],
  };
  return (
    <Bar
      options={options}
      data={data}
      plugins={[
        {
          id: 'bar',
          afterLayout: (chart) => {
            const ctx = chart.ctx;
            ctx.save();
            const yAxis = chart.scales['y'];
            const yBottom = yAxis.getPixelForValue(0);
            const dataset = chart.data.datasets[0];
            dataset.backgroundColor = dataset.data.map((v) => {
              if (v) {
                const value = Number(v);
                const yTop = yAxis.getPixelForValue(value);
                const gradient = ctx.createLinearGradient(0, yBottom, 0, yTop);
                gradient.addColorStop(0, '#48ABE2');
                gradient.addColorStop(1, '#35D6AF');
                return gradient;
              }
            });
            ctx.restore();
          },
        },
      ]}
    />
  );
};
export default BarChart;
