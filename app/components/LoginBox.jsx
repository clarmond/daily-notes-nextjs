'use client';

import { useEffect, useState } from "react";
import { getProviders } from 'next-auth/react';

import LoginButton from "./LoginButton";

const LoginBox = ({ provider }) => {
    const [providers, setProviders] = useState(null);

    useEffect(() => {
        const setAuthProviders = async () => {
            const res = await getProviders();
            console.log(res)
            setProviders(res);
        }

        setAuthProviders();
    }, []);

    return (
        <div id="login-box">
            {providers && Object.values(providers).map((provider) => (
                <LoginButton key={provider.id} provider={provider} />
            ))}
        </div>
    )
}

export default LoginBox;