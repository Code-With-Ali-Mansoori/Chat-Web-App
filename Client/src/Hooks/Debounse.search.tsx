import { useEffect, useState } from "react";

const useDebounced_search = (value : string, delay = 500) => {

    const [debounced_Search, setDebounced_Search] = useState('');

    useEffect(() => {
        const timerToFetch = setTimeout(() => {
            setDebounced_Search(value)
        }, delay);
        
        return () => clearTimeout(timerToFetch);
    }, [value, delay]);

    return debounced_Search;
};

export default useDebounced_search;

// What is debounce? 
// Debounce = wait for the user to stop typing before calling the API.
// So instead of 
// a → al → ali → alim → ali... (5 API calls 😵)
// you get 1 API call ✅