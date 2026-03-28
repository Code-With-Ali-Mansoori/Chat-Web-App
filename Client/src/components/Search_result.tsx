import useSearch from "../Hooks/SearchContext.hook";
import MySearchResults from "./Search_res_help";
import search_illustrate from '../utils/s.png';
import useUser_Search from "../Hooks/Search.Handler_hook";
import type { Key } from "react";

export interface UserProfileResponse {
  _id: string;               
  username: string;
  user_avatar: string;
  user_Bio: string;
  user_gender: "Male" | "Female" 
  Public_user_id: string;     
  Active_Status: boolean;
  Last_active: string;  // ISO date string
};

const Search_result = () => {

  const { userSearched } = useSearch();
  const {data} = useUser_Search(userSearched);
  
  return (
    <div className="h-full relative">
      <h2 className="mt-1 font-mono text-gray-600 ml-1">Search Results</h2>

      {data?.message && Array.isArray(data?.message) && (
        data?.message.map((user : UserProfileResponse, index : Key) => (          
          <MySearchResults 
            key={index}
            username={user.username} 
            Active_Status={user.Active_Status} 
            Last_active={user.Last_active} 
            user_avatar={user.user_avatar} 
            _id={user._id}
            Public_user_id={user.Public_user_id}
            user_Bio={user.user_Bio}
            user_gender={user.user_gender}
          />)
      ))}
      
      { typeof data?.message === "string" && (
        <div>
          <div className="flex flex-col justify-center items-center">
              <img className="md:h-2/2 md:w-3/8  md:p-20 p-6 flex justify-center items-center rounded-full" 
              src={search_illustrate} 
              alt="search not found"/>
              <p className="flex md:text-2xl justify-center items-center text-gray-600 h-full">No Search Found!</p>
          </div>
        </div> 
      )}
       
    </div>
  )
}

export default Search_result
