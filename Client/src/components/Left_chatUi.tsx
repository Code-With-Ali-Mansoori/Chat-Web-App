import { Search } from "lucide-react"
import Mychats from "./mychats"
import { useNavigate } from "react-router-dom";
import useProfile_Hooks from "../Hooks/Profile.Hook";
import useSearch from "../Hooks/SearchContext.hook";
import useUser_Search from "../Hooks/Search.Handler_hook";
import MySearchResults from "./Search_res_help";
import type { Key } from "react";
import type { UserSearchResult } from "../Context/context";
import { useState } from "react";

const Left_chatUi = () => {

  const navigator =  useNavigate();
  const { data } = useProfile_Hooks();

  const { setUserSearched, userSearched } = useSearch();
  const [searchTrigger, setSearchTrigger] = useState<string>('');
  const {data : searchedRes} = useUser_Search(searchTrigger);  

  return (
    <div className=" h-full w-full">
        
        <div className="pt-5 w-full flex gap-3 justify-center items-center">

            <div onClick={() => {navigator('/profile')}} className=" mx-3 pl-2">
             <div className="h-12 w-12 hover:cursor-pointer">
                    <img className="w-full h-full rounded-full" src={data?.message.data.avatar} alt="user_profile_img" />
            </div>
            </div>
            
            <div className='flex bg-blue-00  pr-3 justify-start items-center w-4/4 h-full'>
                <input value={userSearched} onChange={(e) => { setUserSearched(e.target.value); setSearchTrigger(''); }} className='border-2 border-gray-300 w-2/3 p-2 pl-3 rounded-l-2xl focus:outline-none' type="text" placeholder='Search here..'/>

                <button onClick={() => setSearchTrigger(userSearched)} className='border-2 flex justify-center items-center  rounded-r-2xl w-2/8  hover:cursor-pointer border-gray-600 md:px-4 px-2 p-3 bg-gray-600 hover:bg-gray-500 hover:border-gray-500 text-white font-mono'> 
                    <Search className="text-white font-medium" size={16} strokeWidth={2.50} />
                </button>
            </div>
        </div>

        <div className="border p-3 overflow-y-scroll overflow-x-hidden chat-scroll  border-gray-500 h-6/7  mt-4 m-4 rounded-2xl">
            {searchTrigger.trim() && searchedRes ? (
                Array.isArray(searchedRes.message) && searchedRes.message.length > 0 ? (
                    searchedRes.message.map((user : UserSearchResult , index : Key) => (
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
                        />
                    ))
                ) : searchedRes.message === "User not Found" ? (
                    <div className="text-center text-gray-500 mt-4">No users found</div>
                ) : (
                    <Mychats/>
                )
            ) : (
                <Mychats/>
            )}
        </div>
    </div>
  )
}

export default Left_chatUi
