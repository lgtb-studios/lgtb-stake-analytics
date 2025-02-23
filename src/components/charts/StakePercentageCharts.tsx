"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useFetchStakePercentages } from "@/hooks/fetchers";
import { PercentageData } from "@/lib/types";

const formatData = (data: PercentageData[] | undefined) => {
  if (!data || data.length === 0) return [];

  const sortedData = data
    .map((item) => ({
      date: new Date(item.timestamp).toISOString().split("T")[0],
      percentage: parseFloat(item.percentage || "0").toFixed(2),
      totalStakers: item.totalStakers || 0,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const latest10 = sortedData.slice(0, 10);

  const finalData = latest10.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  return finalData;
};

const percentageChartConfig = {
  percentage: {
    label: "Percentage",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const stakersChartConfig = {
  totalStakers: {
    label: "Total Stakers",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function StakePercentageCharts() {
  const { data, isLoading } = useFetchStakePercentages();

  const displayedData = formatData(data);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">Loading charts...</div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        No data available.
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-lg text-center font-semibold mb-1">
            Stake Percentage
          </h2>

          <ChartContainer
            config={percentageChartConfig}
            className="min-h-[200px] aspect-[1.2]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={displayedData}
                margin={{ top: 10, right: 50, left: 0, bottom: 30 }}
              >
                <CartesianGrid />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={15}
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  height={50}
                  interval={0}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  width={50}
                  domain={["dataMin", "dataMax"]}
                  type="number"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="linear"
                  dataKey="percentage"
                  stroke="var(--color-percentage)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  connectNulls={false}
                  isAnimationActive={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div>
          <h2 className="text-lg text-center font-semibold mb-1">
            Total Escrow Count
          </h2>
          <ChartContainer
            config={stakersChartConfig}
            className="min-h-[250px] aspect-[1.2]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={displayedData}
                margin={{ top: 10, right: 50, left: 0, bottom: 30 }}
              >
                <CartesianGrid />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={15}
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  height={50}
                  interval={0}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  width={50}
                  domain={["dataMin", "dataMax"]}
                  type="number"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="linear"
                  dataKey="totalStakers"
                  stroke="var(--color-totalStakers)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  connectNulls={false}
                  isAnimationActive={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
