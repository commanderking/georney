import { Box } from "@chakra-ui/react";

type Props = {
  data: {
    color: string;
    day: number;
  }[][];
  onlyShowDatesInMonth: boolean;
};

const daysOfWeek = ["Su", "M", "T", "W", "Th", "F", "Sa"].map((day) => ({
  day,
  color: "lightgray",
}));

const Calendar = ({ data, onlyShowDatesInMonth }: Props) => {
  const width = 45;
  const height = 45;

  const dataWithHeader = [daysOfWeek, ...data];
  return (
    <svg
      style={{ display: "inline-block" }}
      height={height * data.length}
      width={width * 7}
    >
      {dataWithHeader.map((weeks, weekIndex) => {
        return (
          <g y={height * weekIndex}>
            {weeks.map((day, dayIndex) => {
              const displayDate =
                onlyShowDatesInMonth && day.day < 1 ? "" : day.day;
              return (
                <g width={width} height={height}>
                  <rect
                    x={dayIndex * width}
                    y={weekIndex * height}
                    width={width}
                    height={height}
                    fill={day.color}
                  ></rect>
                  <text
                    fontSize={14}
                    alignmentBaseline="middle"
                    text-anchor="middle"
                    x={dayIndex * width + width / 2}
                    y={weekIndex * height + width / 2}
                  >
                    {displayDate}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
};

export default Calendar;
