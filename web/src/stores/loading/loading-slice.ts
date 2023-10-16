import { AnyAction, createSlice } from '@reduxjs/toolkit';

const initialState: { [key: string]: boolean } = {};

export default createSlice({
  name: 'loading',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: AnyAction) => action.type.includes('/pending'),
      (state, action: AnyAction) => {
        state[action.type.split('/pending')[0]] = true;
      },
    );
    builder.addMatcher(
      (action: AnyAction) => action.type.includes('/fulfilled'),
      (state, action: AnyAction) => {
        state[action.type.split('/fulfilled')[0]] = false;
      },
    );
    builder.addMatcher(
      (action: AnyAction) => action.type.includes('/rejected'),
      (state, action: AnyAction) => {
        state[action.type.split('/rejected')[0]] = false;
      },
    );
  },
});
