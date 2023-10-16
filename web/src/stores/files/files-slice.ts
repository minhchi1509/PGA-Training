import { createSlice } from '@reduxjs/toolkit';
import * as asyncActions from './files-actions';
import { TGetListFilesResponse } from 'src/interfaces/files-interface';

type TPractitionersState = {
  listFile?: TGetListFilesResponse;
};

const initialState: TPractitionersState = {
  listFile: undefined,
};

export const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(asyncActions.getListFiles.fulfilled, (state, action) => {
      state.listFile = action.payload as TGetListFilesResponse;
    });
  },
});

export default filesSlice;
