import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { colors } from "../config";

type ChartData = {
  name: string;
  value: number;
};

type MyPieChartProps = {
  chatData: any;
  chartConfig: any;
};

const MyPieChart: React.FC<MyPieChartProps> = ({ chatData, chartConfig }) => {
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
        value: yAxisSums[yAxis[0]], // Assuming only one y-axis value for PieChart
      };
    });

    return result;
  }

  const pieData = groupAndSumData(chatData?.result, chartConfig);

  return (
    <ResponsiveContainer width={300} height={300}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default MyPieChart;
