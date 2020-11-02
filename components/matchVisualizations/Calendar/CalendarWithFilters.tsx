import React, { useState } from "react";
import Calendar from "./Calendar";
// @ts-ignore
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

type Props = {
  activities: any;
};

const activityTypes = {
  LIKES: "LIKES" as const,
  MATCHES: "MATCHES" as const,
  MESSAGES: "MESSAGES" as const,
  MET: "MET" as const,
};

const filters = {
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

const CalendarWithFilters = ({ activities }: Props) => {
  const [activityType, setActivityType] = useState(activityTypes.LIKES);

  const handleActivityTypeChange = (event, newActivityType) => {
    console.log("newActivityType", newActivityType);
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
        activityFilter={filters[activityType]}
      />
    </div>
  );
};

export default CalendarWithFilters;
