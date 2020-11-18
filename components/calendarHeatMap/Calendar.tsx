import Month from "components/calendarHeatMap/Month";
import _ from "lodash";
import {
  timeDay,
  timeDays,
  timeWeek,
  timeWeeks,
  timeMonths,
  timeMonth,
  timeYear,
  timeSaturday,
} from "d3-time";
import { getDateRange } from "./utils";

const Calendar = ({ data }) => {
  const year = 2020;
  const month = 10;
  const dataPerDay = _.keyBy(data, "date");

  const [firstDate, lastDate] = getDateRange(data);

  console.log("first", firstDate);

  const firstMonthDate = new Date(firstDate);
  const firstMonth = new Date(firstDate).getMonth();
  const firstYear = new Date(firstDate).getFullYear();

  const lastMonth = new Date(lastDate).getMonth();
  const lastYear = new Date(lastDate).getFullYear();

  console.log("firstMonth", firstMonth);
  const monthsInYear = timeMonths(
    new Date(firstYear, firstMonth + 1, 1),
    new Date(lastYear, lastMonth + 1, 1)
  );
  console.log("monthsInYear", monthsInYear);

  const monthDates = monthsInYear.map((firstDayInMonth) => ({
    month: firstDayInMonth.getMonth(),
    year: firstDayInMonth.getFullYear(),
  }));

  console.log("monthDates", monthDates);
  return monthDates.map((month) => (
    <Month data={dataPerDay} year={month.year} month={month.month} />
  ));
};

export default Calendar;
