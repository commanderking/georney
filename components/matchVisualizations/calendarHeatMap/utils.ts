import { timeWeek, timeMonth, timeMonths } from "d3-time";
import { scaleLinear } from "d3-scale";
import { interpolatePurples } from "d3-scale-chromatic";
import _ from "lodash";
import moment from "moment";
import { CalendarData } from "./types";

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

export const getDateRange = (data: CalendarData[]) => {
  const dateStrings = data.map((datum) => datum.date).sort();

  return [_.first(dateStrings), _.last(dateStrings)];
};

const getTimeMonths = (year: number, firstMonth: number, lastMonth: number) => {
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

export const getYearsWithMonthlyValues = (data: CalendarData[]) => {
  const [firstDate, lastDate] = getDateRange(data);

  // TODO: earliestMonth turns to 04-30 if we have 05-01. Why does new Date work that way? Figure it out
  const earliestMonth = new Date(firstDate).getMonth();
  const earliestYear = new Date(firstDate).getFullYear();

  const latestMonth = new Date(lastDate).getMonth();
  const latestYear = new Date(lastDate).getFullYear();

  // Add one to lastYear, because _.range not inclusive of final year
  const years = _.range(earliestYear, latestYear + 1);

  const monthsAvailablePerYear = years.map(
    getMonthsInYear(years, earliestMonth, latestMonth)
  );

  return monthsAvailablePerYear;
};

const getValueRange = (data: CalendarData[]): [number, number] => {
  const values = data.map((datum) => datum.value);

  const min: number = _.min(values);
  const max: number = _.max(values);

  return [min, max];
};

export const getColorScale = (
  data: CalendarData[]
): ((value: number) => string) => {
  const domain = getValueRange(data);

  // Use 0.25 to 0.75 as range for d3-scale-chromatic and ensure even the lightest color is visible
  return scaleLinear().domain(domain).range([0.25, 0.75]);
};

export const formatCalendarActivities = (
  activities: any = [],
  activityFilter: (activity: any) => boolean = () => true
) => {
  const flattened = activities.map((activity) => {
    const values = Object.values(activity);
    return _.flatten(values);
  });

  const allActivities = _.flatten(flattened)
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
