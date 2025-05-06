import { TTasklist } from "@/@types/TTasklist";
import {
  createTaskList,
  deleteTaskList,
  getTaskLists,
} from "@/api/tasklist.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const getTasklistsThunk = createAsyncThunk(
  "tasklists/getAll",
  async ({ id }: { id: number }, { rejectWithValue }) => {
    const response = await getTaskLists(id);
    if (response instanceof AxiosError) {
      return rejectWithValue(response.response!.data);
    }
    return response.data;
  }
);

export const createTasklistThunk = createAsyncThunk(
  "tasklists/create",
  async ({ id, title }: { id: number; title: string }, { rejectWithValue }) => {
    const response = await createTaskList(id, title);

    if (response instanceof AxiosError) {
      return rejectWithValue(response.response!.data);
    }

    return response.data;
  }
);

export const deleteTasklistThunk = createAsyncThunk(
  "tasklists/delete",
  async ({ id }: { id: number }, { rejectWithValue }) => {
    const response = await deleteTaskList(id);

    if (response instanceof AxiosError) {
      return rejectWithValue(response.response!.data);
    }

    return response.data;
  }
);

type TInitialState = {
  tasklists: TTasklist[];
  error: string[];
};

const initialState: TInitialState = {
  tasklists: [],
  error: [],
};

const tasklistSlice = createSlice({
  name: "tasklists",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTasklistsThunk.fulfilled, (state, action) => {
        state.tasklists = action.payload;
        state.error = [];
      })
      .addCase(getTasklistsThunk.rejected, (state, action) => {
        const error = action.payload as {
          message: string | string[];
          statusCode: number;
        };
        if (Array.isArray(error.message)) state.error = error.message;
        else if (!state.error.includes(error.message)) {
          state.error.push(error.message);
        }
      })
      .addCase(createTasklistThunk.fulfilled, (state, action) => {
        state.tasklists.push(action.payload);
        state.error = [];
      })
      .addCase(createTasklistThunk.rejected, (state, action) => {
        const error = action.payload as {
          message: string | string[];
          statusCode: number;
        };
        if (Array.isArray(error.message)) state.error = error.message;
        else if (!state.error.includes(error.message)) {
          state.error.push(error.message);
        }
      })
      .addCase(deleteTasklistThunk.fulfilled, (state, action) => {
        const index = state.tasklists.findIndex(
          (el) => el.id === action.payload.id
        );
        state.tasklists.splice(index, 1);
        state.error = [];
      })
      .addCase(deleteTasklistThunk.rejected, (state, action) => {
        const error = action.payload as {
          message: string | string[];
          statusCode: number;
        };
        if (Array.isArray(error.message)) state.error = error.message;
        else if (!state.error.includes(error.message)) {
          state.error.push(error.message);
        }
      });
  },
});

export const {} = tasklistSlice.actions;

export default tasklistSlice.reducer;
