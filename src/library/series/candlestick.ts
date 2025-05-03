import { Series, type SeriesOptions } from "./series";

export type CandleStickType = {
  open: number;
  high: number;
  low: number;
  close: number;
  datetime: Date;
};

export class CandleStick extends Series<CandleStickType> {
  constructor(options: SeriesOptions<CandleStickType>) {
    super(options);
  }

  render(
    ctx: CanvasRenderingContext2D,
    xOffset: number,
    visibleDataPoints: number,
    margin: { top: number; right: number; bottom: number; left: number },
    x: (number: number) => number,
    y: (number: number) => number,
  ) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const visibleCandles = this.data.slice(
      xOffset,
      xOffset + visibleDataPoints,
    );

    const chart_width = ctx.canvas.width;

    const candle_width = (chart_width / visibleCandles.length) * 0.95;
    const wick_width = 2;

    for (let i = 0; i < visibleCandles.length; i++) {
      const candle = visibleCandles[i];

      ctx.fillStyle = "black";

      ctx.fillRect(
        x(i) - wick_width / 2,
        y(candle.low),
        wick_width,
        y(candle.high) - y(candle.low),
      );

      if (candle.close > candle.open) {
        ctx.fillStyle = "green";
      } else if (candle.close < candle.open) {
        ctx.fillStyle = "red";
      } else {
        ctx.fillStyle = "black";
      }

      ctx.fillRect(
        x(i) - candle_width / 2,
        y(Math.min(candle.close, candle.open)),
        candle_width,
        Math.max(1, Math.abs(y(candle.close) - y(candle.open))),
      );
    }
  }

  getMinMax(xOffset: number, visibleDataPoints: number) {
    const visible_data = this.data.slice(xOffset, visibleDataPoints + xOffset);

    const min = Math.min(...visible_data.map((d) => d.low));
    const max = Math.max(...visible_data.map((d) => d.high));

    const time_min = Math.min(...visible_data.map((d) => d.datetime.getTime()));
    const time_max = Math.max(...visible_data.map((d) => d.datetime.getTime()));

    return {
      min,
      max,
      time_min,
      time_max,
    };
  }
}
