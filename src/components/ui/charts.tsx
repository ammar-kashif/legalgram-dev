
import * as React from "react";
import {
  Bar,
  Line,
  Pie,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "./chart";
import { cn } from "@/lib/utils";

interface ChartProps {
  data: any;
  className?: string;
}

const customColors = [
  "#2563eb", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
];

export const BarChart = ({ data, className }: ChartProps) => {
  return (
    <ChartContainer className={cn("rounded-xl overflow-hidden border border-border/50 shadow-sm", className)} config={{}}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart 
          data={data.labels.map((label: string, i: number) => ({
            name: label,
            value: data.datasets[0].data[i],
          }))}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: "var(--foreground)", fontSize: 12 }}
            tickLine={{ stroke: "var(--border)" }}
            axisLine={{ stroke: "var(--border)" }}
          />
          <YAxis 
            tick={{ fill: "var(--foreground)", fontSize: 12 }}
            tickLine={{ stroke: "var(--border)" }}
            axisLine={{ stroke: "var(--border)" }}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend wrapperStyle={{ paddingTop: 10 }} />
          <Bar
            dataKey="value"
            name={data.datasets[0].label}
            fill={data.datasets[0].backgroundColor || customColors[0]}
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export const LineChart = ({ data, className }: ChartProps) => {
  return (
    <ChartContainer className={cn("rounded-xl overflow-hidden border border-border/50 shadow-sm", className)} config={{}}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data.labels.map((label: string, i: number) => ({
            name: label,
            value: data.datasets[0].data[i],
          }))}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: "var(--foreground)", fontSize: 12 }}
            tickLine={{ stroke: "var(--border)" }}
            axisLine={{ stroke: "var(--border)" }}
          />
          <YAxis 
            tick={{ fill: "var(--foreground)", fontSize: 12 }}
            tickLine={{ stroke: "var(--border)" }}
            axisLine={{ stroke: "var(--border)" }}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend wrapperStyle={{ paddingTop: 10 }} />
          <Line
            type="monotone"
            dataKey="value"
            name={data.datasets[0].label}
            stroke={data.datasets[0].borderColor || customColors[0]}
            strokeWidth={2}
            fill={data.datasets[0].backgroundColor || "transparent"}
            activeDot={{ r: 8, strokeWidth: 1 }}
            dot={{ strokeWidth: 1 }}
            animationDuration={1500}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export const PieChart = ({ data, className }: ChartProps) => {
  return (
    <ChartContainer className={cn("rounded-xl overflow-hidden border border-border/50 shadow-sm", className)} config={{}}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart margin={{ top: 10, right: 30, left: 30, bottom: 5 }}>
          <Tooltip content={<ChartTooltipContent />} />
          <Legend wrapperStyle={{ paddingTop: 15 }} />
          <Pie
            data={data.labels.map((label: string, i: number) => ({
              name: label,
              value: data.datasets[0].data[i],
            }))}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={30} 
            fill="#8884d8"
            dataKey="value"
            name={data.datasets[0].label || "Data"}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            animationDuration={1500}
          >
            {data.labels.map((_: any, index: number) => (
              <Cell 
                key={`cell-${index}`} 
                fill={data.datasets[0].backgroundColor?.[index] || customColors[index % customColors.length]} 
              />
            ))}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
