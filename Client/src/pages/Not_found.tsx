import pageNotFound from '../utils/pageNotFound.png';

const PageNotFound = () => {
  return (
    <div className="w-full h-full py-1 px-4 md:p-10 bg-gray-50">
      <div className="relative  border border-gray-200 w-full h-full bg-white rounded-3xl  overflow-hidden flex items-center">
        
        {/* Soft background shapes */}
       <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-32 top-0 md:w-[400px] md:h-[400px] w-[200px] h-[200px] bg-[#f1ebe3] rounded-full opacity-70" />
          <div className="absolute right-0 bottom-0 md:w-[300px] md:h-[300px] w-[200px] h-[200px] bg-[#f7f4ef] rounded-full opacity-80" />
       </div> 

        {/* Content */}
        <div className="relative z-10 justify-center items-center flex flex-col w-full md:px-14 px-6">

          {/* Top Illustration */}
          <div className="md:w-1/4 animate-float h-full w-4/4 flex justify-center items-center">
              <img className='w-full h-full' src={pageNotFound} alt="page_not found" />
          </div>
          
          {/* Text */}
          <div className="md:w-2/4 w-2/2 pb-5 flex gap-5 flex-col md:justify-center md:items-start">
              <p className="text-slate-600 text-lg leading-relaxed ">
                  <small className='md:text-2xl font-medium block'> 404 Page not found.</small>
                  <small className='md:text-2xl font-medium block'>This chat link is broken or expired.</small>
                  <small className='md:text-2xl font-medium block'>Go back to continue chatting.</small>
              </p>
              <button onClick={() => window.history.back()} className='bg-black text-white px-5 hover:cursor-pointer py-3 rounded-2xl w-fit'> Go back </button>
          </div>
 
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;



{/* <button onClick={() => window.history.back()} className="mt-8 w-fit rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800 transition"> Go back </button>

<div className="w-1/2 hidden md:flex justify-center items-center">
  <img src={pageNotFound} alt="page_not found" />
</div> */}

