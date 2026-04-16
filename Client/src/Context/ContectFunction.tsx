import ContextData, { type SelectedUserData, type UserSearchResult } from "./context"
import { useState, type ReactNode } from "react"

interface app_props {
    children: ReactNode
};

export const ContextHanlder_Function = ({children} : app_props) => {

    const [userSearched, setUserSearched] = useState<string>('');
    const [searchResult, setSearchResult] = useState<UserSearchResult[]>([]);
    const [selectedUser, setSelectedUser] = useState<SelectedUserData | null>(null);
    const [isPop_Unable, setIsPop_Unable] = useState<boolean>(false);
    const [load, setLoad] = useState<boolean>(false);
    const [callId, setCallId] = useState<string | null>(null);

    return ( 
        <ContextData.Provider 
        value={{
            userSearched, 
            setUserSearched, 
            searchResult, 
            setSearchResult, 
            setSelectedUser, 
            selectedUser,
            isPop_Unable,
            setIsPop_Unable,
            load,
            setLoad,
            callId,
            setCallId
            }}>
        {children}
        </ContextData.Provider>
    )
};

//Creating Context with TS
// 1. Create type of state/data
// 2. create context 
// 3. create Context Provider-Function 
// 4. Pass the data which will manage entire the app!
// 5. Best-Practice => Handle Context in Custom-Hooks