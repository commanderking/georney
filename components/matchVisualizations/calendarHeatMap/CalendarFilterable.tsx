import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import Calendar from "./Calendar";
import React, { useState } from "react";
const activityTypes = {
  LIKES: "LIKES" as const,
  MATCHES: "MATCHES" as const,
  MESSAGES: "MESSAGES" as const,
  MET: "MET" as const,
};

type CalendarActivityTypes = keyof typeof activityTypes;

const filters: {
  [key in CalendarActivityTypes]: (activity: any) => boolean;
} = {
  LIKES: (activity: any) => {
    return (
      activity.type === "like" ||
      activity.type === "block" ||
      activity.type === "match"
    );
  },
  MATCHES: (activity: any) => {
    return activity.type === "match";
  },
  MESSAGES: (activity: any) => activity.type === "chats",
  MET: (activity: any) => activity.type === "we_met",
};

const CalendarFilterable = ({ activities, width = 500 }) => {
  const [activityType, setActivityType] = useState(activityTypes.LIKES);

  const handleActivityTypeChange = (event, newActivityType) => {
    setActivityType(newActivityType);

    if (newActivityType === null) {
      setActivityType(activityTypes.LIKES);
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
        <ToggleButton value={activityTypes.LIKES}>Likes</ToggleButton>
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
