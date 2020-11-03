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

const colors = {
  LIKES: ["#ffe6ea", "	#ffb3bf", "#ff8095", "#ff4d6a", "#ff002b"],
  MATCHES: ["#D7FFB0", "#AADD77", "#7FB747", "#599022", "#3A6A09"],
  MESSAGES: ["#e6b3ff", "#cc66ff", "#b31aff", "#8800cc", "#660099", "#440066"],
  MET: ["#D7FFB0", "#AADD77", "#7FB747", "#599022", "#3A6A09"],
};

const CalendarWithFilters = ({ activities }: Props) => {
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
        activityFilter={filters[activityType]}
        colors={colors[activityType]}
      />
    </div>
  );
};

export default CalendarWithFilters;
