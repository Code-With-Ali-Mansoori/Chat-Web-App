import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const handle_UserLogout = async () => {
        try {
            const res = await axios.delete('http://localhost:5000/user/logout', {withCredentials : true});

            if ( res.status === 200 ) {
                alert("User Logout ✅");
                return;
            };

        } catch (error) {
            console.log(error);
        }
   };

export const useLogout = () => {
    return useMutation({
        mutationFn : handle_UserLogout,
        onError : () => console.log('Erorr in User Logout Mutation Functions!')    
    });
};
