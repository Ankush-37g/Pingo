import { createContext, useState } from "react";


export const UserContext = createContext();


const UserProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(false);

  return (
    <UserContext.Provider value={{ selectedUser, setSelectedUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
