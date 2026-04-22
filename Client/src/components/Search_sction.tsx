// import useDebounced_search from "../Hooks/Debounse.search"
// import useUser_Search from "../Hooks/Search.Handler_hook";
import useSearch from "../Hooks/SearchContext.hook";
import { useNavigate } from "react-router-dom";

const Search_sction = () => {

  const navigates = useNavigate();
  const { setUserSearched, userSearched } = useSearch();

  // const Debounced_searchValue = useDebounced_search(userSearched); //Debounce Search
  // const {data} = useUser_Search(Debounced_searchValue);

  // useEffect(() => {
  //   if ( data?.message?.length > 0 ){ 
  //       setSearchResult(data?.message);
  //   };
  // }, [setSearchResult, data?.message]);
    
  return (
    <>
        <div className='flex md:pl-3 mx-2 md:mx-0 justify-center items-center w-2/3 md:w-2/3 h-full'>
            <input value={userSearched} onChange={(e) => setUserSearched(e.target.value)} className='border-2 border-gray-300 w-2/3 p-1 pl-2 rounded-l focus:outline-none' type="text" placeholder='Search here..'/>
            <button onClick={() => navigates('user/search')} className='border-2 cursor-pointer border-gray-700 px-2 md:px-4 p-1 rounded-r bg-gray-700 text-white font-mono' >Search</button>
        </div>

    </>
  )
};

export default Search_sction;
