import Month from "components/calendarHeatMap/Month";
import _ from "lodash";
import {
  timeDay,
  timeDays,
  timeWeek,
  timeWeeks,
  timeMonths,
  timeMonth,
  timeYears,
  timeSaturday,
} from "d3-time";
import { getDateRange } from "./utils";
import { CalendarData } from "./types";

type Props = {
  data: CalendarData[];
  width?: number;
};

const getMonthsInYear = (
  year: number,
  firstMonth?: number,
  lastMonth?: number
) => {
  return timeMonths(
    new Date(year, firstMonth || 0, 1),
    new Date(year, lastMonth ? lastMonth + 1 : 12, 1)
  );
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

  // Add one, because not inclusive of final year
  const years = _.range(firstYear, lastYear + 1);
  console.log("years", years);

  const yearsWithMonths = years.map((year, index) => {
    let monthsInYears = getMonthsInYear(year);
    if (years.length === 1) {
      monthsInYears = getMonthsInYear(year, firstMonth, lastMonth);
    }
    if (index === 0) {
      monthsInYears = getMonthsInYear(year, firstMonth);
    }

    if (year === _.last(years)) {
      monthsInYears = getMonthsInYear(year, 0, lastMonth);
    }

    return monthsInYears.map((firstDayInMonth) => ({
      month: firstDayInMonth.getMonth(),
      year: firstDayInMonth.getFullYear(),
    }));
  });

  console.log("yearsWithMonths", yearsWithMonths);

  return (
    <div style={{ width }}>
      {yearsWithMonths.map((months) => {
        return (
          <div>
            <h3>{months[0].year}</h3>
            {months.map((month, index) => (
              <Month data={dataPerDay} year={month.year} month={month.month} />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default Calendar;
