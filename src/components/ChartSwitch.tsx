import React, { useEffect, useRef } from "react";

import Button from "@mui/material/Button";

import BarChartIcon from "@mui/icons-material/BarChart";
import DonutSmallIcon from "@mui/icons-material/DonutSmall";
import TimelineIcon from "@mui/icons-material/Timeline";
import ScatterPlotIcon from "@mui/icons-material/ScatterPlot";
import MultilineChartIcon from "@mui/icons-material/MultilineChart";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { useState } from "react";

interface ChartSwitchProps {
  setChartView: any; // Replace 'any' with the appropriate type if known
  defaultType: any; // Replace 'any' with the appropriate type if known
  downloadChartAsImage: any; // Replace 'any' with the appropriate type if known
}

const ChartSwitch: React.FC<ChartSwitchProps> = ({
  setChartView,
  defaultType,
  downloadChartAsImage,
}) => {
  const [chart, setChart] = useState<any>(defaultType);

  const handleChartChange = (chartType: any) => {
    setChart(chartType);
    setChartView(chartType);
  };

  const styleObj = {
    marginLeft: 10,
    padding: 3,
    minWidth: 20,
    maxHeight: 20,
  };
  const buttonIconsFontSize = { fontSize: 15 };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          size="large"
          variant={chart === "Bar Chart" ? "contained" : "outlined"}
          onClick={() => handleChartChange("Bar Chart")}
          color="error"
          style={styleObj}
        >
          <BarChartIcon fontSize="small" style={buttonIconsFontSize} />
        </Button>
        <Button
          size="small"
          color="error"
          variant={chart === "Pie Chart" ? "contained" : "outlined"}
          onClick={() => handleChartChange("Pie Chart")}
          style={styleObj}
        >
          <DonutSmallIcon fontSize="small" style={buttonIconsFontSize} />
        </Button>
        <Button
          size="small"
          variant={chart === "Line Chart" ? "contained" : "outlined"}
          color="error"
          onClick={() => handleChartChange("Line Chart")}
          style={styleObj}
        >
          <TimelineIcon fontSize="small" style={buttonIconsFontSize} />
        </Button>

        <Button
          size="small"
          variant={chart === "Scatter Plot" ? "contained" : "outlined"}
          color="error"
          onClick={() => handleChartChange("Scatter Plot")}
          style={styleObj}
        >
          <MultilineChartIcon fontSize="small" style={buttonIconsFontSize} />
        </Button>
      </div>
      <Button
        size="small"
        // variant={chart === "Scatter Plot" ? "contained" : "outlined"}
        color="error"
        onClick={() => downloadChartAsImage()}
        style={styleObj}
      >
        <SaveAltIcon fontSize="small" style={buttonIconsFontSize} />
      </Button>
    </div>
  );
};

export default ChartSwitch;
