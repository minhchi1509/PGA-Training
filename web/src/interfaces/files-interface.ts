import { FileMode, FileType } from 'src/variables/enum-variables';
import { TCommonGetListParams, TCommonGetListResponse } from './common-interface';
import { UploadFile as TUploadFile } from 'antd/es/upload';
import { type } from 'os';

export type TGetListFileParams = {
  mode: FileMode;
  folderId?: string;
  filter: TCommonGetListParams;
};

export type TGetListFilesResponse = TCommonGetListResponse<TFile[]>;

export type TFile = {
  id: string;
  name: string;
  type: FileType;
  mode: FileMode;
  fileExt: string;
  size?: number;
  createdAt?: Date;
  description?: string;
  url?: string;
  originalname: string;
};

export type TNewFolderRequest = {
  name: string;
  mode: FileMode;
  folderId?: string;
};

export type TUploadFileManagementRequest = {
  name: string;
  description?: string;
  folderId?: string;
  mode: FileMode;
  file: { file: TUploadFile };
};

export type TDownloadFileManagementRequest = {
  fileId: string;
  fileName?: string;
  fileExtension?: string;
};

export type TDeleteFileManagementRequest = {
  id: string;
};
