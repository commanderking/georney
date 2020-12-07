import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import Calendar from "./Calendar";
import React, { useState } from "react";
import {
  activityTypes,
  matchTypes,
} from "components/matchVisualizations/calendarHeatMap/constants";
import {
  CalendarActivityTypes,
  ActivityCommon,
} from "components/matchVisualizations/calendarHeatMap/types";

const isReceivedLike = (activity: ActivityCommon) =>
  activity.match_type === matchTypes.match_from_received_like ||
  activity.type === "block";

const filters: {
  [key in CalendarActivityTypes]: (activity: ActivityCommon) => boolean;
} = {
  ALL_LIKES: (activity: ActivityCommon) =>
    activity.type === "like" || isReceivedLike(activity),
  LIKES_SENT: (activity: ActivityCommon) => {
    return activity.type === "like";
  },
  LIKES_RECEIVED: (activity: ActivityCommon) => isReceivedLike(activity),
  MATCHES: (activity: ActivityCommon) => {
    return activity.type === "match";
  },
  MESSAGES: (activity: ActivityCommon) => activity.type === "chats",
  MET: (activity: ActivityCommon) => activity.type === "we_met",
};

type Props = {
  activities: any;
  width: number | string;
};

const CalendarFilterable = ({ activities, width = 500 }: Props) => {
  const [activityType, setActivityType] = useState(activityTypes.ALL_LIKES);

  const handleActivityTypeChange = (event, newActivityType) => {
    setActivityType(newActivityType);

    if (newActivityType === null) {
      setActivityType(activityTypes.ALL_LIKES);
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
        <ToggleButton value={activityTypes.LIKES_SENT}>Sent</ToggleButton>
        <ToggleButton value={activityTypes.LIKES_RECEIVED}>
          Received
        </ToggleButton>

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
