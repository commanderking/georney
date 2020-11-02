import React from "react";
import { Calendar as NivoCalendar } from "@nivo/calendar";
import { formatCalendarActivities } from "../utils";
import styles from "./styles.module.scss";

type Props = {
  activities: any;
  activityFilter?: (activity: any) => boolean;
};

const Calendar = ({ activities, activityFilter }: Props) => {
  // TODO: Update with dates - hardcode for now
  const startDate = "2019-06-01";
  const endDate = "2020-10-05";

  const filterOutChats = (activity) => activity.type !== "chats";
  const formatted = activityFilter
    ? formatCalendarActivities(activities, activityFilter)
    : formatCalendarActivities(activities);
  return (
    <div className={styles.wrapper}>
      <div className={styles.svgWrapper}>
        <NivoCalendar
          height={1200}
          width={400}
          data={formatted}
          from={startDate}
          to={endDate}
          yearSpacing={100}
          colors={[
            "#EAFFD6",
            "#D7FFB0",
            "#AADD77",
            "#7FB747",
            "#599022",
            "#3A6A09",
          ]}
          monthSpacing={35}
          align="left"
          margin={{
            left: 20,
            top: 20,
          }}
          direction="vertical"
        />
      </div>
    </div>
  );
};

export default Calendar;
