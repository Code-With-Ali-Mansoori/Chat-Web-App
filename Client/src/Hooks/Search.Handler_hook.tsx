import { useQuery } from "@tanstack/react-query";
import Search_user_Function from '../helper/Search.user.ts'
import useDebounced_search from "./Debounse.search.tsx";

const useUser_Search = (search : string) => {
    
    const Debounced_searchValue = useDebounced_search(search); //Debounce Search

    return useQuery({
            queryKey : ['searched_user', search],
            queryFn  : () => Search_user_Function(Debounced_searchValue),
            enabled  : Debounced_searchValue?.trim().length > 0 // only runs when search exists
    });
};

export default useUser_Search;

// Having the problem like, 
// Search result data is manage by Context and when i reload the page it goes 
// I have to change my code and manage data by React-Query for data fetching, persistant and improve performance
