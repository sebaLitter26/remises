import { Action } from '@ngrx/store';

//export const CAMBIAR_GRILLA_EFFECTS = 'CAMBIAR_GRILLA_EFFECTS';


export enum ModificacionActionTypes {
    MODIFICACION_FACTURACION = 'MODIFICACION_FACTURACION',
    MODIFICACION_CLIENTES_SERVICIOS = 'MODIFICACION_CLIENTES_SERVICIOS',
    MODIFICACION_EMPRESAS = 'MODIFICACION_EMPRESAS',
    MODIFICACION_DIVISIONTERRITORIAL = 'MODIFICACION_DIVISIONTERRITORIAL',
    MODIFICACION_CLIENTES = 'MODIFICACION_CLIENTES',
    MODIFICACION_FICHAS = 'MODIFICACION_FICHAS',
    MODIFICACION_SERVICIOS = 'MODIFICACION_SERVICIOS',
    MODIFICACION_MOVILES = 'MODIFICACION_MOVILES',

    CAMBIAR_GRILLA_EFFECTS = 'CAMBIAR_GRILLA_EFFECTS',
    FILTRAR_GRILLA_EFFECTS = 'FILTRAR_GRILLA_EFFECTS',
    CAMBIAR_GRILLA_FAIL = 'CAMBIAR_GRILLA_FAIL',
}


export class CambiarGrillaEffects implements Action {
    readonly type = ModificacionActionTypes.CAMBIAR_GRILLA_EFFECTS;
    constructor(public datos: any) { }
}

export class FiltrarGrillaEffects implements Action {
    readonly type = ModificacionActionTypes.FILTRAR_GRILLA_EFFECTS;
    constructor(public datos: any) { }
}

export class CambiarGrillaFail implements Action {
    readonly type = ModificacionActionTypes.CAMBIAR_GRILLA_FAIL;

    constructor(public payload: any) { }
}

export class ModifFacturacionAction implements Action {
    readonly type = ModificacionActionTypes.MODIFICACION_FACTURACION;
    constructor(public datos: any) { }
}
export class ModifClientesServiciosAction implements Action {
    readonly type = ModificacionActionTypes.MODIFICACION_CLIENTES_SERVICIOS;
    constructor(public datos: any) { }
}
export class ModifEmpresasAction implements Action {
    readonly type = ModificacionActionTypes.MODIFICACION_EMPRESAS;
    constructor(public datos: any) { }
}
export class ModifDivisionTerritorialAction implements Action {
    readonly type = ModificacionActionTypes.MODIFICACION_DIVISIONTERRITORIAL;
    constructor(public datos: any) { }
}
export class ModifClientesAction implements Action {
    readonly type = ModificacionActionTypes.MODIFICACION_CLIENTES;
    constructor(public datos: any) {
        console.log('---ModifClientesAction',datos);
    }
}
export class ModifFichasAction implements Action {
    readonly type = ModificacionActionTypes.MODIFICACION_FICHAS;
    constructor(public datos: any) { }
}
export class ModifServiciosAction implements Action {
    readonly type = ModificacionActionTypes.MODIFICACION_SERVICIOS;
    constructor(public datos: any) { }
}
export class ModifMovilesAction implements Action {
    readonly type = ModificacionActionTypes.MODIFICACION_MOVILES;
    constructor(public datos: any) { }
}

export type ModificacionActions = CambiarGrillaEffects | FiltrarGrillaEffects | CambiarGrillaFail | ModifFacturacionAction | ModifClientesServiciosAction |
    ModifEmpresasAction | ModifDivisionTerritorialAction | ModifClientesAction |
    ModifFichasAction | ModifServiciosAction | ModifMovilesAction ;


 /*
 export const MODIFICACION_FACTURACION ='MODIFICACION_FACTURACION';
 export const MODIFICACION_CLIENTES_SERVICIOS = 'MODIFICACION_CLIENTES_SERVICIOS';
 export const MODIFICACION_EMPRESAS = 'MODIFICACION_EMPRESAS';
 export const MODIFICACION_DIVISIONTERRITORIAL = 'MODIFICACION_DIVISIONTERRITORIAL';
 export const MODIFICACION_CLIENTES = 'MODIFICACION_CLIENTES';
 export const MODIFICACION_FICHAS = 'MODIFICACION_FICHAS';
 export const MODIFICACION_SERVICIOS = 'MODIFICACION_SERVICIOS';
 export const MODIFICACION_MOVILES = 'MODIFICACION_MOVILES';
 */
 /*
 export const MODIFICACION_NGRX= '[Modificacion] Modificar Tablas';
 export class ModificacionAction implements Action{
   readonly type = MODIFICACION_NGRX;
 }
 */
