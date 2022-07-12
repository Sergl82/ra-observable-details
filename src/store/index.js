import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import serviceListReducer from '../reducers/serviceList';
import serviceAddReducer from '../reducers/serviceAdd';
import serviceEditReducer from '../reducers/serviceEdit';
import serviceFilterReducer from '../reducers/serviceFilter';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import {
  addServiceEpic,
  editServiceEpic,
  getServiceDetailsEpic,
  getServicesEpic,
  removeServiceEpic,
  addServiceSuccessEpic,
} from '../epics';

const reducer = combineReducers({
  serviceList: serviceListReducer,
  serviceAdd: serviceAddReducer,
  serviceEdit: serviceEditReducer,
  serviceFilter: serviceFilterReducer,
});
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const epic = combineEpics(
  getServicesEpic,
  removeServiceEpic,
  getServiceDetailsEpic,
  addServiceEpic,
  editServiceEpic,
  addServiceSuccessEpic  
);
const epicMiddleware = createEpicMiddleware();
const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(epicMiddleware))
);
epicMiddleware.run(epic);

export default store;
