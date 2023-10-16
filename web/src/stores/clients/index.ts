import { EClientsAction } from './clients-constants';
import * as asyncActions from './clients-actions';
import slice from './clients-slice';

export { EClientsAction };
export const { name, reducer } = slice;
export const {
  getClients,
  inviteClient,
  dischargeClient,
  getAssignedHomeworkListAction,
  loadMoreAssignedHomeworkListAction,
  getTotalAssignedHomeworkAction,
  removeAssignedHomeworkAction,
  getHomeworkHistoryListAction,
  loadMoreHomeworkHistoryListAction,
  getAssignedHomeworkDetailsAction,
  updateHomeworkDetailsAction,
  getAssignedHomeworkHistoriesAction,
  getHomeworkResultAction,
  downloadHomeworkFileAction,
  getClientGeneralInfo,
  updateClientGeneralInfo,
  resendClientInvitation,
  revokeClientInvitation,
  reactivateClient,
  clientUploadFile,
  deleteClientFile,
  downloadClientFileAction,
} = asyncActions;
