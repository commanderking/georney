import { timeMonths, timeMonth } from "d3-time";
import moment from "moment";
import { DataPoint } from "./types";
import _ from "lodash";
import { scaleLinear } from "d3-scale";

const getMonths = (startDate, endDate) => {
  return timeMonths(timeMonth.floor(startDate), timeMonth.ceil(endDate)).map(
    (monthDate) => ({
      date: monthDate,
      monthDate: moment(monthDate).format("YYYY-MM"),
    })
  );
};

export const getColorScaler = (maxValue: number) => {
  return scaleLinear()
    .domain([0, maxValue])
    .range(["white", "#F6BDC0", "#F1959B", "#F07470", " #EA4C46", "#DC1C13"]);
};

export const formatData = (
  rawData: DataPoint[],
  { startDate, endDate }: { startDate: Date; endDate: Date }
) => {
  const months = getMonths(startDate, endDate);

  const grouped = _.groupBy(rawData, (data: DataPoint) =>
    moment(data.date).format("YYYY-MM")
  );

  const totalsByMonth = _.mapValues(grouped, (valuesOfTime) => {
    const initial = {
      value: 0,
    };
    return valuesOfTime.reduce((totalValues, currentValue) => {
      return {
        value: totalValues.value + currentValue.value,
      };
    }, initial);
  });

  const monthsWithValues = months.map((month) => {
    const value = totalsByMonth[month.monthDate]?.value || 0;
    return {
      monthDate: moment(month.date).format("YYYY-MM"),
      value,
    };
  });

  return monthsWithValues;
};
