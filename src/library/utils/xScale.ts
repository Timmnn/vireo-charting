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
    const percentage =
      (value - options.valueArea.start) /
      (options.valueArea.end - options.valueArea.start);

    const x =
      options.drawingArea.start +
      percentage * (options.drawingArea.end - options.drawingArea.start);

    return x;
  };
};
