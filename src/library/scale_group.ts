import type { Series, SeriesOptions } from "./series/series";
import { xScale } from "./utils/xScale";
import { yScale } from "./utils/yScale";

export type ScaleGroupOptions = {
  width: number;
  height: number;
  series: Omit<SeriesOptions<any>, "width" | "height">[];
  dom: HTMLElement;
  scale_size: number;
};

function renderXScale(data: any, scale_size: number, width: number) {
  const x_scale_canvas = document.createElement("canvas");

  x_scale_canvas.height = scale_size;
  x_scale_canvas.width = width - scale_size;

  const x_markers = 10;

  console.log("DATA_x", data);

  for (let i = 0; i < x_markers; i++) {
    const data_point = data[Math.floor((data.length * i) / x_markers)];

    const x_pos = (i / x_markers) * width;

    const ctx = x_scale_canvas.getContext("2d")!;
    ctx.font = `500 10px Roboto, sans-serif`;

    x_scale_canvas.classList.add("x-scale");

    ctx.beginPath(); // Start a new path
    ctx.moveTo(x_pos, 0);
    ctx.lineTo(x_pos, 100);
    ctx.stroke(); // Render the path
    ctx.font = `500 10px Roboto, sans-serif`;
    ctx.fillText(new Date(data_point.datetime).toLocaleString(), x_pos, 20);
  }

  return x_scale_canvas;
}

export class ScaleGroup {
  series: Series<any>[] = [];
  width: number;
  height: number;
  scale_size: number;
  ctx?: CanvasRenderingContext2D;
  scale = {
    max: 0,
    min: 0,
    time_min: 0,
    time_max: 0,
  };

  dom: HTMLElement;
  visibleDataPoints = 5;
  dataOffset = 0;

  destroy() {
    // Clean up event listeners
    window.removeEventListener("wheel", this.zoomHandler);
  }

  zoomHandler = (e: WheelEvent) => {
    if (e.ctrlKey) {
      const offset = Math.ceil(this.visibleDataPoints / 20);

      if (e.deltaY > 0) {
        this.dataOffset += offset;
      } else {
        this.dataOffset = this.dataOffset - offset;
      }
    } else {
      if (e.deltaY > 0) {
        this.visibleDataPoints = Math.ceil(this.visibleDataPoints * 1.2);
      } else {
        this.visibleDataPoints = Math.max(
          1,
          Math.floor(this.visibleDataPoints * 0.8),
        );
      }
    }

    console.log(this.dataOffset);

    //TODO: this is bad
    this.render(this.ctx!);
  };

  constructor(options: ScaleGroupOptions) {
    this.width = options.width;
    this.height = options.height;
    this.dom = options.dom;
    this.scale_size = options.scale_size;

    this.series = options.series.map((seriesOptions) => {
      return new seriesOptions.seriesType({
        ...seriesOptions,
        width: this.width,
        height: this.height,
      });
    });

    let min = Infinity;
    let max = -Infinity;
    let time_min = Infinity;
    let time_max = -Infinity;
    this.series.forEach((series) => {
      const seriesMinMax = series.getMinMax(
        this.dataOffset,
        this.visibleDataPoints,
      );

      min = Math.min(min, seriesMinMax.min);
      max = Math.max(max, seriesMinMax.max);
      time_min = Math.min(time_min, seriesMinMax.time_min);
      time_max = Math.max(time_max, seriesMinMax.time_max);
    });

    this.series.forEach((series) => {
      series.setScale({
        min,
        max,
        time_min,
        time_max,
      });

      this.scale = {
        max,
        min,
        time_min,
        time_max,
      };
    });

    // Bind the zoomHandler to the current instance
    this.zoomHandler = this.zoomHandler.bind(this);
  }

  addSeries(series: Series<any>) {
    this.series.push(series);
  }

  private renderTooltip() {
    return;
    const toolTip = document.createElement("div");
    toolTip.innerHTML = "TOOLTIP";

    this.dom.appendChild(toolTip);
  }

  render(ctx: CanvasRenderingContext2D) {
    this.renderTooltip();

    this.dom
      .querySelectorAll(".x-scale, .y-scale")
      .forEach((el) => el.remove());

    this.ctx = ctx;

    console.log("DBG_B", this.scale_size);

    const y_scale_canvas = document.createElement("canvas");
    y_scale_canvas.width = this.scale_size;
    y_scale_canvas.height = this.height - this.scale_size;

    const y_ctx = y_scale_canvas.getContext("2d")!;
    y_scale_canvas.classList.add("y-scale");

    this.dom.appendChild(y_scale_canvas);
    this.dom.classList.add("chart");

    window.addEventListener("wheel", this.zoomHandler);
    const margin = { top: 30, right: 30, bottom: 30, left: 30 };

    const visible_data = this.series[0].data.slice(
      this.dataOffset,
      this.dataOffset + this.visibleDataPoints,
    );

    console.log("visiiii", visible_data.length);

    const x = xScale({
      drawingArea: {
        start: 0,
        end: this.width - this.scale_size,
      },
      valueArea: {
        //start: visible_data[0].timestamp,
        //end: visible_data.at(-1)!.timestamp,
        start: 0,
        end: visible_data.length,
      },
    });

    console.log("width", this.width, x(0));

    const lowest_data_point = Math.min(...visible_data.map((val) => val.low));
    const highest_data_point = Math.max(...visible_data.map((val) => val.high));

    const range = highest_data_point - lowest_data_point;

    const y = yScale({
      drawingArea: {
        start: 0,
        end: this.height,
      },
      valueArea: {
        start: lowest_data_point - range / 10,
        end: highest_data_point + range / 10,
      },
    });

    const data = this.series[0].data.slice(
      this.dataOffset,
      this.dataOffset + this.visibleDataPoints,
    );

    const x_scale_canvas = renderXScale(data, this.scale_size, this.width);

    this.dom.appendChild(x_scale_canvas);

    const y_markers = 10;
    const min_price = Math.min(...data.map((val) => val.low));
    const max_price = Math.max(...data.map((val) => val.high));
    for (let i = 0; i < y_markers; i++) {
      const price = min_price + (i / y_markers) * (max_price - min_price);

      const y_pos = this.height - (this.height * i) / y_markers;

      y_ctx.beginPath(); // Start a new path
      y_ctx.moveTo(0, y_pos);
      y_ctx.lineTo(100, y_pos);
      y_ctx.stroke(); // Render the path

      y_ctx.fillText(price.toFixed(2), 10, y_pos);
    }

    this.series.forEach((series) => {
      series.render(ctx, this.dataOffset, this.visibleDataPoints, margin, x, y);
    });
  }
}
