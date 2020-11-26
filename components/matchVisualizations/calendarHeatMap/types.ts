import { activityTypes } from "components/matchVisualizations/calendarHeatMap/constants";

export type DailyActivity = {
  date: string;
  value: number;
};

export type CalendarActivityTypes = keyof typeof activityTypes;
