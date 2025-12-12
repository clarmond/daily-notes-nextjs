'use client';

import LoginBox from "./components/LoginBox";
import TodaysGoalsBox from "./components/TodaysGoalsBox";
import TodaysDoneBox from "./components/TodaysDoneBox";
import PreviousDoneBox from "./components/PreviousDoneBox";
import DeleteModal from "./components/DeleteModal";
import SplashScreen from "./components/SplashScreen";

import { useSession } from 'next-auth/react';
import { useGlobalContext } from '@/context/GlobalContext';

export default function Home() {
  const { data: session, status } = useSession();
  const { isLoaded } = useGlobalContext();

  // Show splash screen while auth is loading
  if (status === 'loading') {
    return <SplashScreen />;
  }

  // Show splash screen while data is loading (only if authenticated)
  if (session && !isLoaded) {
    return <SplashScreen />;
  }

  if (session) {
    return (
      <div className="container">
        <DeleteModal />
        <TodaysGoalsBox />
        <TodaysDoneBox />
        <PreviousDoneBox />
      </div>
    );
  } else {
    return <LoginBox />;
  }
}
