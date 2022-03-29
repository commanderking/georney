import { timeWeek, timeMonth, timeMonths } from "d3-time";
import { scaleLinear } from "d3-scale";
import { interpolatePurples } from "d3-scale-chromatic";
import _ from "lodash";
import moment from "moment";
import { DailyActivity, ActivityCommon } from "./types";
import { isMatchFromReceivedLike } from "components/matchVisualizations/utils";
import { RawActivity } from "components/matchVisualizations/types";
import { matchTypes } from "components/matchVisualizations/calendarHeatMap/constants";

export const getDaysInMonth = (
  dates: Date[],
  dataByDay,
  dimension: number,
  getColor: (value: number) => string
) => {
  const earliestDate = timeMonth.ceil(dates[0]);
  return dates.map((date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const value = dataByDay[formattedDate]?.value || 0;
    return {
      id: formattedDate,
      date: formattedDate,
      value: value,
      x: date.getDay() * dimension,
      y: timeWeek.count(earliestDate, date) * dimension,
      color: value ? interpolatePurples(getColor(value)) : "white",
    };
  });
};

export const getDateRange = (data: DailyActivity[]) => {
  const dateStrings = data.map((datum) => datum.date).sort();

  return [_.first(dateStrings), _.last(dateStrings)];
};

const getTimeMonths = (
  year: number,
  firstMonth: number,
  lastMonth: number
): Date[] => {
  return timeMonths(
    new Date(year, firstMonth, 1),
    new Date(year, lastMonth + 1, 1)
  );
};

const getMonthsInYear = (years, firstMonth, lastMonth) => (year, index) => {
  let monthsInYears = getTimeMonths(year, 0, 11);
  if (years.length === 1) {
    monthsInYears = getTimeMonths(year, firstMonth, lastMonth);
  }
  if (index === 0) {
    monthsInYears = getTimeMonths(year, firstMonth, 11);
  }

  if (year === _.last(years)) {
    monthsInYears = getTimeMonths(year, 0, lastMonth);
  }

  return monthsInYears.map((firstDayInMonth) => ({
    month: firstDayInMonth.getMonth(),
    year,
  }));
};

export const getYearsWithMonthlyValues = (data: DailyActivity[]) => {
  const [firstDate, lastDate] = getDateRange(data);

  // TODO: earliestMonth turns to 04-30 if we have 05-01. Why does new Date work that way? Figure it out
  const earliestMonth = new Date(firstDate).getMonth();
  const earliestYear = new Date(firstDate).getFullYear();

  const latestMonth = new Date(lastDate).getMonth();
  const latestYear = new Date(lastDate).getFullYear();

  // Add one to lastYear, because _.range not inclusive of final year
  const years: number[] = _.range(earliestYear, latestYear + 1);

  const monthsAvailablePerYear = years.map(
    getMonthsInYear(years, earliestMonth, latestMonth)
  );

  return monthsAvailablePerYear;
};

const getValueRange = (data: DailyActivity[]): [number, number] => {
  const values = data.map((datum) => datum.value);

  const min: number = _.min(values);
  const max: number = _.max(values);

  return [min, max];
};

export const getColorScale = (
  data: DailyActivity[]
): ((value: number) => string) => {
  const domain = getValueRange(data);

  // Use 0.25 to 0.75 as range for d3-scale-chromatic and ensure even the lightest color is visible
  return scaleLinear().domain(domain).range([0.25, 0.75]);
};

const appendMetadata = (activity: RawActivity) => {
  if (isMatchFromReceivedLike(activity)) {
    return {
      ...activity,
      match: [
        {
          ...activity.match[0],
          match_type: matchTypes.match_from_received_like,
        },
      ],
    };
  }

  return activity;
};

export const formatCalendarActivities = (
  activities: RawActivity[] = [],
  activityFilter: (activity: RawActivity) => boolean = () => true
): DailyActivity[] => {
  const activitiesWithMetadata = activities.map(appendMetadata);
  const flattened = activitiesWithMetadata.map((activity) => {
    const values = Object.values(activity);
    return _.flatten(values);
  });

  const allActivities = _.flatten(flattened)
    // @ts-ignore - need to figure out what happened here. Seems like flattening is making us lose types
    .filter(activityFilter)
    .map((activity) => {
      return {
        ...activity,
        date: moment(activity.timestamp).format("YYYY-MM-DD"),
      };
    });

  const rawActivitiesByDate = _.groupBy(allActivities, "date");

  return _.map(rawActivitiesByDate, (activities, key) => {
    return {
      date: key,
      value: activities.length,
    };
  });
};
