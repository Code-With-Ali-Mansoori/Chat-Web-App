import { Copy, Mars, MoveLeft } from "lucide-react"

const Profile_pg = () => {
  return (
    <div className=" md:p-2 w-full h-full">
        <div className="flex border-b border--300 pl-4 mb-4 py-2 justify-start gap-3 md:gap-4 items-center">
            <div className="mt-1">
                <MoveLeft size={24} strokeWidth={1.70} />
            </div>
            <h1 className="md:text-2xl md:font-">User Profile</h1>
        </div>

        <div className="flex flex-col bg-am  border-b  border-gray-300 pb-5 md:flex-row gap-6 justify-center items-center md:justify-evenly py-6">
            <div>
            <img className="h-28 md:w-46 md:h-46 w-28" src="https://static.vecteezy.com/system/resources/previews/019/896/008/non_2x/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png" alt="" />
            </div>
            
            <div className="text-center w-full flex flex-col md:block justify-center items-center md:w-4/6 md:text-left ">
                <h1 className="md:text-2xl mb-1">Username : 
                    <span> Ali_Mansoori123</span>
                </h1>
                
                <div className="flex items-center gap-2 md:pl-1 bg-amber">
                <small className="">UserId :</small>  
                <div className="flex w-fit bg-gray-200 p-1 px-3 rounded-2xl flex-row items-center ">
                    <small className="mr-2">ijhu76ghuy_ygi98y7ti_8i</small> 
                    <Copy className="hover:cursor-pointer" size={12} strokeWidth={1} />  
                </div>
                </div>

            </div>
        </div>

        <div className="mb:ml-20 mb-10 mb:pl-10  ml-5">
            <div className="my-4">
                <h3 className="font-medium mb-1">Bio :</h3>
                <div className="pl-6">
                    <li>Built on caffeine & code. 🧑‍💻</li>
                    <li>I text better than I talk.</li>
                    <li>Sending good vibes only ✨</li>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <p className="font-medium">Gender : </p>
                <span>Male</span>
                <Mars className="mt-1 mr-1" size={14} strokeWidth={1} />
            </div>
        </div>

        <div className="mb:pl-10 flex justify-center items-center md:block md:ml-5">
            <button className="bg-gray-800 border font-medium text-white border-gray-200 rounded-2xl px-20 py-3">Let us Chat</button>
        </div>
    </div>
  )
}

export default Profile_pg
