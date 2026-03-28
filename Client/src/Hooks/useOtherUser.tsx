import { useQuery } from "@tanstack/react-query"
import HandleUserData from "../helper/Other.user";

const useOtherUser = (publicId : string) => {
    return useQuery({
        queryKey : ['Other_UserId', publicId],
        queryFn : () => HandleUserData(publicId)
    });
};
  
export default useOtherUser;  