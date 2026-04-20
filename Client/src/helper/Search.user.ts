import axios from "axios";

const Search_user_Function = async (search : string) => {
    const res = await axios.get(`https://chatsy-y2s8.onrender.com/users/search?query=${search}`, {withCredentials : true});
    return res.data;
};

export default Search_user_Function;