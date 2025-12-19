'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import LoginBox from "../components/LoginBox";
import BackburnerLowPriorityBox from "../components/BackburnerLowPriorityBox";
import BackburnerCompletedBox from "../components/BackburnerCompletedBox";
import DeleteModal from "../components/DeleteModal";
import SplashScreen from "../components/SplashScreen";
import { getBackburnerTasks } from '../actions/backburnerTasks';

export default function Backburner() {
  const { data: session, status } = useSession();
  const [backburnerItems, setBackburnerItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (session) {
      const fetchTasks = async () => {
        const tasks = await getBackburnerTasks();
        setBackburnerItems(tasks);
        setIsLoaded(true);
      };
      fetchTasks();
    }
  }, [session]);

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
        <DeleteModal
          backburnerItems={backburnerItems}
          setBackburnerItems={setBackburnerItems}
        />
        <BackburnerLowPriorityBox
          backburnerItems={backburnerItems}
          setBackburnerItems={setBackburnerItems}
        />
        <BackburnerCompletedBox
          backburnerItems={backburnerItems}
          setBackburnerItems={setBackburnerItems}
        />
      </div>
    );
  } else {
    return <LoginBox />;
  }
}
