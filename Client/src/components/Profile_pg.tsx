import { Copy, Mars, MoveLeft, Venus } from "lucide-react"
import { useNavigate } from "react-router-dom";
import useProfile_Hooks, { type ApiResponse } from "../Hooks/Profile.Hook";
import { copyUserId, shortenId } from "../helper/Copy";
import type { SelectedUserData } from "../Context/context";
import useUser_Search from "../Hooks/Search.Handler_hook";
import { useSearchParams } from "react-router-dom";
import UseRoom_hook from "../Hooks/Chat_room_hook";

export type Profile_DataType = {
  username: string;
  avatar: string;
  publicId: string;
  bio: string;
  gender: string;
  userId : string
};

const Profile_pg = () => {

//   const { setLoad , load} = useSearch();
  const navigate =  useNavigate();
  const CreateRoom_Mutate = UseRoom_hook();

  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");
  const userId = searchParams.get("userId");
  
  const { data: myData } = useProfile_Hooks();
  const { data: otherData} = useUser_Search(username as string);

  const MyProfile_Data = ( my_data : ApiResponse ): Profile_DataType => ({
    username: my_data.message.data.username,
    avatar: my_data.message.data.avatar,
    publicId: my_data.message.data.public_Id,
    bio: my_data.message.data.Bio,
    gender: my_data.message.data.gender,
    userId : my_data.message.data.user_id
  });

  const OtherUser_Data = ( other_user : SelectedUserData): Profile_DataType => ({
    username: other_user.username,
    avatar: other_user.user_avatar,
    publicId: other_user.Public_user_id,
    bio: other_user.user_Bio,
    gender: other_user.user_gender,
    userId : other_user._id
  });

  //Handle Both User
  const resolveProfileData = () : Profile_DataType | null => {
    if ( userId && otherData ) {        
        return OtherUser_Data(otherData?.message[0]);
    }

    if ( myData && !userId ) {
        return MyProfile_Data(myData);
    }

    return null;
   };

  const FinalProfileData : Profile_DataType | null = resolveProfileData();
  
  return (
    <div className="md:p-2 w-full h-full">
        <div className="flex border-b pl-4 mb-4 py-2 justify-start gap-3 md:gap-4 items-center">
            <div onClick={() => {navigate('/')}} className="mt-1">
                <MoveLeft size={24} strokeWidth={1.70} />
            </div>
            <h1 className="md:text-2xl">User Profile</h1>
        </div>
        { FinalProfileData && <div>
        <div className="flex flex-col bg-am  border-b  border-gray-300 pb-5 md:flex-row gap-6 justify-center items-center md:justify-evenly py-6">
            <div>
            <img className="h-28 md:w-46 md:h-46 w-28 rounded-full" src={`${FinalProfileData?.avatar}`} alt="" />
            </div>
            
            <div className="text-center w-full flex flex-col md:block justify-center items-center md:w-4/6 md:text-left ">
                <h1 className="md:text-2xl mb-1">Username : 
                    <span> {FinalProfileData?.username}</span>
                </h1>
                
                <div className="flex items-center gap-2 md:pl-1 bg-amber">
                <small className="">UserId :</small>  
                <div className="flex w-fit bg-gray-200 p-1 px-3 rounded-2xl flex-row items-center ">
                    <small className="mr-2">
                      { shortenId(FinalProfileData?.publicId as string) }
                    </small> 
                    <Copy onClick={() => copyUserId(FinalProfileData?.publicId as string)} className="hover:cursor-pointer" size={12} strokeWidth={1} />  
                </div>
                </div>

            </div>
        </div>

        <div className="mb:ml-20 mb-10 mb:pl-10  ml-5">
            <div className="my-4">
                <h3 className="font-medium mb-1">Bio :</h3>
                <div className="pl-6">
                    <li>{FinalProfileData?.bio}</li>
                    {/* <li>I text better than I talk.</li>
                    <li>Sending good vibes only ✨</li> */}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <p className="font-medium">Gender : </p>
                <span>{FinalProfileData?.gender}</span>
                {FinalProfileData?.gender == 'Male' ?
                    <Mars className="mt-1 mr-1" size={14} strokeWidth={1} /> :
                    <Venus className="mt-1 mr-1" size={14} strokeWidth={1} />
                }
            </div>
        </div>
        </div>}
        
        { otherData?.message[0] && (
            
        <div onClick={() => CreateRoom_Mutate.mutate(otherData?.message[0].Public_user_id)} className="mb:pl-10 flex justify-center mt-20 md:mt-25 items-center md:block md:ml-5">
            <button className="bg-gray-800 hover:cursor-pointer  hover:bg-gray-700  border font-medium text-white border-gray-200 rounded-2xl px-20 py-3">Let us Chat</button>
        </div>
        )}
        
    </div>
  )
}

export default Profile_pg
