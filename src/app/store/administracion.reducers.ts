import { ActionReducerMap } from '@ngrx/store';
import { createFeatureSelector, createSelector } from "@ngrx/store";

//import * as fromRouter from '@ngrx/router-store';
/*
import * as datos from './reducers/administracion.reducers/datos.reducer';
import * as columnas from './reducers/administracion.reducers/columnas.reducer';
import * as columnas_relacionales from './reducers/administracion.reducers/columnas_relacionales.reducer';
import * as fromModificacion from './reducers/administracion.reducers/modificacion.reducer';
*/
import * as administracion_reducers from './reducers/administracion.reducers';

export interface AdministracionState {
    datos: administracion_reducers.DatosState;
    columnas: administracion_reducers.ColumnasState;
    columnas_relacionales: administracion_reducers.ColumnasRelacionalesState;
    modificacion: administracion_reducers.DatosState;
    //router: fromRouter.RouterReducerState<RouterStateUrl>;
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */

export const AdministracionReducers: ActionReducerMap<AdministracionState> = {
    datos: administracion_reducers.DatosReducer,
    columnas: administracion_reducers.ColumnasReducer,
    columnas_relacionales: administracion_reducers.ColumnasRelacionalesReducer,
    modificacion: administracion_reducers.DatosReducer,
    //    router: fromRouter.routerReducer,
};

//export const selectAdministracionState = createFeatureSelector<AdministracionState>('administracion');

//export const administracionState = createSelector(selectAdministracionState, (state: AdministracionState) => state.administracion);
