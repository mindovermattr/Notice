import { TLoginSchema, TRegistrationSchema } from "@/@schemes/auth.schema";
import {
  login as loginApi,
  registration as registrationApi,
} from "@/api/auth.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const loginThunk = createAsyncThunk(
  "users/login",
  async (loginPayload: TLoginSchema, { rejectWithValue }) => {
    const response = await loginApi(loginPayload);
    if (response instanceof AxiosError) {
      return rejectWithValue(response.response!.data);
    }
    return response.data;
  }
);

export const registrationThunk = createAsyncThunk(
  "users/registration",
  async (registrationPayload: TRegistrationSchema, { rejectWithValue }) => {
    const response = await registrationApi(registrationPayload);
    if (response instanceof AxiosError) {
      return rejectWithValue(response.response!.data);
    }
    return response.data;
  }
);

type TInitialState = {
  user: TUser | null;
  token: string | null;
  error: string[];
};

const initialState: TInitialState = {
  user: null,
  token: null,
  error: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = [];
      })
      .addCase(loginThunk.rejected, (state, action) => {
        const error = action.payload as {
          message: string | string[];
          statusCode: number;
        };
        if (Array.isArray(error.message)) state.error = error.message;
        else state.error.push(error.message);
      })
      .addCase(registrationThunk.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = [];
      })
      .addCase(registrationThunk.rejected, (state, action) => {
        const error = action.payload as {
          message: string | string[];
          statusCode: number;
        };
        if (Array.isArray(error.message)) state.error = error.message;
        else state.error.push(error.message);
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
