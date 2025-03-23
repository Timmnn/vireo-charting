import { Series, type SeriesOptions } from "./series";
import * as d3 from "d3";

export type MarkerType = {
  x: number;
  y: number | null;
};

export type NonNullMarkerType = MarkerType & {
  y: number;
};

export class MarkerSeries extends Series<MarkerType> {
  constructor(options: SeriesOptions<MarkerSeries>) {
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

    // Select or create the SVG container
    const svg = d3
      .select<SVGSVGElement, unknown>("#chart")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("viewBox", [0, 0, this.width, this.height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    // Append the line path
    svg
      .selectAll<SVGPathElement, MarkerType[]>(".marker")
      .data(this.data.filter((d) => d.y !== null) as NonNullMarkerType[]) // Bind the entire data array as a single dataset
      .join("circle")
      .attr("class", "marker")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", 5);
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
