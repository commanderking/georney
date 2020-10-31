import React from "react";
import { Calendar as NivoCalendar } from "@nivo/calendar";
import { formatCalendarActivities } from "../utils";
import styles from "./styles.module.scss";

type Props = {
  activities: any;
};

const Calendar = ({ activities }: Props) => {
  // TODO: Update with dates - hardcode for now
  const startDate = "2019-06-01";
  const endDate = "2020-10-05";

  const filterOutChats = (activity) => activity.type === "match";
  const formatted = formatCalendarActivities(activities, filterOutChats);
  return (
    <div className={styles.wrapper}>
      <div className={styles.svgWrapper}>
        <NivoCalendar
          height={400}
          width={1200}
          data={formatted}
          from={startDate}
          to={endDate}
          yearSpacing={40}
          colors={[
            "#EAFFD6",
            "#D7FFB0",
            "#AADD77",
            "#7FB747",
            "#599022",
            "#3A6A09",
          ]}
          monthSpacing={25}
        />
      </div>
    </div>
  );
};

export default Calendar;
