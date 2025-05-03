import { TProject } from "@/@types/TProject";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getTasklistsThunk = createAsyncThunk(
  "tasklist/getAll",
  async (_, { rejectWithValue }) => {
    // const response = await getAllProjects();
    // if (response instanceof AxiosError) {
    //   return rejectWithValue(response.response!.data);
    // }
    // return response.data;
  }
);

type TInitialState = {
  projects: TProject[];
  selectedProject: TProject | null;
  error: string[];
};

const initialState: TInitialState = {
  projects: [],
  selectedProject: null,
  error: [],
};

const tasklistSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTasklistsThunk.fulfilled, (state, action) => {
        // state.projects = action.payload;
        // state.error = [];
      })
      .addCase(getTasklistsThunk.rejected, (state, action) => {
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

export const {} = tasklistSlice.actions;

export default tasklistSlice.reducer;
