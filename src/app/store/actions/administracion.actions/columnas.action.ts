import { Action } from '@ngrx/store';

export enum ColumnasActionTypes {
    COLUMNAS_FACTURACION = 'COLUMNAS_FACTURACION',
    COLUMNAS_CLIENTES_SERVICIOS = 'COLUMNAS_CLIENTES_SERVICIOS',
    COLUMNAS_CLIENTES = 'COLUMNAS_CLIENTES',
    COLUMNAS_EMPRESAS = 'COLUMNAS_EMPRESAS',
    COLUMNAS_PROVINCIAS = 'COLUMNAS_PROVINCIAS',
    COLUMNAS_SERVICIOS = 'COLUMNAS_SERVICIOS',
    COLUMNAS_FICHAS = 'COLUMNAS_FICHAS',
    COLUMNAS_MOVILES = 'COLUMNAS_MOVILES',
}


export class CargaColumnasFacturacion implements Action {
    readonly type = ColumnasActionTypes.COLUMNAS_FACTURACION;
    constructor(public columnas: any) { }
}
export class CargaColumnasClientesServicios implements Action {
    readonly type = ColumnasActionTypes.COLUMNAS_CLIENTES_SERVICIOS;
    constructor(public columnas: any) { }
}
export class CargaColumnasClientes implements Action {
    readonly type = ColumnasActionTypes.COLUMNAS_CLIENTES;
    constructor(public columnas: any) { }
}
export class CargaColumnasEmpresas implements Action {
    readonly type = ColumnasActionTypes.COLUMNAS_EMPRESAS;
    constructor(public columnas: any) { }
}
export class CargaColumnasProvincias implements Action {
    readonly type = ColumnasActionTypes.COLUMNAS_PROVINCIAS;
    constructor(public columnas: any) { }
}
export class CargaColumnasServicios implements Action {
    readonly type = ColumnasActionTypes.COLUMNAS_SERVICIOS;
    constructor(public columnas: any) { }
}
export class CargaColumnasFichas implements Action {
    readonly type = ColumnasActionTypes.COLUMNAS_FICHAS;
    constructor(public columnas: any) { }
}
export class CargaColumnasMoviles implements Action {
    readonly type = ColumnasActionTypes.COLUMNAS_MOVILES;
    constructor(public columnas: any) { }
}


export type ColumnasActions = CargaColumnasFacturacion | CargaColumnasClientes | CargaColumnasClientesServicios |
    CargaColumnasEmpresas | CargaColumnasProvincias | CargaColumnasServicios | CargaColumnasFichas | CargaColumnasMoviles;
