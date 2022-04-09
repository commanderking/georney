import { Box } from "@chakra-ui/react";

type Props = {
  data: {
    color: string;
    day: number;
  }[][];
  onlyShowDatesInMonth: boolean;
};

const Calendar = ({ data, onlyShowDatesInMonth }: Props) => {
  const width = 30;
  const height = 30;
  return (
    <svg height={height * data.length} width={width * 7}>
      {data.map((weeks, weekIndex) => {
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
