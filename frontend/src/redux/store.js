import { configureStore } from "@reduxjs/toolkit";
import resourceReducer from "./slices/resourceSlice"; 
import authReducer from "./slices/authSlice"; // 👇 Ye wapas aa gaya

const store = configureStore({
  reducer: {
    resources: resourceReducer, 
    auth: authReducer, // 👇 Auth bhi wapas add kar diya
  },
});

export default store;