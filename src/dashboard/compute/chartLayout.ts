import { CHART_HEIGHT, CHART_VIEWBOX_HEIGHT, CHART_WIDTH, DAYS_TO_MONITOR } from "../../constants";

export { CHART_HEIGHT, CHART_VIEWBOX_HEIGHT, CHART_WIDTH };

/** The cursor line is drawn a few px taller than the plot area so it visibly overhangs the axis. */
export const CURSOR_LINE_HEIGHT = CHART_HEIGHT + 6;

export const chartStep = (): number => CHART_WIDTH / Number(DAYS_TO_MONITOR);

export const cursorX = (day: number): number => {
  const step = chartStep();
  return (day - 1) * step + step / 2;
};
