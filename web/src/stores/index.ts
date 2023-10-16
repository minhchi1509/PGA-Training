import { AnyAction, configureStore, ThunkDispatch } from '@reduxjs/toolkit';
import { createMemoryHistory } from 'history';
import { useDispatch } from 'react-redux';
import { createReduxHistoryContext } from 'redux-first-history';
import thunk from 'redux-thunk';

import rootReducer from './reducers';

const { createReduxHistory, routerMiddleware } = createReduxHistoryContext({
  history: createMemoryHistory(),
});

const middleware = [routerMiddleware, thunk];

const store = configureStore({
  reducer: rootReducer,
  middleware,
});

export const history = createReduxHistory(store);

export type TRootState = ReturnType<typeof store.getState>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppThunkDispatch = ThunkDispatch<TRootState, any, AnyAction>;

export const useAppDispatch: () => AppThunkDispatch = useDispatch;

export default store;
