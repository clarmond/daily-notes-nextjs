import { FaGoogle, FaUserLock } from "react-icons/fa";
import { signIn } from 'next-auth/react';

const LoginButton = ({ provider }) => {
    let icon;
    switch (provider.id) {
        case 'google':
            icon = FaGoogle;
            break;
        default:
            icon = FaUserLock;
    }

    return (
        <button key={provider.id} onClick={() => signIn(provider.id)} className="btn btn-primary d-flex align-items-center">
            {icon()}
            &nbsp;
            Login
        </button>
    );
}

export default LoginButton;