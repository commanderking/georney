import _ from "lodash";
import moment from "moment";

import {
  RawActivity,
  Activity,
  activityTypes,
  ActivityType,
  MatchTypeWithTime,
  LikeMatch,
} from "./types";
// import ChatIcon from "./images/chat.svg";
// import CalendarIcon from "./images/calendar.svg";
import { colorMap } from "./constants";

export const isActualMatch = (activity: RawActivity): number =>
  activity.match ? 1 : 0;

export const isLike = (activity: RawActivity): number =>
  activity.like ? 1 : 0;

export const isSuccessfulLike = (activity: RawActivity): number =>
  activity.like && activity.match ? 1 : 0;

const isUnsuccessfulLike = (activity: RawActivity): number =>
  activity.like && !activity.match ? 1 : 0;

const isBlock = (activity: RawActivity): number => (activity.block ? 1 : 0);

export const isReceivedLike = (activity: RawActivity): number =>
  !activity.like ? 1 : 0;

export const isMatchFromReceivedLike = (activity: RawActivity): number =>
  activity.match && !activity.like ? 1 : 0;

const isMatchWithChat = (activity: RawActivity) =>
  activity.match && activity.chats ? 1 : 0;

export const hasMet = (activity: RawActivity) =>
  activity.match && activity.we_met;

export const isConversation = (activity: RawActivity) =>
  activity.chats && activity.chats.length > 3;

export const isConversationFromReceivedLike = (activity: RawActivity) =>
  Boolean(isConversation(activity) && isMatchFromReceivedLike(activity));

export const isConversationFromSentLike = (activity: RawActivity) =>
  Boolean(isConversation(activity) && isChatFromSentLike(activity));

export const isMeetingFromReceivedLike = (activity: RawActivity) =>
  Boolean(hasMet(activity) && isMatchFromReceivedLike(activity));

export const isChatFromSentLike = (activity: RawActivity) =>
  isMatchWithChat(activity) && isSuccessfulLike(activity);

export const isChatFromReceivedLike = (activity: RawActivity) =>
  Boolean(isMatchWithChat(activity) && isReceivedLike(activity));

export const isMeetingFromSentLike = (activity: RawActivity) =>
  hasMet(activity) && isSuccessfulLike(activity);

const getMatchesForConditionCreator =
  (
    filter: (activity: RawActivity) => number | boolean,
    type: ActivityType,
    timestampGetter: (activity: RawActivity) => Date | undefined
  ) =>
  (activities: RawActivity[]) => {
    const filteredMatches = activities.filter(filter);

    const matchesOfType = filteredMatches.map((match) => {
      const date = timestampGetter(match) || new Date();

      return {
        type,
        year: date.getFullYear(),
        month: date.getMonth(),
        yearMonth: `${date.getMonth() + 1}/${date.getFullYear()}`,
        timestamp: timestampGetter(match),
      };
    });

    return _.groupBy(matchesOfType, "yearMonth");
  };

const getTimeOfMatch = (activity: RawActivity) =>
  activity.match && new Date(activity.match[0].timestamp);

const getTimeOfReceivedLike = (activity: RawActivity) =>
  (activity.match && new Date(activity.match[0].timestamp)) ||
  (activity.block && new Date(activity.block[0].timestamp));

const getTimeOfSentLike = (activity: RawActivity) =>
  activity.like && new Date(activity.like[0].timestamp);

const getTimeOfBlock = (activity: RawActivity) =>
  activity.block && new Date(activity.block[0].timestamp);

const getMatchesFromLikesByTime = getMatchesForConditionCreator(
  isSuccessfulLike,
  activityTypes.MATCH_FROM_LIKE,
  getTimeOfMatch
);

const getReceivedLikeMatchesByTime = getMatchesForConditionCreator(
  isMatchFromReceivedLike,
  activityTypes.MATCH_FROM_RECEIVED_LIKE,
  getTimeOfMatch
);

const getReceivedLikesByTime = getMatchesForConditionCreator(
  isReceivedLike,
  activityTypes.RECEIVED_LIKE,
  getTimeOfReceivedLike
);

const getSentLikesByTime = getMatchesForConditionCreator(
  isLike,
  activityTypes.RECEIVED_LIKE,
  getTimeOfSentLike
);

