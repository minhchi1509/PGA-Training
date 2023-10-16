import { EHomeworkTopicsAction } from './constants';
import * as asyncActions from './actions';
import slice from './slice';

export { EHomeworkTopicsAction };
export const { reducer } = slice;
export const { getHomeworkTopicsAction, loadMoreHomeworkTopicsAction, assignHomeworkAction, getTasksByTopicAction } =
  asyncActions;
