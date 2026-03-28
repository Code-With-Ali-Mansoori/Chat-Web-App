import axios from "axios";

const Search_user_Function = async (search : string) => {
    const res = await axios.get(`http://localhost:5000/users/search?query=${search}`, {withCredentials : true});
    return res.data;
};

export default Search_user_Function;