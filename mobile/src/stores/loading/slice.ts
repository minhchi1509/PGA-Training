import { AnyAction, createSlice } from '@reduxjs/toolkit';

const initialState: { [key: string]: boolean } = {};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action: AnyAction) => action.type.includes('/pending'),
        (state, action) => {
          state[action.type.split('/pending')[0]] = true;
        },
      )
      .addMatcher(
        (action: AnyAction) => action.type.includes('/fulfilled'),
        (state, action: AnyAction) => {
          state[action.type.split('/fulfilled')[0]] = false;
        },
      )
      .addMatcher(
        (action: AnyAction) => action.type.includes('/rejected'),
        (state, action: AnyAction) => {
          state[action.type.split('/rejected')[0]] = false;
        },
      );
  },
});

export default loadingSlice;
