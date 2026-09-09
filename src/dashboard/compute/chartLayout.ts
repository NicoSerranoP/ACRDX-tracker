import { DAYS } from "../networks";

export const CHART_WIDTH = 1000;
export const CHART_HEIGHT = 200;
export const CHART_VIEWBOX_HEIGHT = 214;

export const chartStep = (): number => CHART_WIDTH / DAYS;

export const cursorX = (day: number): number => {
  const step = chartStep();
  return (day - 1) * step + step / 2;
};
