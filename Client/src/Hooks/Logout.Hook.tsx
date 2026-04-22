import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const handle_UserLogout = async () => {
        try {
            const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {withCredentials : true});

            if ( res.status === 200 ) {
                return res.data;
            };

        } catch (error) {
            console.log(error);
            throw error;
        }
   };

export const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn : handle_UserLogout,
        onSuccess: () => {
            // Invalidate auth check cache
            queryClient.invalidateQueries({ queryKey: ['auth_check'] });
            // Clear profile cache too
            queryClient.invalidateQueries({ queryKey: ['My_Profile'] });
            // Navigate to login
            navigate('/user/login');
        },
        onError : () => console.log('Error in User Logout Mutation Functions!')    
    });
};
