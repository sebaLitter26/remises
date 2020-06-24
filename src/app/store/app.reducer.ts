import { ActionReducerMap } from '@ngrx/store';

import * as reducers from './reducers';

export interface AppState {
    viaje: reducers.ViajeState;
    movil: reducers.MovilState;
    //calle: reducers.CalleState;
    usuario: reducers.UsuarioState;
    //Administracion
    /*
    datos: reducers.DatosState;
    columnas: reducers.ColumnasState;
    columnas_relacionales: reducers.ColumnasRelacionalesState;
    modificacion: reducers.ModificacionState;
    */
}

export const appReducers: ActionReducerMap<AppState> = {
    viaje: reducers.viajeReducer,
    movil: reducers.movilReducer,
    //calle: reducers.calleReducer,
    usuario: reducers.usuarioReducer,
    //administracion
    /*
    datos: reducers.reducer,
    columnas: reducers.reducer,
    columnas_relacionales: reducers.reducer,
    modificacion: reducers.reducer,
    */
};
