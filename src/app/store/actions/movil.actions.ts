import { Action } from '@ngrx/store';
import { Movil } from '../../models/index.models';


export const CARGAR_MOVILES = '[Moviles] Cargar Moviles';
export const CARGAR_MOVILES_SUCCESS = '[Moviles] Cargar Moviles SUCCESS';
export const CARGAR_MOVILES_FAIL = '[Moviles] Cargar Moviles FAIL';

export class CargarMoviles implements Action {
    readonly type = CARGAR_MOVILES;
    //constructor(public moviles: Movil[]) { }
}


export class CargarMovilesFail implements Action {
    readonly type = CARGAR_MOVILES_FAIL;

    constructor(public payload: any) { }
}

export class CargarMovilesSuccess implements Action {
    readonly type = CARGAR_MOVILES_SUCCESS;

    constructor(public moviles: Movil[]) { }
}


export type movilActions = CargarMoviles | CargarMovilesFail | CargarMovilesSuccess;
