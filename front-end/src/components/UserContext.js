import React, { createContext, useEffect, useState } from "react";

// create context
export const UserContext = createContext();

// provider
const UserContextProvider = ({children}) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if(storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

    return (
        <UserContext.Provider 
            value={{
                user,
                setUser
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;