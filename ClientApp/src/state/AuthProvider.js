import { createContext, useState } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [tempPassword, setTempPassword] = useState(null);
    const [emailRecovery, setEmailRecovery] = useState(null);


    return (
        <AuthContext.Provider value={{ auth, setAuth, tempPassword, setTempPassword, emailRecovery, setEmailRecovery }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;