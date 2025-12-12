'use client';

import { useSession } from 'next-auth/react';
import LoginBox from "../components/LoginBox";

export default function Reports() {
  const { data: session } = useSession();

  if (!session) {
    return <LoginBox />;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Reports</h2>
          <div className="card">
            <div className="card-body">
              <p className="text-muted">Reports page - Coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
