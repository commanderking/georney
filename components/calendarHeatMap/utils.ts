import { timeWeek, timeMonth } from "d3-time";

export const getDaysInMonth = (dates: Date[], dataByDay, dimension: number) => {
  const earliestDate = timeMonth.ceil(dates[0]);

  return dates.map((date) => {
    const formattedDate = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    return {
      id: formattedDate,
      day: formattedDate,
      value: dataByDay[formattedDate]?.value || 0,
      x: date.getDay() * dimension,
      y: timeWeek.count(earliestDate, date) * dimension,
      color: dataByDay[formattedDate]?.value ? "lavender" : "white",
    };
  });
};
