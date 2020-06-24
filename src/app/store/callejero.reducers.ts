import { ActionReducerMap } from '@ngrx/store';
import { createFeatureSelector, createSelector } from "@ngrx/store";

//import * as fromRouter from '@ngrx/router-store';
/*
import * as datos from './reducers/callejero.reducers/datos.reducer';
import * as columnas from './reducers/callejero.reducers/columnas.reducer';
import * as columnas_relacionales from './reducers/callejero.reducers/columnas_relacionales.reducer';
import * as fromModificacion from './reducers/callejero.reducers/modificacion.reducer';
*/
import * as callejero_reducers from './reducers/calles.reducer';

export interface CallejeroState {
    callejero: callejero_reducers.CalleState;
    //router: fromRouter.RouterReducerState<RouterStateUrl>;
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */

export const CallejeroReducers: ActionReducerMap<CallejeroState> = {
    callejero: callejero_reducers.calleReducer,
    //    router: fromRouter.routerReducer,
};

//export const selectCallejeroState = createFeatureSelector<CallejeroState>('callejero');

//export const callejeroState = createSelector(selectCallejeroState, (state: CallejeroState) => state.callejero);
