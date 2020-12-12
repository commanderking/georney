import { DataPoint } from "./types";
import { formatData, getColorScaler } from "./utils";

type Props = {
  data: DataPoint[];
  getColor?: (value: number) => string;
  startDate: Date;
  endDate: Date;
};

const defaultGetColor = getColorScaler(10);

const TimelineHeatMap = ({ data, getColor, startDate, endDate }: Props) => {
  const getColorActual = getColor || defaultGetColor;
  const months = formatData(data, {
    startDate,
    endDate,
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