export const getTimeAxis = (matches: RawActivity[]) => {
  const { earliest, latest } = getEarliestAndLatestDate(matches);

  const earliestDate = moment(earliest);
  const latestDate = moment(latest);
  const result = [];

  while (earliestDate.isBefore(latestDate)) {
    result.push(_.trimStart(earliestDate.format("MM/YYYY"), "0"));
    earliestDate.add(1, "month");
  }
  return result;
};

const getDataPoint =
  (matchesByTime: _.Dictionary<MatchTypeWithTime[]>) =>
  (timePeriod: string) => {
    return {
      x: timePeriod,
      y: (matchesByTime[timePeriod] && matchesByTime[timePeriod].length) || 0,
    };
  };

const getDataSet = (
  activityTypes: _.Dictionary<MatchTypeWithTime[]>[],
  axisValues: string[]
) => {
  return activityTypes.map((matchType) => {
    return axisValues.map(getDataPoint(matchType));
  });
};

// TODO - This is wrong because it doubles up on likes that are also matches.
export const getAllActivity = (activities: RawActivity[]) => {
  const sentLikes = getSentLikesByTime(activities);
  const receivedLikes = getReceivedLikesByTime(activities);
  const likesMatches = getMatchesFromLikesByTime(activities);
  const receivedLikeMatches = getReceivedLikeMatchesByTime(activities);

  const axisValues = getTimeAxis(activities);
  return getDataSet(
    [sentLikes, receivedLikes, likesMatches, receivedLikeMatches],
    axisValues
  );
};

const getEarliestTimestamp = (activity: RawActivity) => {
  if (activity.block) {
    return activity.block[0].timestamp;
  }

  if (activity.like) {
    return activity.like[0].timestamp;
  }

  if (activity.match) {
    return activity.match[0].timestamp;
  }

  return "";
};

const getEarliestDate = (activity: RawActivity) => {
  return new Date(getEarliestTimestamp(activity));
};

export const getEarliestAndLatestDate = (matches: RawActivity[]) => {
  return matches.reduce(
    (dates, match) => {
      const earliestDateInMatch = getEarliestDate(match);

      return {
        earliest:
          dates.earliest < earliestDateInMatch
            ? dates.earliest
            : earliestDateInMatch,
        latest:
          dates.latest < earliestDateInMatch
            ? earliestDateInMatch
            : dates.latest,
      };
    },
    {
      earliest: new Date(),
      latest: new Date(),
    }
  );
};

// Related to rendering visual graph
export const getReceivedLikes = (activities: RawActivity[]) => {
  return activities.filter(isReceivedLike);
};

export const getSentLikes = (activities: RawActivity[]) => {
  return activities.filter(isLike);
};

export const getBlockedReceivedLikes = (activities: RawActivity[]) => {
  return activities.filter(isBlock);
};

export const getMatchesFromReceivedLike = (activities: RawActivity[]) => {
  return activities.filter(isMatchFromReceivedLike);
};

export const getSuccessfulLikes = (activities: RawActivity[]) => {
  return activities.filter(isSuccessfulLike);
};

export const getUnsuccessfulLikes = (activities: RawActivity[]) => {
  return activities.filter(isUnsuccessfulLike);
};

export const getMatchesWithChat = (activities: RawActivity[]) => {
  return activities.filter(isMatchWithChat);
};

export const getMatchesFromReceivedLikeWithChat = (
  activities: RawActivity[]
) => {
  return activities.filter(
    (activity) => isConversation(activity) && isMatchFromReceivedLike(activity)
  );
};

export const getMatchesWithMeeting = (activities: RawActivity[]) => {
  return activities.filter(hasMet);
};

export const getMeetingFromReceivedLike = (activities: RawActivity[]) => {
  return activities.filter(isMeetingFromReceivedLike);
};

const getActivityByTimeCreator =
  (
    filter: (activity: Activity) => number | boolean,
    timestampGetter: (activity: Activity) => Date | undefined
  ) =>
  (activities: Activity[]) => {
    const filteredMatches = activities.filter(filter);

    const matchesOfType = filteredMatches.map((activity) => {
      const date = timestampGetter(activity) || new Date();

      return {
        ...activity,
        year: date.getFullYear(),
        month: date.getMonth(),
        yearMonth: `${date.getMonth() + 1}/${date.getFullYear()}`,
        timestamp: activity.timestamp,
      };
    });

    return _.groupBy(matchesOfType, "yearMonth");
  };

