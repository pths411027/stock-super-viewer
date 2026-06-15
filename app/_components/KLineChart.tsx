"use client";
import { apiClient } from "@/lib/http";
import { StockKLineRouteResponse } from "@/lib/type";
import { useQuery } from "@tanstack/react-query";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  LineController,
  BarController,
  ChartData,
  ChartOptions,
  TooltipItem,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend,
);

export function KLineChart({ id }: { id: string }) {
  const { data } = useQuery({
    queryKey: ["stock", "candles", id],

    queryFn: async () => {
      const res = await apiClient.get<StockKLineRouteResponse>(
        `/api/stock/k-line/${id}`,
      );
      return res;
    },
    refetchInterval: 60_000,
  });

  const candles = data ?? [];
  const labels = candles.map((_, index) => `${index + 1}`);
  const priceFloor =
    candles.length > 0 ? Math.min(...candles.map((item) => item.low)) - 1 : 0;
  const priceCeiling =
    candles.length > 0 ? Math.max(...candles.map((item) => item.high)) + 1 : 1;

  type KLineDataPoint = { x: string; y: number | null } | [number, number];

  const chartData: ChartData<"bar" | "line", KLineDataPoint[], string> = {
    labels,
    datasets: [
      {
        type: "line" as const,
        label: "Wicks",
        data: candles.flatMap((item, index) => [
          { x: `${index + 1}`, y: item.low },
          { x: `${index + 1}`, y: item.high },
          { x: `${index + 1}`, y: null },
        ]),
        parsing: false as const,
        pointRadius: 0,
        borderWidth: 1,
        borderColor: candles.flatMap((item) => {
          const color = item.close >= item.open ? "#3bcb8e" : "#f26b6b";
          return [color, color, "rgba(0,0,0,0)"];
        }),
        spanGaps: false,
        order: 1,
      },
      {
        type: "bar" as const,
        label: "Bodies",
        data: candles.map((item) => [
          Math.min(item.open, item.close),
          Math.max(item.open, item.close),
        ]),
        backgroundColor: candles.map((item) =>
          item.close >= item.open ? "#3bcb8e" : "#f26b6b",
        ),
        borderColor: candles.map((item) =>
          item.close >= item.open ? "#3bcb8e" : "#f26b6b",
        ),
        borderWidth: 1,
        borderSkipped: false as const,
        barThickness: 5,
        maxBarThickness: 6,
        categoryPercentage: 0.9,
        barPercentage: 0.35,
        order: 2,
      },
    ],
  };

  const options: ChartOptions<"bar" | "line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label(context: TooltipItem<"bar" | "line">) {
            if (context.dataset.type !== "bar") {
              return "";
            }

            const candle = candles[context.dataIndex];
            if (!candle) {
              return "";
            }

            return `O ${candle.open} H ${candle.high} L ${candle.low} C ${candle.close}`;
          },
        },
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
        min: priceFloor,
        max: priceCeiling,
        grid: { display: false },
        border: { display: false },
      },
    },
    elements: {
      line: {
        tension: 0,
      },
    },
  };

  return (
    <Chart
      type="bar"
      options={options}
      data={chartData}
      height={30}
      width={60}
    />
  );
}
