import TodaysGoalsBox from "./components/TodaysGoalsBox";
import TodaysDoneBox from "./components/TodaysDoneBox";
import PreviousDoneBox from "./components/PreviousDoneBox";

export default function Home() {
  return (
    <div className="container">
      <h1 className="text-center">Daily Notes App</h1>
      <TodaysGoalsBox />
      <TodaysDoneBox />
      <PreviousDoneBox />
    </div>
  );
}