const getSuccessfulLikesByTime = getActivityByTimeCreator(
  isSuccessfulLike,
  getTimeOfMatch
);

const getMatchesFromReceivedLikesByTime = getActivityByTimeCreator(
  isMatchFromReceivedLike,
  getTimeOfMatch
);

const getUnsuccessfulLikesByTime = getActivityByTimeCreator(
  isUnsuccessfulLike,
  getTimeOfSentLike
);

const getBlocksByTime = getActivityByTimeCreator(isBlock, getTimeOfBlock);

export const getMatchesByTime = (activities: Activity[]) => {
  const successfulLikesByTime = getSuccessfulLikesByTime(activities);
  const matchesFromReceivedLikesByTime =
    getMatchesFromReceivedLikesByTime(activities);
  const unsuccesfulLikesByTime = getUnsuccessfulLikesByTime(activities);
  const blocksByTime = getBlocksByTime(activities);

  const allMonths = getTimeAxis(activities);

  return allMonths.reduce((activityByTime, month) => {
    return {
      ...activityByTime,
      [month]: [
        ...(successfulLikesByTime[month] || []),
        ...(matchesFromReceivedLikesByTime[month] || []),
        ...(unsuccesfulLikesByTime[month] || []),
        ...(blocksByTime[month] || []),
      ],
    };
  }, {});
};

export const getColor = (activity: RawActivity) => {
  if (isSuccessfulLike(activity)) {
    return colorMap.SENT_LIKE;
  }

  if (isMatchFromReceivedLike(activity)) {
    return colorMap.RECEIVED_LIKE;
  }

  return "gray";
};

export const getMatchColors = (activity: RawActivity) => {
  if (isLike(activity)) {
    return colorMap.SENT_LIKE;
  }

  if (isReceivedLike(activity)) {
    return colorMap.RECEIVED_LIKE;
  }

  return "gray";
};

// export const getIcon = (activity: RawActivity) => {
//   if (hasMet(activity)) {
//     return CalendarIcon;
//   }
//   if (isConversation(activity)) {
//     return ChatIcon;
//   }

//   return "";
// };

// export const getMatchesWithChatIcon = (activity: RawActivity) => {
//   if (isConversation(activity)) {
//     return ChatIcon;
//   }

//   return "";
// };

// export const getMatchesWithMeetingIcon = (activity: RawActivity) =>
//   hasMet(activity) ? CalendarIcon : "";

// export const getChatsFromReceivedLikeWithMeetingIcon = (
//   activity: RawActivity
// ) => (isConversationFromReceivedLike(activity) ? ChatIcon : "");

// export const getIconForMeetingFromReceivedLike = (activity: RawActivity) =>
//   isMeetingFromReceivedLike(activity) ? CalendarIcon : "";

// export const getIconForMeetingFromSentLike = (activity: RawActivity) =>
//   isMeetingFromSentLike(activity) ? CalendarIcon : "";

// export const getIconFromConversationFromSentLike = (activity: RawActivity) =>
//   isConversationFromSentLike(activity) ? ChatIcon : "";

export const getClusterHeight = (
  rows: number,
  circleUnit: number,
  topBuffer: number
) => {
  return rows * circleUnit + topBuffer;
};

export const getClusterWidth = (rows: number, circleUnit: number) => {
  return rows * circleUnit;
};

const appendTimestamp = (activity: RawActivity) => {
  if (activity.match) {
    return { ...activity, timestamp: activity.match[0].timestamp };
  }

  if (activity.like) {
    return { ...activity, timestamp: activity.like[0].timestamp };
  }

  if (activity.block) {
    return { ...activity, timestamp: activity.block[0].timestamp };
  }

  return {
    ...activity,
    timestamp: "",
  };
};

export const sanitizeMatches = (activities: Activity[]) => {
  const activitiesWithTime = activities.map(appendTimestamp);
  const sortedByTime = _.sortBy(activitiesWithTime, (activity) =>
    new Date(activity.timestamp).getTime()
  );

  return sortedByTime;
};

