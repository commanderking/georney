export type ChatMatch = { type: string; timestamp: string; body: string };

export type LikeMatch = { type: string; comment: string; timestamp: string };

export type RawActivity = {
  chats?: ChatMatch[];
  match?: { type: string; timestamp: string }[];
  like?: LikeMatch[];
  block?: { block_type: string; timestamp: string; type: string }[];
  we_met?: { type: string; timestamp: string }[];
};

export type Activity = RawActivity & {
  timestamp: string;
};

export const activityTypes = {
  MATCH_FROM_RECEIVED_LIKE: "MATCH_FROM_RECEIVED_LIKE" as "MATCH_FROM_RECEIVED_LIKE",
  MATCH_FROM_LIKE: "MATCH_FROM_LIKE" as "MATCH_FROM_LIKE",
  RECEIVED_LIKE: "RECEIVED_LIKE" as "RECEIVED_LIKE",
};

export type ActivityType = keyof typeof activityTypes;

export type MatchTypeWithTime = {
  type: ActivityType;
  year: number;
  month: number;
  yearMonth: string;
  timestamp: Date | undefined;
};

export type ActivityWithTime = RawActivity & {
  year: number;
  month: number;
  yearMonth: string;
  timestamp: Date;
};

export type TooltipContent = {
  timestamp: Date;
  messagesCount?: number;
  messages?: ChatMatch[];
  block?: boolean;
  likeComment?: string;
};
