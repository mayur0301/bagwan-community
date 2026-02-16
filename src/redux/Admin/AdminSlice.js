import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "./AdminApi";

const initialState = {
  name: "",
  email: "",
  phone: "",
  id: "",
  token: "",
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      console.log(action.payload)
      state.name = action.payload?.admin?.Name || "";
      state.email = action.payload?.admin?.Email || "";
      state.phone = action.payload?.admin?.Phone || "";
      state.id = action.payload?.admin?._id || "";
      state.token = action.payload?.admin?.token || "";
    },
    logoutAdmin: () => initialState,
  },
  extraReducers: (builder) => {
    if (apiSlice?.endpoints?.loginAdmin) {
      builder.addMatcher(
        apiSlice.endpoints.loginAdmin.matchFulfilled,
        (state, action) => {
          state.name = action.payload?.user?.name || "";
          state.email = action.payload?.user?.email || "";
          state.token = action.payload?.token || "";
        }
      );
    }
  },
});

export const { setAdmin, logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;
