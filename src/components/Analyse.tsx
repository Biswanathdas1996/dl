import React, { Component, useState } from "react";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import PirChart from "./PirChart";
import RadarChart from "./RadarChart";
import { QueryData } from "../types/LLM";
import { ANALITICS } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { addAnalitics } from "../redux/slices/chatSlices";
import { Card } from "@mui/material";
import ChartSwitch from "./ChartSwitch";
import Loader from "./Loader";
import { Button } from "@mui/material";
import html2canvas from "html2canvas";
import { useFetch } from "../hook/useFetch";

interface HomeProps {
  data: QueryData;
  chatId: number;
}

const DynamicChart: React.FC<any> = ({ index, chatData, chartConfig }) => {
  const [chartView, setChartView] = useState<any>(chartConfig.type);

  const chartMaps = [
    {
      type: "Line Chart",
      component: LineChart,
    },
    {
      type: "Bar Chart",
      component: BarChart,
    },
    {
      type: "Pie Chart",
      component: PirChart,
    },
    {
      type: "Stacked Bar Chart",
      component: BarChart,
    },
    {
      type: "Scatter Plot",
      component: RadarChart,
    },
  ];

  const getChartComponent = (type: string): React.FC<any> | null => {
    const chart = chartMaps.find((chartMap) => chartMap.type === type);
    return chart ? chart.component : BarChart;
  };
  const ChartComponent = getChartComponent(chartView);

  const downloadChartAsImage = () => {
    const chartElement = document.querySelector(`#chart-${index}`);
    if (chartElement) {
      html2canvas(chartElement as HTMLElement).then(
        (canvas: HTMLCanvasElement) => {
          const link = document.createElement("a");
          link.download = `chart-${index}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        }
      );
    }
  };
  return ChartComponent ? (
    <Card style={{ padding: 10, margin: 10 }}>
      <ChartSwitch
        setChartView={setChartView}
        defaultType={chartView}
        downloadChartAsImage={downloadChartAsImage}
      />

      <div id={`chart-${index}`}>
        <ChartComponent
          key={index}
          chatData={chatData?.message}
          chartConfig={chartConfig}
        />
      </div>
    </Card>
  ) : null;
};

const Home: React.FC<HomeProps> = ({ data, chatId }) => {
  if (!chatId) {
    return "Some Error Occured, switch back to table view";
  }
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const chatHistory = useSelector((state: RootState) => state.chat.value);
  const fetchData = useFetch();
  const chatData: any = chatHistory.find((chat) => chat.id === chatId);

  const allData = chatData?.message?.result;

  interface RequestOptions extends RequestInit {
    body: string;
  }

  interface AnaliticsResult {
    analitics: any;
  }

  const fetchAnaliticsData = (requestOptions: RequestOptions): void => {
    setLoading(true);

    fetchData(ANALITICS, requestOptions)
      .then((response) => response.json())
      .then((result: AnaliticsResult) => {
        setLoading(false);
        if (result?.analitics && typeof result.analitics === "object") {
          dispatch(
            addAnalitics({
              chatId,
              analitics: result.analitics,
            })
          );
        }
      })
      .catch((error: Error) => {
        setLoading(false);
        console.error(error);
      });
  };
  React.useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      result_json: chatData?.message?.result,
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };
    if (!data?.analitics) {
      fetchAnaliticsData(requestOptions as RequestOptions);
    }
  }, []);

  return (
    <div>
      {data && (
        <>
          <div
            style={{ display: "flex", gridColumn: "span 4", flexWrap: "wrap" }}
          >
            {data?.analitics?.map((chart, index) => {
              return (
                <DynamicChart
                  key={index}
                  index={index}
                  chatData={chatData}
                  chartConfig={chart}
                />
              );
            })}
          </div>
        </>
      )}
      {loading && <Loader showIcon={false} />}
    </div>
  );
};

export default Home;
