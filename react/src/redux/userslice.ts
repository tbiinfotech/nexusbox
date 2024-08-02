import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: [{}],
    isAuthenticated: false,
  },
  reducers: {
    addUser: (state, action) => {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
    },
    removeUser: (state) => {
      state.userInfo = [];
      state.isAuthenticated = false;
    },
    updateCheckList: (state, action) => {
      state.userInfo.checklist = action.payload
    },

  },
});

export const { addUser, removeUser,updateCheckList } = userSlice.actions;

export default userSlice.reducer;
