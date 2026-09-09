import { CHART_HEIGHT, CHART_VIEWBOX_HEIGHT, CHART_WIDTH } from "../../constants";

export { CHART_HEIGHT, CHART_VIEWBOX_HEIGHT, CHART_WIDTH };

/** The cursor line is drawn a few px taller than the plot area so it visibly overhangs the axis. */
export const CURSOR_LINE_HEIGHT = CHART_HEIGHT + 6;

/** totalDays must be the actual number of snapshots being plotted (data.length), not a
 *  configured window size — the two can drift and leave snapshots off the right edge. */
export const chartStep = (totalDays: number): number => CHART_WIDTH / totalDays;

export const cursorX = (day: number, totalDays: number): number => {
  const step = chartStep(totalDays);
  return (day - 1) * step + step / 2;
};
