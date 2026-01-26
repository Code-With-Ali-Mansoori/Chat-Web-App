import MySearchResults from "./Search_res_help"

const Search_result = () => {
  return (
    <div className="h-full relative">
      <h2 className="mt-1 font-mono text-gray-600 ml-1">Search Results</h2>
      <MySearchResults/>
      <p className="text-center  text-gray-400  py-2">No Search Found!</p>
    </div>
  )
}

export default Search_result
