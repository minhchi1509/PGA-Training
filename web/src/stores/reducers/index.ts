import { createMemoryHistory } from 'history';
import { combineReducers } from 'redux';
import { createReduxHistoryContext } from 'redux-first-history';

import { profileReducer } from '../profile';
import { loadingReducer } from '../loading';
import { errorReducer } from '../error';
import { userReducer } from '../user';
import { reducer as practitionersReducer } from '../practitioners';
import { reducer as clientsReducer } from '../clients';
import { reducer as homeworkTopicsReducer } from '../homework-topics';
import { reducer as chatReducers } from '../chat';
import { reducer as psychoeducationReducers } from '../psychoeducation';

const { routerReducer } = createReduxHistoryContext({
  history: createMemoryHistory(),
});

const rootReducer = combineReducers({
  router: routerReducer,
  loading: loadingReducer,
  error: errorReducer,
  user: userReducer,
  practitioners: practitionersReducer,
  profile: profileReducer,
  clients: clientsReducer,
  homeworkTopics: homeworkTopicsReducer,
  chat: chatReducers,
  psychoeducation: psychoeducationReducers,
});

export default rootReducer;
