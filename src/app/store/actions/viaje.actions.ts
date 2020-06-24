import { Action } from '@ngrx/store';
import { Viaje, Direccion } from '../../models/index.models';

export const CARGAR_NUEVO_VIAJE = 'CARGAR_NUEVO_VIAJE';
//export const CARGAR_VIAJES = 'CARGAR_VIAJES';
export const CARGAR_VIAJES_EFFECTS = 'CARGAR_VIAJES_EFFECTS';
export const CARGAR_VIAJES_EFFECTS_SUCCESS = 'CARGAR_VIAJES_EFFECTS_SUCCESS';
export const MODIFICACION_VIAJE = 'MODIFICACION_VIAJE';
export const CLICK_MAPA = 'CLICK_MAPA';
export const CARGAR_LOCALIDADES = 'CARGAR_LOCALIDADES';

export const REDIMENSION_SIDENAV = 'REDIMENSION_SIDENAV';
/*
export class CargarViajes implements Action {
    readonly type = CARGAR_VIAJES;
  //  constructor(public viajes: Viaje[]) { }
}
*/
/****************************************************************************/
export class CargarViajesEffects implements Action {
    readonly type = CARGAR_VIAJES_EFFECTS;
}

export class CargarViajesEffectsSuccess implements Action {
    readonly type = CARGAR_VIAJES_EFFECTS_SUCCESS;

    constructor(public viajes: Viaje[]) { }
}

/****************************************************************************/

export class CargarNuevoViaje implements Action {
    readonly type = CARGAR_NUEVO_VIAJE;
    constructor(public direccion: Direccion) { }
}

export class ModificarViaje implements Action {
    readonly type = MODIFICACION_VIAJE;
    constructor(public viaje: Viaje) { }
}
export class CargarNuevasCoordenadas implements Action {
    readonly type = CLICK_MAPA;
    constructor(public coordenadas: any) { }
}

export class CargaInicialLocalidades implements Action {
    readonly type = CARGAR_LOCALIDADES;
    constructor(public localidades: any) { }
}

export class AccionSideNav implements Action {
    readonly type = REDIMENSION_SIDENAV;
    constructor(public sidenav: boolean) { }
}

export type viajeActions = CargarViajesEffects | CargarViajesEffectsSuccess | CargarNuevoViaje | ModificarViaje | CargarNuevasCoordenadas | CargaInicialLocalidades | AccionSideNav;
