import Month from "components/calendarHeatMap/Month";

const rawData = [
  { day: "2020-11-12", value: 3 },
  { day: "2020-11-19", value: 5 },
  { day: "2020-11-21", value: 5 },
];

const Calendar = () => {
  return <Month data={rawData} />;
};

export default Calendar;
