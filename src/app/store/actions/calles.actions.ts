import { Action } from '@ngrx/store';
import { Calle, Direccion } from '../../models/index.models';

export const CARGAR_NUEVA_CALLE = 'CARGAR_NUEVA_CALLE';
//export const CARGAR_CALLES = 'CARGAR_CALLES';
export const CARGAR_CALLES_EFFECTS = 'CARGAR_CALLES_EFFECTS';
export const CARGAR_CALLES_EFFECTS_SUCCESS = 'CARGAR_CALLES_EFFECTS_SUCCESS';
export const MODIFICAR_CALLE = 'MODIFICAR_CALLE';
export const MODIFICAR_VARIAS_CALLES = 'MODIFICAR_VARIAS_CALLES';
export const CARGAR_CALLES_EFFECTS_FAIL = 'CARGAR_CALLES_EFFECTS_FAIL';
export const CARGAR_NUEVA_CALLE_EFFECTS_SUCCESS = 'CARGAR_NUEVA_CALLE_EFFECTS_SUCCESS';
export const CARGAR_NUEVA_CALLE_EFFECTS_FAIL = 'CARGAR_NUEVA_CALLE_EFFECTS_FAIL';
export const ACTUALIZAR_VISTA_MAPA = 'ACTUALIZAR_VISTA_MAPA';

//export const CLICK_MAPA = 'CLICK_MAPA';


/*
export class CargarCalles implements Action {
    readonly type = CARGAR_CALLES;
  //  constructor(public calles: Calle[]) { }
}
*/
/****************************************************************************/
export class CargarCallejeroEffects implements Action {
    readonly type = CARGAR_CALLES_EFFECTS;
    constructor(public direccion: any) {
        //console.log('CargarCallejeroEffects', direccion);
    }
}

export class CargarCallesEffectsSuccess implements Action {
    readonly type = CARGAR_CALLES_EFFECTS_SUCCESS;

    constructor(public calles: Calle[]) {
    }
}

export class CargarCallesFail implements Action {
    readonly type = CARGAR_CALLES_EFFECTS_FAIL;

    constructor(public payload: any) {
    }
}



/****************************************************************************/

export class CargarNuevoCalle implements Action {
    readonly type = CARGAR_NUEVA_CALLE;
    constructor(public direccion: Direccion) { }
}

export class ModificarCalle implements Action {
    readonly type = MODIFICAR_CALLE;
    constructor(public calle: Calle) { }
}

export class ModificarVariasCalles implements Action {
    readonly type = MODIFICAR_VARIAS_CALLES;
    constructor(public calles: Calle[]) { }
}




export class CargarNuevaCalleSuccess implements Action {
    readonly type = CARGAR_NUEVA_CALLE_EFFECTS_SUCCESS;
    constructor(public calle: any) { }
}

export class CargarNuevaCalleFail implements Action {
    readonly type = CARGAR_NUEVA_CALLE_EFFECTS_FAIL;
    constructor(public calle: any) { }
}

export class ActualizarVistaMapa implements Action {
    readonly type = ACTUALIZAR_VISTA_MAPA;
    constructor(public dato: any) { }
}



export type calleActions = CargarCallejeroEffects | CargarCallesEffectsSuccess | CargarCallesFail | CargarNuevoCalle | ModificarCalle | ModificarVariasCalles | CargarNuevaCalleSuccess | CargarNuevaCalleFail | ActualizarVistaMapa;
