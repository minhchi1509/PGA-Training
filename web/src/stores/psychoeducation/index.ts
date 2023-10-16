import { EPsychoeducationActions } from './constants';
import * as asyncActions from './actions';
import slice from './slice';

export { EPsychoeducationActions };
export const {
  reducer,
  actions: { resetPsychoeducationDetails },
} = slice;
export const { getPsychoeducationTopicsAction, getPsychoeducationListByTopicAction, getDetailsPsychoeducationAction } =
  asyncActions;
