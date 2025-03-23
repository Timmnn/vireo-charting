import { ScaleGroup, type ScaleGroupOptions } from "./scale_group";

export type SubplotOptions = {
  width: number;
  height: number;
  scaleGroups: Omit<ScaleGroupOptions, "width" | "height">[];
  scale_size: number;
  dom: HTMLElement;
};
export class Subplot {
  width: number;
  height: number;
  dom: HTMLElement;
  name: string = "Subplot";
  scale_size: number;
  scaleGroups: ScaleGroup[];
  constructor(options: SubplotOptions) {
    this.width = options.width;
    this.height = options.height;
    this.dom = options.dom;
    this.scale_size = options.scale_size;

    this.scaleGroups = options.scaleGroups.map((scaleGroupOptions) => {
      return new ScaleGroup({
        ...scaleGroupOptions,
        width: this.width,
        height: this.height,
        dom: options.dom,
        scale_size: options.scale_size,
      });
    });
  }

  addScaleGroup(scaleGroup: ScaleGroup) {
    this.scaleGroups.push(scaleGroup);
  }

  setName(name: string) {
    this.name = name;
  }

  render() {
    const main_canvas = document.createElement("canvas");

    console.log("DBG_A", this.height, this.scale_size);

    main_canvas.height = this.height - this.scale_size;
    main_canvas.width = this.width - this.scale_size;

    main_canvas.classList.add("main-canvas");
    const ctx = main_canvas.getContext("2d")!;

    this.dom.appendChild(main_canvas);

    this.scaleGroups.forEach((scale_group) => {
      scale_group.render(ctx);
    });
  }
}
