import { timeWeek, timeMonth } from "d3-time";
import { scaleLinear } from "d3-scale";
import { interpolatePurples } from "d3-scale-chromatic";
import _ from "lodash";
import moment from "moment";
import { CalendarData } from "./types";

export const getDaysInMonth = (
  dates: Date[],
  dataByDay,
  dimension: number,
  colorScale: (value: number) => string
) => {
  const earliestDate = timeMonth.ceil(dates[0]);
  console.log("colorScale", colorScale);
  return dates.map((date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    return {
      id: formattedDate,
      date: formattedDate,
      value: dataByDay[formattedDate]?.value || 0,
      x: date.getDay() * dimension,
      y: timeWeek.count(earliestDate, date) * dimension,
      color: dataByDay[formattedDate]?.value
        ? interpolatePurples(colorScale(dataByDay[formattedDate].value))
        : "white",
    };
  });
};

export const getDateRange = (data: CalendarData[]) => {
  const dateStrings = data.map((datum) => datum.date).sort();

  return [_.first(dateStrings), _.last(dateStrings)];
};

const getValueRange = (data: CalendarData[]) => {
  const values = data.map((datum) => datum.value);

  const min: number = _.min(values);
  const max: number = _.max(values);

  return [min, max];
};

export const getColorScale = (data: CalendarData[]) => {
  const domain = getValueRange(data);

  // Use 0.25 to 0.75 as range for d3-scale-chromatic and ensure even the lightest color is visible
  return scaleLinear().domain(domain).range([0.25, 0.75]);
};
