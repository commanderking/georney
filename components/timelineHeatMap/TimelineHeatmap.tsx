import { DataPoint } from "./types";
import { formatData } from "./utils";

const mockData = [
  {
    date: "2020-02-05",
    value: 5,
  },
  {
    date: "2020-03-05",
    value: 5,
  },
  { date: "2020-04-05", value: 20 },
  {
    date: "2020-06-06",
    value: 6,
  },
  {
    date: "2020-06-07",
    value: 10,
  },
  {
    date: "2020-12-08",
    value: 12,
  },
];

type Props = {
  data: DataPoint[];
  // valueRange: [];
};

const TimelineHeatMap = ({ data }: Props) => {
  console.log("heatmap data", data);
  const months = formatData(data, {
    startDate: new Date("2020-01-05"),
    endDate: new Date("2020-12-07"),
  });

  console.log("months", months);

  const side = 25;
  return (
    <svg width={400} height={25}>
      {months.map((month, index) => {
        return (
          <rect
            key={month.monthDate}
            fill={month.color}
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
