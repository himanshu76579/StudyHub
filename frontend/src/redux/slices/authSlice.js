import { createSlice } from '@reduxjs/toolkit';

// 🛡️ SAFE LOCAL STORAGE PARSING
let initialUser = null;
try {
  const userString = localStorage.getItem('user');
  if (userString && userString !== 'undefined') {
    initialUser = JSON.parse(userString);
  }
} catch (error) {
  console.error("Local storage error:", error);
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser,
  },
  reducers: {
    // 👇 Ye naya function add kar diya hai jisko Login page dhoondh raha tha
    loginSuccess: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload)); // LocalStorage me bhi save karega
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    }
  },
});

// 👇 Yahan loginSuccess ko bhi export kar diya taaki Login.jsx usko use kar sake
export const { loginSuccess, logout } = authSlice.actions; 
export default authSlice.reducer;