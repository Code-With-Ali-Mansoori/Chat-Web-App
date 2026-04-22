import useSearch from "../Hooks/SearchContext.hook";

const Loader = () => {

  const { load } = useSearch(); //accesing this in entire app - Context

  return (
    <div className={`"w-full ${load ? "flex" : "hidden"} justify-center items-center"`}>
       <div className="loader absolute bottom-74 md:bottom-90">
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
            <div className="bar4"></div>
            <div className="bar5"></div>
            <div className="bar6"></div>
            <div className="bar7"></div>
            <div className="bar8"></div>
            <div className="bar9"></div>
            <div className="bar10"></div>
            <div className="bar11"></div>
            <div className="bar12"></div>
        </div>
    </div>
  )
}

export default Loader;
