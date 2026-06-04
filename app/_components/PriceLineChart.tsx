"use client";
import { FugleIntradayCandlesResponse } from "@/lib/fugle/candles";
import { apiClient } from "@/lib/http";
import { StockCandlesRouteResponse } from "@/lib/type";
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

export function PriceLineChart({ id, change }: { id: string; change: number }) {
  const { data } = useQuery({
    queryKey: ["stock", "candles", id],

    queryFn: async () => {
      const res = apiClient.get<StockCandlesRouteResponse>(
        `/api/stock/candles/${id}`,
      );
      return res;
    },
    refetchInterval: 60_000,
  });

  const lineData = {
    // labels,
    labels: data?.data?.map((_, index) => index + 1),
    datasets: [
      {
        pointRadius: 0,
        data,
        borderColor: change >= 0 ? "#3bcb8e" : "#f26b6b",
        borderWidth: 1,
        fill: true,
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
        min: Math.min(...(data?.data ?? [])) - 1,
        max: Math.max(...(data?.data ?? [])) + 1,
      },
    },
    elements: {
      line: {
        capBezierPoints: true,
      },
    },
  };

  return (
    <div className="w-15">
      <Line options={options} data={lineData} height={30} width={60} />
    </div>
  );
}
