export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const colorMap = {
  GRAY: "lightgray",
  SENT_LIKE: "#FFD1DC",
  RECEIVED_LIKE: "#B19CD9",
};

export const steps = {
  ALL_MATCHES: "ALL_MATCHES" as const,
  LIKES_RECEIVED: "LIKES_RECEIVED" as const,
  MATCHES_FROM_LIKES_RECEIVED: "MATCHES_FROM_LIKES_RECEIVED" as const,
  CONVOS_FROM_LIKES_RECEIVED: "CONVOS_FROM_LIKES_RECEIVED" as const,
  MEETS_FROM_LIKES_RECEIVED: "MEETS_FROM_LIKES_RECEIVED" as const,

  LIKES_SENT: "LIKES_SENT" as const,
  MATCHES_FROM_LIKES_SENT: "MATCHES_FROM_LIKES_SENT" as const,
  CONVOS_FROM_SENT_LIKES: "CONVOS_FROM_SENT_LIKES" as const,
  MEETS_FROM_SENT_LIKES: "MEETS_FROM_SENT_LIKES" as const,
};
