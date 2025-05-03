import { configureStore } from "@reduxjs/toolkit";
import projects from "./slices/projects.slice";
import tasklists from "./slices/tasklists.slice";
import user from "./slices/user.slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user,
      projects,
      tasklists,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