export const getActivitiesByMatchType = (
  activities: Activity[],
  options?: { startDate: Date; endDate: Date }
) => {
  const initialActivities: { [key: string]: Activity[] } = {
    sentLikes: [],
    sentLikesWithMatch: [],
    sentLikesWithChat: [],
    sentLikesWithConversation: [],
    sentLikesWithMeeting: [],

    receivedLikes: [],
    receivedLikesWithMatch: [],
    receivedLikesWithChat: [],
    receivedLikesWithConversation: [],
    receivedLikesWithMeeting: [],

    potentialMatches: [],
    actualMatches: [],
    matchesWithChat: [],
    blocks: [],
  };

  const toTimeRange = (activity: Activity) => {
    if (options && options.startDate && options.endDate) {
      return moment(activity.timestamp).isBetween(
        moment(options.startDate),
        moment(options.endDate),
        undefined,
        "[]"
      );
    }

    return activity;
  };

  const filteredActivities = activities.filter(toTimeRange);
  // @ts-ignore
  return filteredActivities.reduce((activityBreakdown, activity) => {
    const getNewActivity = (
      activityFilter: (activity: Activity) => number | boolean,
      activity: Activity
    ) => {
      return activityFilter(activity) ? [activity] : [];
    };

    return {
      sentLikes: [
        ...activityBreakdown.sentLikes,
        ...getNewActivity(isLike, activity),
      ],
      sentLikesWithMatch: [
        ...activityBreakdown.sentLikesWithMatch,
        ...getNewActivity(isSuccessfulLike, activity),
      ],
      sentLikesWithChat: [
        ...activityBreakdown.sentLikesWithChat,
        ...getNewActivity(isChatFromSentLike, activity),
      ],
      sentLikesWithConversation: [
        ...activityBreakdown.sentLikesWithConversation,
        ...getNewActivity(isConversationFromSentLike, activity),
      ],
      sentLikesWithMeeting: [
        ...activityBreakdown.sentLikesWithMeeting,
        ...(isMeetingFromSentLike(activity) ? [activity] : []),
      ],

      receivedLikes: [
        ...activityBreakdown.receivedLikes,
        ...getNewActivity(isReceivedLike, activity),
      ],
      receivedLikesWithMatch: [
        ...activityBreakdown.receivedLikesWithMatch,
        ...getNewActivity(isMatchFromReceivedLike, activity),
      ],
      receivedLikesWithChat: [
        ...activityBreakdown.receivedLikesWithChat,
        ...getNewActivity(isChatFromReceivedLike, activity),
      ],
      receivedLikesWithConversation: [
        ...activityBreakdown.receivedLikesWithConversation,
        ...getNewActivity(isConversationFromReceivedLike, activity),
      ],
      receivedLikesWithMeeting: [
        ...activityBreakdown.receivedLikesWithMeeting,
        ...getNewActivity(isMeetingFromReceivedLike, activity),
      ],

      potentialMatches: [...activityBreakdown.potentialMatches, activity],
      actualMatches: [
        ...activityBreakdown.actualMatches,
        ...getNewActivity(isActualMatch, activity),
      ],
      matchesWithChat: [
        ...activityBreakdown.matchesWithChat,
        ...getNewActivity(isMatchWithChat, activity),
      ],
      blocks: [
        ...activityBreakdown.blocks,
        ...getNewActivity(isBlock, activity),
      ],
    };
  }, initialActivities);
};

const getPercentString = (num: number, den: number) => {
  return `${Math.round((num / den) * 100)}%`;
};

export const getDashboardData = (activities: Activity[]) => {
  const activitiesByMatchType = getActivitiesByMatchType(activities);

  const {
    actualMatches,
    potentialMatches,
    sentLikesWithMatch,
    sentLikes,
    receivedLikesWithMatch,
    receivedLikes,
  } = activitiesByMatchType;
  return {
    overallSuccessRate: getPercentString(
      actualMatches.length,
      potentialMatches.length
    ),
    proactiveSuccessRate: getPercentString(
      sentLikesWithMatch.length,
      sentLikes.length
    ),
    passiveSuccessRate: getPercentString(
      receivedLikesWithMatch.length,
      receivedLikes.length
    ),
  };
};

