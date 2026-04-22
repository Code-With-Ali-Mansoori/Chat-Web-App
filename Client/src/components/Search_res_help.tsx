import type { SelectedUserData } from "../Context/context";
import useSearch from "../Hooks/SearchContext.hook";

type UserData = {
  username: string;
  user_avatar: string;
  Active_Status: boolean;
  _id : string;
  Last_active: string; // ISO date string
  Public_user_id : string,
  user_Bio : string,
  user_gender : string
};

const MySearchResults = ({username, _id, Active_Status, user_avatar, Last_active, Public_user_id, user_Bio, user_gender} : UserData) => {

  const {setSelectedUser, setIsPop_Unable, isPop_Unable} = useSearch();

  const formatted = new Date(Last_active).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
   });

  const userData : SelectedUserData = {
    username, Active_Status, formatted , user_avatar, _id, Public_user_id, user_gender, user_Bio
  };  

  const handleUserAction = () => {
      setSelectedUser(userData);
      setIsPop_Unable(!isPop_Unable);
  };
       
  return (
    <div className="w-full py">  
    {  userData && 
      <div 
      onClick={handleUserAction} 
      id={userData.Public_user_id} 
      className="w-full my-3 h-13 flex justify-between items-center border rounded border-gray-500 p-2 hover:cursor-pointer hover:bg-gray-100">

            <div className="cursor-pointer">
                <img className="h-10 w-10 rounded-full border border-gray-600" 
                src={userData.user_avatar} />
            </div>

            <div className="flex w-4/6 p-1 px-3 flex-col justify-center items-start">
                <p className="text-sm">{userData.username}</p>
                <small className="font-light">{userData.formatted}</small>
            </div>

            <div className=" flex justify-end w-1/6">
                <small className={`items-end px-1 font-medium text-gray-400`}>
                    {userData.Active_Status ? 'Online': 'offline'}
                </small>
            </div>
    </div>
    }
    </div>   
  )
}

export default MySearchResults;
