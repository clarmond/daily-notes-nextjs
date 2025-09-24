'use client';

import LoginBox from "./components/LoginBox";
import TodaysGoalsBox from "./components/TodaysGoalsBox";
import TodaysDoneBox from "./components/TodaysDoneBox";
import PreviousDoneBox from "./components/PreviousDoneBox";
import DeleteModal from "./components/DeleteModal";

import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return (
      < div className="container" >
        <DeleteModal />
        <TodaysGoalsBox />
        <TodaysDoneBox />
        <PreviousDoneBox />
      </div >
    );
  } else {
    return <LoginBox />
  }
}
