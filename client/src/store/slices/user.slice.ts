import { TLoginSchema, TRegistrationSchema } from "@/@schemes/auth.schema";
import { ERoles } from "@/@types/Enums/ERoles";
import { TApiError } from "@/@types/TApi";
import {
  login as loginApi,
  registration as registrationApi,
  TRespAuth,
} from "@/api/auth.api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
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
  role: ERoles | null;
  error: string[];
};

const initialState: TInitialState = {
  user: null,
  token: null,
  role: null,
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

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.error = [];
      state.role = null;
    },
    setUserWithToken: (state, action: PayloadAction<TRespAuth>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
    },
    setRole: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = [];
      })
      .addCase(registrationThunk.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = [];
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        handleRejected
      );
  },
});

export const { logout, setUser, setUserWithToken } = userSlice.actions;

export default userSlice.reducer;
