export type SeriesOptions<T> = {
  data: T[];
  width: number;
  height: number;
  seriesType: T;
  ctx: CanvasRenderingContext2D;
  id: string;
};

type Scale = {
  max: number;
  min: number;

  time_min: number;
  time_max: number;
};

export abstract class Series<T> {
  data: T[];
  width: number;
  id: string;
  height: number;
  scale: Scale = {
    max: 0,
    min: 0,
    time_min: 0,
    time_max: 0,
  };
  constructor(options: SeriesOptions<T>) {
    this.width = options.width;
    this.height = options.height;
    this.data = options.data;
    this.id = options.id;
  }

  setScale(scale: Scale) {
    this.scale = scale;
  }

  abstract getMinMax(
    xOffset: number,
    visibleDataPoints: number,
  ): {
    min: number;
    max: number;
    time_min: number;
    time_max: number;
  };

  abstract render(
    ctx: CanvasRenderingContext2D,

    xOffset: number,
    visibleDataPoints: number,
    margin: { top: number; right: number; bottom: number; left: number },
    x: (number: number) => number,
    y: (number: number) => number,
  ): void;
}
