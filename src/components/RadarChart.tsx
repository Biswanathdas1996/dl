import React from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@mui/material";

import { colors } from "../config";

type ChartData = {
  name: string;
  value: number;
};

type MyRadarChartProps = {
  chatData: any;
  chartConfig: any;
};

const MyRadarChart: React.FC<MyRadarChartProps> = ({
  chatData,
  chartConfig,
}) => {
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
        name: groupKey,
        value: yAxisSums[yAxis[0]], // Assuming only one y-axis value for RadarChart
      };
    });

    return result;
  }

  const radarData = groupAndSumData(chatData?.result, chartConfig);

  return (
    <ResponsiveContainer width={300} height={300}>
      <RadarChart data={radarData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="name" />
        <PolarRadiusAxis />
        <Radar
          name="Radar"
          dataKey="value"
          stroke={colors[1]}
          fill={colors[1]}
          fillOpacity={0.6}
        />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default MyRadarChart;
