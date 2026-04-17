import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    manager:[],
    user:[],
    search:"",
    totalPages: 1,
    loading: false,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
     setUser:(state,action)=>{
          state.user=action.payload;
        },
     setManager:(state,action)=>{
          state.manager=action.payload;
        },
        setSearch: (state, action) => {
  state.search = action.payload;
},
setTotalPages: (state, action) => {
  state.totalPages = action.payload;
},
setLoading: (state, action) => {
  state.loading = action.payload;
}
  },
});
export const {
  setUserData,setUser,setManager,setSearch,setTotalPages,setLoading
} = userSlice.actions;
export default userSlice.reducer;
