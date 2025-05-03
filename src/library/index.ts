import { Subplot, type SubplotOptions } from "./subplot";

type ChartOptions = {
  width: number;
  height: number;
  subplots: SubplotOptions[];
  root: HTMLElement | string;
  scale_size: number;
};

export class Chart {
  rootElement: HTMLElement;
  options: ChartOptions;

  subplots: Subplot[] = [];
  constructor(options: ChartOptions) {
    const rootElement =
      typeof options.root === "string"
        ? (document.querySelector(options.root) as HTMLElement)
        : options.root;
    if (!rootElement) {
      throw new Error("Root element not found");
    }

    this.rootElement = rootElement;

    this.options = options;
  }
  render() {
    this.rootElement.innerHTML = "";

    this.subplots = this.options.subplots.map((subplotOptions) => {
      const subplot_dom_element = document.createElement("div");
      this.rootElement.appendChild(subplot_dom_element);
      return new Subplot({
        ...subplotOptions,
        dom: subplot_dom_element,
        scale_size: this.options.scale_size,
      });
    });

    for (const subplot of this.subplots) {
      subplot.render();
    }
  }
  update_data(id: string, data: any) {
    for (const subplot of this.subplots) {
      for (const scaleGroup of subplot.scaleGroups) {
        for (const series of scaleGroup.series) {
          if (series.id === id) {
            series.data = data;
          }
        }
      }
    }
    this.render();
  }
}
