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

  const [dataset, setDataset] = useState("equities/SPY/1D_OHLCV");

  const createChart = async () => {
    const candles = await trpcClientRef.current.loadDataset
      .query(
        `/Users/timmnicolaizik/Dev/AlgotradingPlatform2/data/${dataset}/data.csv`,
      )
      .then((data) => {
        data = data.map((entry) => ({
          ...entry,
          timestamp: new Date(entry.timestamp).getTime() / 1000,
        })) as any;

        return data;
      });

    const line_data = getRandomCandles(100).map((line) => ({
      x: line.timestamp,
      y: line.close,
    }));
    const marker_data = line_data.map((point) =>
      Math.random() > 0.95
        ? point
        : {
            ...point,
            y: null,
          },
    );

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
    const candles = await trpcClientRef.current.loadDataset.query(
      `/Users/timmnicolaizik/Dev/AlgotradingPlatform2/data/${dataset}/data.csv`,
    );

    chartRef.current?.update_data("MainSeries", candles);
  };

  const getRandomCandles = (count: number) => {
    const candles: CandleStickType[] = [
      {
        open: 100,
        high: 101,
        low: 99,
        close: 100.5,
        timestamp: 0,
      },
    ];

    for (let i = 0; i < count - 1; i++) {
      const new_open = candles[i].close + Math.random() * 0.3 - 0.15;
      const new_close = new_open + Math.random() * 10 - 5;
      const new_high = Math.max(new_open, new_close) + Math.random() * 2;
      const new_low = Math.min(new_open, new_close) - Math.random() * 2;
      const new_timestamp = candles[i].timestamp + 1;

      candles.push({
        open: new_open,
        high: new_high,
        low: new_low,
        close: new_close,
        timestamp: new_timestamp,
      });
    }

    return candles;
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
            placeholder="VIX/1M_OHLCV"
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
