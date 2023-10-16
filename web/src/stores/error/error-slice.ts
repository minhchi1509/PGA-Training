import { AnyAction, createSlice, isRejected } from '@reduxjs/toolkit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initialState: { [key: string]: any } = {};

export default createSlice({
  name: 'error',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(isRejected, (state, action: AnyAction) => {
      state[action.type.split('/fulfilled')[0]] = action.payload;
      // state[action.type.split('/pending')[0]] = true;
    });
  },
});
