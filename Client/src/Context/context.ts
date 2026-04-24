import { createContext } from "react";

export interface UserSearchResult {
  user_avatar: string;
  username: string;
  Last_active: string;
  Active_Status: boolean;
  _id : string,
  Public_user_id : string,
  user_Bio : string,
  user_gender: string
};

export interface SelectedUserData {
  username : string,
  Active_Status : boolean,
  formatted : string,
  user_avatar : string,
  _id: string,
  Public_user_id : string,
  user_gender : string, 
  user_Bio : string
};

export type UserSearched = {
    userSearched : string,
    setUserSearched : (value: string) => void,

    searchResult : UserSearchResult[] ,
    setSearchResult : (value: UserSearchResult[]) => void,

    selectedUser : SelectedUserData | null,
    setSelectedUser : (value: SelectedUserData) => void,

    isPop_Unable : boolean
    setIsPop_Unable : (value : boolean) => void,

    load : boolean,
    setLoad : (value : boolean) => void

    callId : string | null,
    setCallId : (value : string | null) => void,

    isCallActive : boolean,
    setIsCallActive : (value : boolean) => void
};

const ContextData = createContext< null | UserSearched >(null);
export default ContextData;
