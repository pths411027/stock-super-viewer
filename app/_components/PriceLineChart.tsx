"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: {
      display: false,
      // text: "Chart.js Line Chart",
    },
  },
  scales: {
    x: { display: false, grid: { display: false }, ticks: { display: false } },
    y: {
      display: false,
      min: 80,
      max: 120,
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      // label: "Dataset 1",
      pointRadius: 0,
      data: [100, 94, 93, 98, 103, 109, 103],
      borderColor: "#3BCB8E",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

export function PriceLineChart() {
  return (
    <div className="w-20">
      <Line options={options} data={data} height={30} width={80} />
    </div>
  );
}
