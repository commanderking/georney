import {
  activityTypes,
  matchTypes,
} from "components/matchVisualizations/calendarHeatMap/constants";

export type ActivityCommon = {
  timestamp: string;
  type: string;
  match_type?: "match_from_received_like";
};

export type DailyActivity = {
  date: string;
  value: number;
};

export type CalendarActivityTypes = keyof typeof activityTypes;
