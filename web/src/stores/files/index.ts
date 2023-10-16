import { EFilesActions } from './files-contants';
import * as asyncActions from './files-actions';
import slice from './files-slice';

export { EFilesActions };
export const { name, reducer } = slice;
export const {
  getListFiles,
  createFolder,
  getListFileByFolder,
  uploadFileManagement,
  deleteFileManagement,
  downloadFileManagementAction,
} = asyncActions;
