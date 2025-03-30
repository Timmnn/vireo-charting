import { useEffect, useRef, useState } from "react";
import { Chart } from "./library";
import { InputText } from "primereact/inputtext";
import {
  CandleStick,
  type CandleStickType,
} from "./library/series/candlestick.ts";
import "./App.css";
import { getTrpcClient } from "./trpc.ts";
import { Button } from "primereact/button";

export const App = () => {
  const trpcClientRef = useRef(getTrpcClient());
  const toolbar_height = 100;

  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    createChart().then((chart) => {
      chartRef.current = chart;
      chartRef.current.render();
    });
  }, []);

  const [dataset, setDataset] = useState("equities/fake_AAPL");

  const createChart = async () => {
    const candles = await trpcClientRef.current.loadDataset
      .query(
        `/Users/timmnicolaizik/Dev/AlgotradingPlatform/data/${dataset}/data.parquet`,
      )
      .then((data) => {
        data = data.map((entry) => ({
          ...entry,
          datetime: new Date(entry.datetime),
        })) as any;

        return data;
      });

    return new Chart({
      width: innerWidth,
      root: ".chart-root",
      height: innerHeight - toolbar_height,
      scale_size: 50,
      subplots: [
        {
          width: innerWidth,
          height: innerHeight - toolbar_height,
          scaleGroups: [
            {
              series: [
                {
                  id: "MainSeries",
                  data: candles,
                  seriesType: CandleStick,
                },
                /*{
                  data: line_data,
                  seriesType: LineSeries,
                },
                {
                  data: marker_data,
                  seriesType: MarkerSeries,
                },*/
              ],
            },
          ],
        },
      ],
    });
  };

  const updateDataset = async () => {
    const base_path = "/Users/timmnicolaizik/Dev/AlgotradingPlatform/data/";

    const candles = await trpcClientRef.current.loadDataset.query(
      `${base_path}${dataset}/data.parquet`,
    );

    chartRef.current?.update_data("MainSeries", candles);
  };

  return (
    <main className="flex flex-col">
      <div
        className="grow"
        style={{
          height: toolbar_height + "px",
        }}
      >
        <label htmlFor="username">
          Dataset
          <InputText
            placeholder="Dataset Path"
            value={dataset}
            onChange={(e) => setDataset(e.target.value)}
          />
        </label>
        <Button
          onClick={async () => {
            await updateDataset();
          }}
        >
          Load
        </Button>
      </div>
      <div className="chart-root"></div>
    </main>
  );
};
