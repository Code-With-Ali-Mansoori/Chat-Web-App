import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface UserProfile {
  Bio: string;
  avatar: string;
  email: string;
  gender: "Male" | "Female" | string;
  public_Id: string;
  user_id: string;
  username: string;
};

export interface Message {
  data: UserProfile;
};

export interface ApiResponse {
  message: Message;
};

const profile_function = async () : Promise<ApiResponse> => {
    try {
        const res = await axios.get<ApiResponse>('http://localhost:5000/user/profile', {withCredentials : true});
                
        return res.data;

    } catch (error) {
        console.log(error);
        throw new Error("Error in Profile Custom Hooks handler");
    };
};

const useProfile_Hooks = () => {
    return useQuery({
        queryKey : ['My_Profile'],
        queryFn  : profile_function,
        staleTime: 10 * 60 * 1000,
    });
};

export default useProfile_Hooks;