'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PALETTE = ['#4B672D', '#EBF6C4', '#233029', '#6B8F4E', '#8FA36A'];

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
  const labels = accounts.length
    ? accounts.map((account) => account.name)
    : ['No accounts'];
  const dataValues = accounts.length
    ? accounts.map((account) => account.currentBalance)
    : [1];

  const data = {
    datasets: [
      {
        label: 'Balance',
        data: dataValues,
        backgroundColor: accounts.length
          ? PALETTE.slice(0, accounts.length)
          : ['#D1D5DB'],
        borderWidth: 0,
      },
    ],
    labels,
  };

  return (
    <Doughnut
      data={data}
      options={{
        cutout: '68%',
        plugins: {
          legend: { display: false },
        },
      }}
    />
  );
};

export default DoughnutChart;
