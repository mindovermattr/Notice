import { TApiError } from "@/@types/TApi";
import { TProject } from "@/@types/TProject";
import { createProject, getAllProjects } from "@/api/project.api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const getProjectsThunk = createAsyncThunk(
  "projects/getAll",
  async (_, { rejectWithValue }) => {
    const response = await getAllProjects();
    if (response instanceof AxiosError) {
      return rejectWithValue(response.response!.data);
    }
    return response.data;
  }
);

export const createProjectThunk = createAsyncThunk(
  "projects/create",
  async (name: string, { rejectWithValue }) => {
    const response = await createProject({ name });
    if (response instanceof AxiosError) {
      return rejectWithValue(response.response!.data);
    }
    return response.data;
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

const handleRejected = (
  state: TInitialState,
  action: PayloadAction<TApiError>
) => {
  const error = action.payload;
  if (Array.isArray(error.message)) state.error = error.message;
  else if (!state.error.includes(error.message)) {
    state.error.push(error.message);
  }
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    selectProject: (state, action: PayloadAction<{ id: number }>) => {
      const selectedProject = state.projects.find(
        (el) => el.id === action.payload.id
      );
      if (!selectedProject) return;
      state.selectedProject = selectedProject;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProjectThunk.fulfilled, (state, action) => {
        state.projects.push(action.payload);
        state.error = [];
      })
      .addCase(getProjectsThunk.fulfilled, (state, action) => {
        state.projects = action.payload;
        state.error = [];
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        handleRejected
      );
  },
});

export const { selectProject } = projectsSlice.actions;

export default projectsSlice.reducer;
