import Calendar from "components/matchVisualizations/calendarHeatMap/Calendar";
import activities from "data/matches.json";

const CalendarPage = () => {
  return <Calendar activities={activities} width={500} />;
};

export default CalendarPage;
