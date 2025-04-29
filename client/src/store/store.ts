import { configureStore } from "@reduxjs/toolkit";
import user from "./slices/user.slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
