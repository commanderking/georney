import Calendar from "components/calendarHeatMap/Calendar";

const rawData = [
  { date: "2018-04-01", value: 2 },
  { date: "2019-08-12", value: 5 },
  { date: "2020-05-02", value: 1 },
  { date: "2020-09-12", value: 1 },
  { date: "2020-09-01", value: 1 },
  { date: "2020-11-12", value: 3 },
  { date: "2020-11-19", value: 10 },
  { date: "2020-11-21", value: 5 },
];

const CalendarPage = () => {
  return <Calendar data={rawData} width={500} />;
};

export default CalendarPage;
