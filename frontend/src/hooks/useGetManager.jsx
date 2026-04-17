import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setManager } from "../redux/userSlice";

function useGetManagers(page, search) {
  const dispatch = useDispatch();

  useEffect(() => {
    const delay = setTimeout(() => {
      const fetchManagers = async () => {
        try {
          dispatch(setManager([])); // ✅ clear old managers

          const url = search
            ? `${serverUrl}/api/user/get-manager?page=${page}&limit=5&search=${search}`
            : `${serverUrl}/api/user/get-manager?page=${page}&limit=5`;

          const res = await axios.get(url, {
            withCredentials: true,
          });

          dispatch(setManager(res.data.users));

        } catch (error) {
          console.log(error);
        }
      };

      fetchManagers();
    }, 400); // ✅ same debounce as users

    return () => clearTimeout(delay);
  }, [page, search, dispatch]);
}

export default useGetManagers;