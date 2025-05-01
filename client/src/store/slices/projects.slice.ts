import { TLoginSchema } from "@/@schemes/auth.schema";
import { TProject } from "@/@types/TProject";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getProjectsThunk = createAsyncThunk(
  "projects/getAll",
  async (loginPayload: TLoginSchema, { rejectWithValue }) => {
    // const response = await loginApi(loginPayload);
    // if (response instanceof AxiosError) {
    //   return rejectWithValue(response.response!.data);
    // }
    // return response.data;
  }
);

type TInitialState = {
  projects: TProject[];
  error: string[];
};

const initialState: TInitialState = {
  projects: [],
  error: [],
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProjectsThunk.fulfilled, (state, action) => {
        // state.token = action.payload.token;
        // state.user = action.payload.user;
        // state.error = [];
      })
      .addCase(getProjectsThunk.rejected, (state, action) => {
        // const error = action.payload as {
        //   message: string | string[];
        //   statusCode: number;
        // };
        // if (Array.isArray(error.message)) state.error = error.message;
        // else if (!state.error.includes(error.message)) {
        //   state.error.push(error.message);
        // }
      });
  },
});

export const {} = projectsSlice.actions;

export default projectsSlice.reducer;
