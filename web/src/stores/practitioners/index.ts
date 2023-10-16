import { EPractitionersAction } from './practitioners-constants';
import * as asyncActions from './practitioners-actions';
import slice from './practitioners-slice';

export { EPractitionersAction };
export const { name, reducer } = slice;
export const {
  getPractitioners,
  invitePractitioner,
  getOwnerSummaryAssignTask,
  getPractitionerSummaryAssignTask,
  getPractitionerClientLoginRate,
  getTaskCompletionTask,
} = asyncActions;
