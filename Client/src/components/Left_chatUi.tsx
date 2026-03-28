import { Search } from "lucide-react"
import Mychats from "./mychats"
import { useNavigate } from "react-router-dom";
import useProfile_Hooks from "../Hooks/Profile.Hook";

const Left_chatUi = () => {

  const navigator =  useNavigate();
  const { data } = useProfile_Hooks();

  return (
    <div className=" h-full w-full">
        
        <div className="pt-5 w-full flex gap-3 justify-center items-center">

            <div onClick={() => {navigator('/profile')}} className=" mx-3 pl-2">
             <div className="h-12 w-12 hover:cursor-pointer">
                    <img className="w-full h-full rounded-full" src={data?.message.data.avatar} alt="user_profile_img" />
            </div>
            </div>
            
            <div className='flex bg-blue-00  pr-3 justify-start items-center w-4/4 h-full'>
                <input className='border-2 border-gray-300 w-2/3 p-2 pl-3 rounded-l-2xl focus:outline-none' type="text" placeholder='Search here..'/>
                <button className='border-2 flex justify-center items-center  rounded-r-2xl w-2/8  hover:cursor-pointer border-gray-600 md:px-4 px-2 p-3 bg-gray-600 hover:bg-gray-500 hover:border-gray-500 text-white font-mono'> 
                    <Search className="text-white font-medium" size={16} strokeWidth={2.50} />
                </button>
            </div>
        </div>

        <div className="border p-3 overflow-y-scroll overflow-x-hidden chat-scroll  border-gray-500 h-6/7  mt-4 m-4 rounded-2xl">
            <Mychats/>
        </div>
    </div>
  )
}

export default Left_chatUi