export const getSankeyData = (activityMap: { [key: string]: Activity[] }) => {
  const {
    potentialMatches,
    receivedLikes,
    receivedLikesWithMatch,
    receivedLikesWithConversation,
    receivedLikesWithMeeting,
    sentLikes,
    sentLikesWithMatch,
    sentLikesWithConversation,
    sentLikesWithMeeting,
    actualMatches,
  } = activityMap;

  const matchNoChatCount =
    actualMatches.length -
    sentLikesWithConversation.length -
    receivedLikesWithConversation.length;

  const receivedLikesChatNoDate =
    receivedLikesWithConversation.length - receivedLikesWithMeeting.length;

  const sentLikesChatNoDate =
    sentLikesWithConversation.length - sentLikesWithMeeting.length;

  const chatsNoDates = receivedLikesChatNoDate + sentLikesChatNoDate;

  const allActivityId = `All Activity: ${potentialMatches.length}`;
  const sentId = `Likes Sent: ${sentLikes.length}`;
  const receivedId = `Likes Received: ${receivedLikes.length}`;

  const sentWithMatchId = `Matches: ${sentLikesWithMatch.length} `;
  const receivedWithMatchId = `Matches: ${receivedLikesWithMatch.length}`;
  const sentWithConvoId = `Chats: ${sentLikesWithConversation.length} `;
  const receivedWithConvoId = `Chats: ${receivedLikesWithConversation.length}`;
  const matchesWithoutConvoId = `Limited Chats: ${matchNoChatCount}`;

  const datesId = `Dates: ${
    sentLikesWithMeeting.length + receivedLikesWithMeeting.length
  }`;

  const noDatesId = `No Dates: ${chatsNoDates}`;

  const data = {
    nodes: [
      { id: allActivityId, label: "Interactions" },
      { id: sentId },
      { id: receivedId },
      { id: sentWithMatchId },
      { id: receivedWithMatchId },
      { id: sentWithConvoId },
      { id: receivedWithConvoId },
      { id: matchesWithoutConvoId },
      { id: datesId },
      { id: noDatesId },
    ],
    links: [
      {
        source: allActivityId,
        target: sentId,
        value: sentLikes.length,
      },
      {
        source: allActivityId,
        target: receivedId,
        value: receivedLikes.length,
      },
      {
        source: sentId,
        target: sentWithMatchId,
        value: sentLikesWithMatch.length,
      },
      {
        source: receivedId,
        target: receivedWithMatchId,
        value: receivedLikesWithMatch.length,
      },
      {
        source: sentWithMatchId,
        target: sentWithConvoId,
        value: sentLikesWithConversation.length,
      },
      {
        source: receivedWithMatchId,
        target: receivedWithConvoId,
        value: receivedLikesWithConversation.length,
      },
      {
        source: sentWithMatchId,
        target: matchesWithoutConvoId,
        value: sentLikesWithMatch.length - sentLikesWithConversation.length,
      },
      {
        source: receivedWithMatchId,
        target: matchesWithoutConvoId,
        value:
          receivedLikesWithMatch.length - receivedLikesWithConversation.length,
      },
      {
        source: sentWithConvoId,
        target: datesId,
        value: sentLikesWithMeeting.length,
      },
      {
        source: receivedWithConvoId,
        target: datesId,
        value: receivedLikesWithMeeting.length,
      },
      {
        source: sentWithConvoId,
        target: noDatesId,
        value: sentLikesChatNoDate,
      },
      {
        source: receivedWithConvoId,
        target: noDatesId,
        value: receivedLikesChatNoDate,
      },
    ],
  };
  return data;
};

export const formatCalendarActivities = (
  activities: Activity[],
  activityFilter: (activity: Activity) => boolean = () => true
) => {
  const flattened = activities.map((activity) => {
    const values = Object.values(activity);
    // @ts-ignore - figure out why flattend values seem to lose typing
    return _.flatten(values);
  });

  const allActivities = _.flatten(flattened)
    .filter(activityFilter)
    .map((activity) => {
      return {
        ...activity,
        date: moment(activity.timestamp).format("YYYY-MM-DD"),
      };
    });

  const rawActivitiesByDate = _.groupBy(allActivities, "date");

  return _.map(rawActivitiesByDate, (activities, key) => {
    return {
      day: key,
      value: activities.length,
    };
  });
};
