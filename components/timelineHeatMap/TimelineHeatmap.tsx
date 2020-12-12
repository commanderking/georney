import { DataPoint } from "./types";
import { formatData, getColorScaler } from "./utils";

type Props = {
  data: DataPoint[];
  getColor?: (value: number) => string;
};

const defaultGetColor = getColorScaler(10);

const TimelineHeatMap = ({ data, getColor }: Props) => {
  const getColorActual = getColor || defaultGetColor;
  const months = formatData(data, {
    startDate: new Date("2020-01-05"),
    endDate: new Date("2020-12-07"),
  });

  const side = 25;
  return (
    <svg width={400} height={25}>
      {months.map((month, index) => {
        return (
          <rect
            key={month.monthDate}
            fill={getColorActual(month.value)}
            width={side}
            height={side}
            x={side * index + 2 * index}
            strokeWidth={1}
            stroke="gray"
          ></rect>
        );
      })}
    </svg>
  );
};

export default TimelineHeatMap;
