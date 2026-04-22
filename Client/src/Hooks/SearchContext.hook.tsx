import { useContext } from "react";
import ContextData from "../Context/context";

const useSearch = () => {
        const context = useContext(ContextData)

        if ( !context ) {
            throw new Error("useSearch must be used inside SearchProvider"); 
        };
    
        return context
};

export default useSearch;
