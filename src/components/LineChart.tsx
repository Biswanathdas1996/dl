import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  Label,
  LineChart,
  Line,
} from "recharts";
import { Card } from "@mui/material";
import { colors } from "../config";

const limit = [1000, 1000000, 1000000000, 1000000000000];
const unit = ["K", "M", "B", "T"];

export function formatNumber(value: number) {
  for (let i = limit.length - 1; i >= 0; i--) {
    const scaled = value / limit[i];
    if (scaled > 1) return `${scaled.toFixed(1)}${unit[i]}`;
  }
  return value.toFixed(1);
}

// Define the data type for better type safety
type ChartData = {
  name: string;
  Sales: number;
  Revenue: number;
};

type MyBarChartProps = {
  chatData: any;
  chartConfig: any;
};

const MyBarChart: React.FC<MyBarChartProps> = ({ chatData, chartConfig }) => {
  type DataType = {
    [key: string]: any;
  };

  type ConfigType = {
    "x-axis": string;
    "y-axis": string[];
  };

  function groupAndSumData(data: DataType[], config: ConfigType) {
    const { "x-axis": xAxis, "y-axis": yAxis } = config;

    // Group data by x-axis key
    const groupedData = data.reduce((acc, item) => {
      const key = item[xAxis];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {} as { [key: string]: DataType[] });

    // Sum the y-axis values for each group
    const result = Object.entries(groupedData).map(([groupKey, items]) => {
      const yAxisSums = yAxis.reduce((sumAcc, yKey) => {
        sumAcc[yKey] = items.reduce(
          (sum: number, item: DataType) => sum + (item[yKey] || 0),
          0
        );
        return sumAcc;
      }, {} as { [key: string]: number });

      return {
        [xAxis]: groupKey,
        ...yAxisSums,
      };
    });

    return result;
  }

  return (
    <ResponsiveContainer width={300} height={300}>
      <LineChart data={groupAndSumData(chatData?.result, chartConfig)}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          stroke="var(--textColor)"
          dataKey={chartConfig["x-axis"]}
          tick={{ fontSize: 8 }}
        >
          <Label
            value={`${chartConfig["x-axis"]}`}
            offset={-5}
            position="insideBottom"
          />
        </XAxis>
        <YAxis
          stroke="var(--textColor)"
          // tickFormatter={formatNumber}
          tick={{ fontSize: 10 }}
        ></YAxis>
        <Tooltip />
        <Legend verticalAlign="top" height={36} />

        {chartConfig["y-axis"].map((valueKey: any, index: number) => (
          <Line key={index} dataKey={valueKey} fill={colors[index]} />
        ))}

        {/* <Brush dataKey="x" height={30} stroke="#8884d8" /> */}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MyBarChart;
