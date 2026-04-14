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

const auth_check_function = async (): Promise<string> => {
    try {
        const res = await axios.get<string>('http://localhost:5000/is/auth', {withCredentials: true});
        return res.data;
    } catch (error) {
        console.log(error);
        throw new Error("User not authenticated");
    }
};

export const useAuthCheck = () => {
    return useQuery({
        queryKey: ['auth_check'],
        queryFn: auth_check_function,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: false, // Don't retry on failure
    });
};

 const useProfile_Hooks = () => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: profile_function,
        retry: false, // Don't retry on failure
    });
};

export default useProfile_Hooks;