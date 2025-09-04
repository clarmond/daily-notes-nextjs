import TodaysGoalsBox from "./components/TodaysGoalsBox";
import TodaysDoneBox from "./components/TodaysDoneBox";
import PreviousDoneBox from "./components/PreviousDoneBox";
import DeleteModal from "./components/DeleteModal";

export default function Home() {
  return (
    <div className="container">
      <DeleteModal />
      <TodaysGoalsBox />
      <TodaysDoneBox />
      <PreviousDoneBox />
    </div>
  );
}
