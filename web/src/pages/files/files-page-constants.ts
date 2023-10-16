import { FileMode } from 'src/variables/enum-variables';

export const FILES_TAB_LABEL = {
  [FileMode.PRIVATE]: 'Private',
  [FileMode.PUBLIC]: 'Public',
};

export enum EFileConfirmModalType {
  UPLOAD = 'UPLOAD',
  NEW_FOLDER = 'NEW_FOLDER',
  DELETE_FOLDER = 'DELETE_FOLDER',
  DELETE_FILE = 'DELETE_FILE',
}
