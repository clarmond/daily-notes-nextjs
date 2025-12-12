"use client";

import { useEffect, useState } from "react";
import { getProviders } from "next-auth/react";

import LoginButton from "./LoginButton";

const LoginBox = ({ provider }) => {
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };

    setAuthProviders();
  }, []);

  return (
    <>
      {providers &&
        Object.values(providers).map((provider) => (
          <div id="login-box" key={provider.id}>
            <LoginButton provider={provider} />
          </div>
        ))}
    </>
  );
};

export default LoginBox;
