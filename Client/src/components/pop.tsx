import { Compass, X } from "lucide-react"
import { useNavigate } from "react-router-dom";
import useSearch from "../Hooks/SearchContext.hook";
import UseRoom_hook from "../Hooks/Chat_room_hook";

const Pop = () => {

  //Feature-1 => 11 feb 2026
  // Here I will create chat-room for user 
  // Api requied User_Id on [ /create/chat-room ] => Room Created Successfully
  // Redirect to Chat UI 
  // then Chat-UI hit one more get/api [ /chat-room/users/publicId=:id ] for userdata to show

  const navigator =  useNavigate();
  const CreateRoom_Mutate = UseRoom_hook();
  const {selectedUser, isPop_Unable, setIsPop_Unable} = useSearch();

  const handleUserAction = () => {
    setIsPop_Unable(!isPop_Unable);
  };
  
  return (
    <div className={`${isPop_Unable ? "flex" : "hidden"} fixed z-10 md:left-10 top-0 h-full w-full justify-center items-center`}> {/* Just on /off flex-hidden here */}
      
    <div className=" bg-gray-100 rounded-2xl px-3 py-4  md:h36 h-fit w-58 md:w80 ">

      <span className="mb-3 flex justify-between border-b border-gray-200 pb-1">
        <span className="flex justify-center items-center gap-1">
          <p className="pl-2 font-medium">Quick actions</p>
          <Compass className="pt-1" strokeWidth={1.8} size={20}/>
        </span>

        <X onClick={handleUserAction} className="bg-gray-200  hover:cursor-pointer p-1 rounded-full" strokeWidth={1.75} size={22}/>
      </span>

        <small className="ml-2 font-medium block"> Which option you have to choose</small>
        <small className="ml-2 font-medium block my-1"> for {selectedUser?.username.toUpperCase()}?</small>

        <div className="flex justify-center items-center gap-1 md:gap-4 pt-3 ">
            <small  
            onClick={() => { 
              navigator(`/profile?username=${selectedUser?.username}&userId=${selectedUser?.Public_user_id}`);
              setIsPop_Unable(!isPop_Unable);
            }} 
            className=" rounded border  hover:cursor-pointer border-black px-2 py-1 font-medium bg- text-">View Profile</small>
            <small 
            onClick={() => {              
              if (selectedUser?.Public_user_id) {
                  CreateRoom_Mutate.mutate(selectedUser?.Public_user_id)
              };
              setIsPop_Unable(!isPop_Unable);
            }} 
            className="border border-black rounded px-2 py-1 ml-3 md:ml-0  font-medium text-white hover:cursor-pointer bg-black">Let's Chat</small>
        </div>

    </div>
    </div>
  )
}

export default Pop
