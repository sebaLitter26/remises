import { Action } from '@ngrx/store';

export enum ColumnasRelacionalesActionTypes {
    //relaciones
    RELACIONALES_DIVISION_TERRITORIAL = 'RELACIONALES_DIVISION_TERRITORIAL',
    RELACIONALES_EMPRESAS = 'RELACIONALES_EMPRESAS',
    RELACIONALES_CLIENTES = 'RELACIONALES_CLIENTES',
    RELACIONALES_FICHAS = 'RELACIONALES_FICHAS',
    RELACIONALES_SERVICIOS = 'RELACIONALES_SERVICIOS',
    RELACIONALES_MOVILES = 'RELACIONALES_MOVILES',
    RELACIONALES_CLIENTES_SERVICIOS = 'RELACIONALES_CLIENTES_SERVICIOS',
    RELACIONALES_FACTURACION = 'RELACIONALES_FACTURACION',
}

export class CargarRelacionDivicionTerritorialAction implements Action {
    readonly type = ColumnasRelacionalesActionTypes.RELACIONALES_DIVISION_TERRITORIAL;
    constructor(public relacionales: any) { }
}
export class CargarRelacionEmpresasAction implements Action {
    readonly type = ColumnasRelacionalesActionTypes.RELACIONALES_EMPRESAS;
    constructor(public relacionales: any) { }
}
export class CargarRelacionClientesAction implements Action {
    readonly type = ColumnasRelacionalesActionTypes.RELACIONALES_CLIENTES;
    constructor(public relacionales: any) { }
}
export class CargarRelacionFichasAction implements Action {
    readonly type = ColumnasRelacionalesActionTypes.RELACIONALES_FICHAS;
    constructor(public relacionales: any) { }
}
export class CargarRelacionServiciosAction implements Action {
    readonly type = ColumnasRelacionalesActionTypes.RELACIONALES_SERVICIOS;
    constructor(public relacionales: any) { }
}
export class CargarRelacionMovilesAction implements Action {
    readonly type = ColumnasRelacionalesActionTypes.RELACIONALES_MOVILES;
    constructor(public relacionales: any) { }
}
export class CargarRelacionClienteServicioAction implements Action {
    readonly type = ColumnasRelacionalesActionTypes.RELACIONALES_CLIENTES_SERVICIOS;
    constructor(public relacionales: any) { }
}
export class CargarRelacionFacturacionAction implements Action {
    readonly type = ColumnasRelacionalesActionTypes.RELACIONALES_FACTURACION;
    constructor(public relacionales: any) { }
}


export type ColumnasRelacionalesActions = CargarRelacionEmpresasAction | CargarRelacionClientesAction | CargarRelacionFichasAction | CargarRelacionServiciosAction | CargarRelacionMovilesAction | CargarRelacionClienteServicioAction | CargarRelacionFacturacionAction | CargarRelacionDivicionTerritorialAction;
