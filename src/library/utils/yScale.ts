export const yScale = (options: {
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

    return (
      options.drawingArea.end -
      percentage * (options.drawingArea.end - options.drawingArea.start)
    );
  };
};
