import { TApiError } from "@/@types/TApi";
import { TSubtask } from "@/@types/TSubtask";
import { TTask } from "@/@types/TTask";
import { TTasklist } from "@/@types/TTasklist";
import {
  createTaskList,
  deleteTaskList,
  getTaskLists,
} from "@/api/tasklist.api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
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

const tasklistSlice = createSlice({
  name: "tasklists",
  initialState,
  reducers: {
    patchPriority: (
      state,
      action: PayloadAction<{ id: number; listId: number; priority: boolean }>
    ) => {
      const listIndex = state.tasklists.findIndex(
        (el) => el.id === action.payload.listId
      );
      const taskIndex = state.tasklists[listIndex].tasks.findIndex(
        (el) => el.id === action.payload.id
      );

      state.tasklists[listIndex].tasks[taskIndex].priority =
        action.payload.priority;
    },
    patchTaskStore: (
      state,
      action: PayloadAction<{ listId: number; task: Partial<TTask> }>
    ) => {
      const listIndex = state.tasklists.findIndex(
        (el) => el.id === action.payload.listId
      );
      const taskIndex = state.tasklists[listIndex].tasks.findIndex(
        (el) => el.id === action.payload.task.id
      );

      const prevTask = state.tasklists[listIndex].tasks[taskIndex];

      state.tasklists[listIndex].tasks[taskIndex] = {
        ...prevTask,
        ...action.payload.task,
      };
    },
    addSubTask: (
      state,
      action: PayloadAction<{
        listId: number;
        taskId: number;
        subtask: TSubtask;
      }>
    ) => {
      const listIndex = state.tasklists.findIndex(
        (el) => el.id === action.payload.listId
      );
      const taskIndex = state.tasklists[listIndex].tasks.findIndex(
        (el) => el.id === action.payload.taskId
      );

      state.tasklists[listIndex].tasks[taskIndex].subtasks.push(
        action.payload.subtask
      );
    },
    deleteSubtask: (
      state,
      action: PayloadAction<{
        listId: number;
        taskId: number;
        subtask: TSubtask;
      }>
    ) => {
      const listIndex = state.tasklists.findIndex(
        (el) => el.id === action.payload.listId
      );
      const taskIndex = state.tasklists[listIndex].tasks.findIndex(
        (el) => el.id === action.payload.taskId
      );
      const subtaskIndex = state.tasklists[listIndex].tasks[
        taskIndex
      ].subtasks.findIndex((el) => el.id === action.payload.subtask.id);

      state.tasklists[listIndex].tasks[taskIndex].subtasks.splice(
        subtaskIndex,
        1
      );
    },
    patchSubtask: (
      state,
      action: PayloadAction<{
        listId: number;
        taskId: number;
        subtask: TSubtask;
      }>
    ) => {
      const listIndex = state.tasklists.findIndex(
        (el) => el.id === action.payload.listId
      );
      const taskIndex = state.tasklists[listIndex].tasks.findIndex(
        (el) => el.id === action.payload.taskId
      );
      const subtaskIndex = state.tasklists[listIndex].tasks[
        taskIndex
      ].subtasks.findIndex((el) => el.id === action.payload.subtask.id);

      const prevSubtask =
        state.tasklists[listIndex].tasks[taskIndex].subtasks[subtaskIndex];

      state.tasklists[listIndex].tasks[taskIndex].subtasks[subtaskIndex] = {
        ...prevSubtask,
        ...action.payload.subtask,
      };
    },
    removeTask: (
      state,
      action: PayloadAction<{ listId: number; taskId: number }>
    ) => {
      const listIndex = state.tasklists.findIndex(
        (el) => el.id === action.payload.listId
      );
      const taskIndex = state.tasklists[listIndex].tasks.findIndex(
        (el) => el.id === action.payload.taskId
      );
      state.tasklists[listIndex].tasks.splice(taskIndex, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasklistsThunk.fulfilled, (state, action) => {
        state.tasklists = action.payload;
        state.error = [];
      })
      .addCase(createTasklistThunk.fulfilled, (state, action) => {
        state.tasklists.push(action.payload);
        state.error = [];
      })
      .addCase(deleteTasklistThunk.fulfilled, (state, action) => {
        const index = state.tasklists.findIndex(
          (el) => el.id === action.payload.id
        );
        state.tasklists.splice(index, 1);
        state.error = [];
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        handleRejected
      );
  },
});

export const {
  patchPriority,
  patchTaskStore,
  addSubTask,
  deleteSubtask,
  patchSubtask,
  removeTask,
} = tasklistSlice.actions;

export default tasklistSlice.reducer;
