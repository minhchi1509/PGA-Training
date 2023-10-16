import clientSlice from './slice';
import * as clientThunkActions from './thunk-actions';

const clientReducer = clientSlice.reducer;
const clientActions = clientSlice.actions;
export { clientReducer, clientActions, clientThunkActions };
