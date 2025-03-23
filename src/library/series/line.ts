import { Series, type SeriesOptions } from "./series";
import * as d3 from "d3";

export type LineSeriesType = {
  x: number;
  y: number;
};

export class LineSeries extends Series<LineSeriesType> {
  constructor(options: SeriesOptions<LineSeries>) {
    super(options);
  }

  render(margin: { top: number; right: number; bottom: number; left: number }) {
    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([this.scale.time_min, this.scale.time_max])
      .range([margin.left, this.width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([this.scale.min, this.scale.max])
      .range([this.height - margin.bottom, margin.top]);

    // Create line generator
    const line = d3
      .line<LineSeriesType>()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      .curve(d3.curveLinear); // Smooth line

    // Select or create the SVG container
    const svg = d3
      .select<SVGSVGElement, unknown>("#chart")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("viewBox", [0, 0, this.width, this.height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    // Append the line path
    svg
      .selectAll<SVGPathElement, LineSeriesType[]>(".line")
      .data([this.data]) // Bind the entire data array as a single dataset
      .join("path")
      .attr("class", "line")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2);
  }

  getMinMax() {
    const min = Math.min(
      ...this.data.map((d) => d.y).filter((d) => d !== null),
    );
    const max = Math.max(
      ...this.data.map((d) => d.y).filter((d) => d !== null),
    );
    const time_min = Math.min(...this.data.map((d) => d.x));
    const time_max = Math.max(...this.data.map((d) => d.x));

    return {
      min,
      max,
      time_min,
      time_max,
    };
  }
}
