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
import { CalendarData } from "./types";

type Props = {
  data: CalendarData[];
  width?: number;
};

const Calendar = ({ data, width = 500 }: Props) => {
  const dataPerDay = _.keyBy(data, "date");

  const [firstDate, lastDate] = getDateRange(data);

  // firstMonthDate turns to 04-30 if we have 05-01. Why does new Date work that way? Figure it out
  const firstMonthDate = new Date(firstDate);
  const firstMonth = new Date(firstDate).getMonth();
  const firstYear = new Date(firstDate).getFullYear();

  const lastMonth = new Date(lastDate).getMonth();
  const lastYear = new Date(lastDate).getFullYear();

  const monthsInYear = timeMonths(
    new Date(firstYear, firstMonth, 1),
    new Date(lastYear, lastMonth + 1, 1)
  );
  const monthDates = monthsInYear.map((firstDayInMonth) => ({
    month: firstDayInMonth.getMonth(),
    year: firstDayInMonth.getFullYear(),
  }));

  return (
    <div style={{ width }}>
      {monthDates.map((month) => (
        <Month data={dataPerDay} year={month.year} month={month.month} />
      ))}
    </div>
  );
};

export default Calendar;
