import { configureStore } from "@reduxjs/toolkit";
import activeSlice from "./Slices/activeSlice";
import userSlice from "./Slices/userSlice";

// eslint-disable-next-line react-refresh/only-export-components
export default configureStore({
  reducer: {
    user: userSlice,
    activeChatSlice: activeSlice,
  },
});
