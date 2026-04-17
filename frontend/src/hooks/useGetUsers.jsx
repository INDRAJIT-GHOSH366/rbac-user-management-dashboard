import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUser, setTotalPages, setLoading } from "../redux/userSlice";

function useGetUsers(page, search) {
  const dispatch = useDispatch();

  useEffect(() => {
    const delay = setTimeout(() => {
      const fetchUsers = async () => {
        try {
          dispatch(setLoading(true));
          dispatch(setUser([]));
          const url = search
            ? `${serverUrl}/api/user/get-user?page=${page}&limit=5&search=${search}`
            : `${serverUrl}/api/user/get-user?page=${page}&limit=5`;

          const res = await axios.get(url, { withCredentials: true });

          dispatch(setUser(res.data.users));
          dispatch(setTotalPages(res.data.totalPages));
        } catch (error) {
          console.log(error);
        } finally {
          dispatch(setLoading(false)); // ✅ always stop loading
        }
      };

      fetchUsers();
    }, 400); // debounce

    return () => clearTimeout(delay);
  }, [page, search, dispatch]);
}

export default useGetUsers;
