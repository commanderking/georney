import React from "react";
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
import { monthsFullName } from "./constants";

const Calendar = ({ data, year, month, getColor }) => {
  const dimension = 18;

  const earliestDate = new Date(year, month, 1);
  // needs to be first day of next month for timeDay.range (last date is not inclusive)
  const latestDate = new Date(year, month + 1, 1);

  // TODO - need one more date than latest to include last day in the month
  const dates = timeDay.range(earliestDate, latestDate);

  const days = getDaysInMonth(dates, data, dimension, getColor);

  const width = dimension * 7 + 20;

  const maxWeeksPerMonth = 5;
  const height = dimension * maxWeeksPerMonth + 50;

  const textHeight = 12;
  const titleHeight = 20;

  return (
    <svg width={width} height={height}>
      <text y={textHeight}>{monthsFullName[month]}</text>

      <g y={textHeight}>
        {days.map((day) => {
          return (
            <rect
              key={day.id}
              fill={day.color}
              x={day.x}
              y={titleHeight + day.y}
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
