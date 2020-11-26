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
  activityFilter?: (activity: any) => boolean;
  width?: number;
};

const Calendar = ({
  activities,
  activityFilter = () => true,
  width = 500,
}: Props) => {
  const activityDates = formatCalendarActivities(activities, activityFilter);
  const dataPerDay = _.keyBy(activityDates, "date");

  // For consistent months to display across filters, use all activities to create months and years
  const allActivities = formatCalendarActivities(activities);
  const years = getYearsWithMonthlyValues(allActivities);
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
