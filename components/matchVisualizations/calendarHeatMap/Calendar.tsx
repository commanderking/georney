import Month from "components/matchVisualizations/calendarHeatMap/Month";
import _ from "lodash";
import {
  getColorScale,
  getYearsWithMonthlyValues,
  formatCalendarActivities,
} from "./utils";
import { RawActivity } from "components/matchVisualizations/types";
type Props = {
  activities: RawActivity[];
  width?: number;
};

const Calendar = ({ activities, width = 500 }: Props) => {
  const activityDates = formatCalendarActivities(activities);
  const dataPerDay = _.keyBy(activityDates, "date");
  const years = getYearsWithMonthlyValues(activityDates);
  const getColor = getColorScale(activityDates);

  return (
    <div style={{ width }}>
      {years.map((year) => {
        return (
          <div key={`Year-${year[0].year}`}>
            <h3>{year[0].year}</h3>
            {year.map((monthData) => (
              <Month
                key={`Month-${monthData.month}`}
                data={dataPerDay}
                year={monthData.year}
                month={monthData.month}
                getColor={getColor}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default Calendar;
