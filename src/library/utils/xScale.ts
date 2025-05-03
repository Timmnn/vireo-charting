//The returned value is the center of the datapoint
export const xScale = (options: {
  drawingArea: {
    start: number;
    end: number;
  };
  valueArea: {
    start: number;
    end: number;
  };
}) => {
  return (value: number) => {
    const totalWidth = options.drawingArea.end - options.drawingArea.start;

    const dataPointWidth =
      totalWidth / (options.valueArea.end - options.valueArea.start);

    const x = options.drawingArea.start + (value + 0.5) * dataPointWidth;

    return x;
  };
};
