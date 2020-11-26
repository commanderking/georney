import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import Calendar from "./Calendar";
import React, { useState } from "react";

const activityTypes = {
  ALL_ACTIVITY: "ALL_ACTIVITY",
  LIKES_SENT: "LIKES_SENT",
  MATCHES: "MATCHES",
  MESSAGES: "MESSAGES",
  MET: "MET",
};

type CalendarActivityTypes = keyof typeof activityTypes;

const filters: {
  [key in CalendarActivityTypes]: (activity: any) => boolean;
} = {
  // This duplicates some data right now, namely like/match
  ALL_ACTIVITY: (activity: any) =>
    activity.type === "like" ||
    activity.type === "match" ||
    activity.type === "block",
  LIKES_SENT: (activity: any) => {
    return activity.type === "like";
  },
  MATCHES: (activity: any) => {
    return activity.type === "match";
  },
  MESSAGES: (activity: any) => activity.type === "chats",
  MET: (activity: any) => activity.type === "we_met",
};

type Props = {
  activities: any;
  width: number | string;
};

const CalendarFilterable = ({ activities, width = 500 }: Props) => {
  const [activityType, setActivityType] = useState(activityTypes.ALL_ACTIVITY);

  const handleActivityTypeChange = (event, newActivityType) => {
    setActivityType(newActivityType);

    if (newActivityType === null) {
      setActivityType(activityTypes.ALL_ACTIVITY);
    }
  };
  return (
    <div>
      <ToggleButtonGroup
        exclusive
        value={activityType}
        onChange={handleActivityTypeChange}
        size={"small"}
      >
        <ToggleButton value={activityTypes.ALL_ACTIVITY}>
          All Activity
        </ToggleButton>
        <ToggleButton value={activityTypes.LIKES_SENT}>Likes</ToggleButton>
        <ToggleButton value={activityTypes.MATCHES}>Matches</ToggleButton>
        <ToggleButton value={activityTypes.MESSAGES}>Messages</ToggleButton>
        <ToggleButton value={activityTypes.MET}>First Dates</ToggleButton>
      </ToggleButtonGroup>
      <Calendar
        activities={activities}
        width={width}
        activityFilter={filters[activityType]}
      />
    </div>
  );
};

export default CalendarFilterable;
