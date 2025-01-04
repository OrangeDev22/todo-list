import { createSlice } from "@reduxjs/toolkit";

export interface User {
  email: string;
  username: string;
  token: string;
}

interface UserType {
  username: string;
  email: string;
}
const initialState: UserType | null = null;

export const userSlice = createSlice({
  name: "user",
  initialState: initialState as UserType | null,
  reducers: {
    setUser: (state, action) => action.payload,
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
