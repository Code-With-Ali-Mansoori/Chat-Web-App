const Search_sction = () => {
  return (
    <>
        <div className='flex mx-2 md:mx-0 justify-center items-center w-2/3 md:w-3/3 h-full'>
            <input className='border-2 border-gray-300 w-2/3 p-1 pl-2 rounded-l focus:outline-none' type="text" placeholder='Search here..'/>
            <button className='border-2 cursor-pointer border-gray-700 px-2 md:px-4 p-1 rounded-r bg-gray-700 text-white font-mono'>Search</button>
        </div>

    </>
  )
}

export default Search_sction
