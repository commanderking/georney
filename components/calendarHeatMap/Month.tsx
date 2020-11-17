import React from "react";
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

import { getDaysInMonth } from "./utils";

const Calendar = ({ data }) => {
  const dataPerDay = _.keyBy(data, "day");
  const dimension = 20;

  //November
  const month = 10;
  const year = 2020;

  const earliestDate = new Date(year, month, 1);
  // needs to be first day of next month for timeDay.range (last date is not inclusive)
  const latestDate = new Date(year, month + 1, 1);

  // TODO - need one more date than latest to include last day in the month
  const dates = timeDay.range(earliestDate, latestDate);

  const days = getDaysInMonth(dates, dataPerDay, dimension);

  return (
    <svg width={dimension * 7 + 1} height={500}>
      <g>
        {days.map((day) => {
          return (
            <rect
              key={day.id}
              fill={day.color}
              x={day.x}
              y={day.y}
              width={dimension}
              height={dimension}
              stroke="gray"
              strokeWidth={1}
            />
          );
        })}
      </g>
    </svg>
  );
};

export default Calendar;
