import { DataPoint } from "./types";
import { formatData, getColorScaler } from "./utils";
import moment from "moment";

type Props = {
  data: DataPoint[];
  getColor?: (value: number) => string;
  startDate: Date;
  endDate: Date;
  // Not sure if this is the best
  isHeaderRow?: boolean;
};

const defaultGetColor = getColorScaler(10);

const getTooltipProps = (month) => {
  if (month.value === 0) {
    return {};
  }
  return {
    "data-tip": month.value,
    "data-for": "artistMonth",
  };
};

const TimelineHeatMap = ({
  data,
  getColor,
  startDate,
  endDate,
  isHeaderRow,
}: Props) => {
  const getColorActual = getColor || defaultGetColor;
  const months = formatData(data, {
    startDate,
    endDate,
  });

  const side = 25;
  const spacing = 2;
  const getX = (index: number) => side * index + spacing * index;
  return (
    <svg width={350} height={25}>
      {!isHeaderRow &&
        months.map((month, index) => {
          return (
            <rect
              {...getTooltipProps(month)}
              key={month.monthDate}
              fill={getColorActual(month.value)}
              width={side}
              height={side}
              x={getX(index)}
              strokeWidth={1}
              stroke="gray"
            ></rect>
          );
        })}
      {
        // TODO: A hack - not an ideal way to call for the header row, but key is to keep calculations consistent. Long term a hook might be best to get the x, width, height that can be used across the actual heatmap and the header
      }
      {isHeaderRow &&
        months.map((month, index) => {
          return (
            <text key={month.monthDate} x={getX(index)} y={20} fontSize={12}>
              {moment(month.monthDate).format("MMM")}
            </text>
          );
        })}
    </svg>
  );
};

export default TimelineHeatMap;
