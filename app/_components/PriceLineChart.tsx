"use client";
import { useQuery } from "@tanstack/react-query";
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

export function PriceLineChart({ id }: { id: string }) {
  const { data } = useQuery({
    queryKey: ["stock", "candles", id],
    queryFn: async () => {
      const res = await fetch(`/api/stock/candles/${id}`, {
        cache: "no-store",
      });
      const json = await res.json();
      return json.data as Array<number>;
    },
    refetchInterval: 60_000,
  });
  console.log(data);

  const lineData = {
    labels,
    datasets: [
      {
        // label: "Dataset 1",
        pointRadius: 0,
        data,
        borderColor: "#3BCB8E",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const options = {
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
      x: {
        display: false,
        grid: { display: false },
        ticks: { display: false },
      },
      y: {
        display: false,
        min: Math.min(...(data ?? [])) - 1,
        max: Math.max(...(data ?? [])) + 1,
      },
    },
  };

  console.log(data);

  return (
    <div className="w-20">
      <Line options={options} data={lineData} height={30} width={80} />
    </div>
  );
}
