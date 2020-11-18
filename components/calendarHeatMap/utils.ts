import { timeWeek, timeMonth } from "d3-time";
import _ from "lodash";
import moment from "moment";

type RawData = {
  date: string;
  value: number;
};

export const getDaysInMonth = (dates: Date[], dataByDay, dimension: number) => {
  const earliestDate = timeMonth.ceil(dates[0]);

  return dates.map((date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    return {
      id: formattedDate,
      date: formattedDate,
      value: dataByDay[formattedDate]?.value || 0,
      x: date.getDay() * dimension,
      y: timeWeek.count(earliestDate, date) * dimension,
      color: dataByDay[formattedDate]?.value ? "lavender" : "white",
    };
  });
};

export const getDateRange = (data: RawData[]) => {
  const dateStrings = data.map((datum) => datum.date).sort();

  return [_.first(dateStrings), _.last(dateStrings)];
};
