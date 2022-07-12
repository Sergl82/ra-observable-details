import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
  map,
  tap,
  filter,
  switchMap,
  mergeMap,
  catchError,
} from 'rxjs/operators';
import {
  FETCH_SERVICES_REQUEST,
  REMOVE_SERVICE,
  EDIT_SERVICES_REQUEST,
  ADD_SERVICES_REQUEST,
  ADD_SERVICES_SUCCESS,
} from '../actions/actionTypes';
import {
  fetchServicesSuccess,
  fetchServicesFailed,
  fetchServicesRequest,
  editServicesSuccess,
  editServicesFailed,
  addServicesSuccess,
  addServicesFailed,
} from '../actions/actionCreators';

export const getServicesEpic = (action$, _state$) =>
  action$.pipe(
    ofType(FETCH_SERVICES_REQUEST),
    tap((action) => console.log(action)),
    switchMap(() =>
      ajax.getJSON(`${process.env.REACT_APP_API_URL_BUILD}`).pipe(
        tap((response) => console.log('response posts list:', response)),
        map((response) => fetchServicesSuccess(response)),
        catchError((e) =>
          of(fetchServicesFailed(`Произошла ошибка! ${e.name}: ${e.message}`))
        )
      )
    )
  );

export const removeServiceEpic = (action$, _state$) =>
  action$.pipe(
    ofType(REMOVE_SERVICE),
    tap((action) => console.log(action)),
    map((action) => action.payload.id),
    mergeMap((id) =>
      ajax({
        url: `${process.env.REACT_APP_API_URL_BUILD}/${id}`,
        method: 'DELETE',
      }).pipe(
        tap((response) => console.log('response post deleted:', response)),
        map(fetchServicesRequest),
        catchError((e) =>
          of(fetchServicesFailed(`Произошла ошибка! ${e.name}: ${e.message}`))
        )
      )
    )
  );

export const addServiceSuccessEpic = (action$, state$) =>
  action$.pipe(
    ofType(ADD_SERVICES_SUCCESS),
    tap((action) => console.log(action)),
    map(fetchServicesRequest),
    tap((response) => console.log('response posts list:', response)),
    catchError((e) =>
      of(addServicesFailed(`Произошла ошибка! ${e.name}: ${e.message}`))
    )
  );

export const addServiceEpic = (action$, state$) =>
  action$.pipe(
    ofType(ADD_SERVICES_REQUEST),
    tap((action) => console.log(action)),
    tap(() => console.log('state$_add_item: ', state$.value.serviceAdd.item)),
    mergeMap(() =>
      ajax({
        url: `${process.env.REACT_APP_API_URL_BUILD}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'rxjs-custom-header': 'Rxjs',
        },
        body: {
          id: 0,
          name: state$.value.serviceAdd.item.name,
          price: state$.value.serviceAdd.item.price,
        },
      }).pipe(
        tap((response) => console.log('response post added', response)),
        map(addServicesSuccess),
        catchError((e) =>
          of(addServicesFailed(`Произошла ошибка! ${e.name}: ${e.message}`))
        )
      )
    )
  );

export const getServiceDetailsEpic = (action$, _state$) =>
  action$.pipe(
    ofType(EDIT_SERVICES_REQUEST),
    tap((action) => console.log(action)),
    map((action) => action.payload.id),
    filter((id) => id),
    switchMap((id) =>
      ajax.getJSON(`${process.env.REACT_APP_API_URL_BUILD}/${id}`).pipe(
        tap((response) => console.log('response post get details: ', response)),
        map((response) => editServicesSuccess(response)),
        catchError((e) =>
          of(editServicesFailed(`Произошла ошибка! ${e.name}: ${e.message}`))
        )
      )
    )
  );

export const editServiceEpic = (action$, state$) =>
  action$.pipe(
    ofType(EDIT_SERVICES_REQUEST),
    tap((action) => console.log(action)),
    tap(() => console.log('state$_edit_item:', state$.value.serviceEdit.item)),
    map((action) => action.payload.id),
    filter((id) => !id),
    switchMap(() =>
      ajax({
        url: `${process.env.REACT_APP_API_URL_BUILD}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'rxjs-custom-header': 'Rxjs',
        },
        body: {
          id: state$.value.serviceEdit.item.id,
          name: state$.value.serviceEdit.item.name,
          price: state$.value.serviceEdit.item.price,
          content: state$.value.serviceEdit.item.content,
        },
      }).pipe(
        tap((response) => console.log('response post edited', response)),
        map(editServicesSuccess),
        catchError((e) =>
          of(editServicesFailed(`Произошла ошибка! ${e.name}: ${e.message}`))
        )
      )
    )
  );
