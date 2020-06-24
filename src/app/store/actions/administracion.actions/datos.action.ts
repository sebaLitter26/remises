import { Action } from '@ngrx/store';

export enum CargaDatosActionTypes {
    DATOS_FACTURACION = 'DATOS_FACTURACION',
    DATOS_CLIENTES_SERVICIOS = 'DATOS_CLIENTES_SERVICIOS',
    DATOS_PROVINCIAS = 'DATOS_PROVINCIAS',
    DATOS_CLIENTES = 'DATOS_CLIENTES',
    DATOS_EMPRESAS = 'DATOS_EMPRESAS',
    DATOS_FICHAS = 'DATOS_FICHAS',
    DATOS_SERVICIOS = 'DATOS_SERVICIOS',
    DATOS_MOVILES = 'DATOS_MOVILES',

    //generales
    NOMBRETABLA = 'NOMBRETABLA',
    DEFINICION_PERMISOS = 'DEFINICION_PERMISOS',
    MODIFICARCAMPO = 'MODIFICARCAMPO',
}

export class CargaPermisos implements Action {
    readonly type = CargaDatosActionTypes.DEFINICION_PERMISOS;
    constructor(public permisos: any) { }
}

export class CargaNombreTabla implements Action {
    readonly type = CargaDatosActionTypes.NOMBRETABLA;
    constructor(public nombre: any) { }
}

export class ModificarCampoTabla implements Action {
    readonly type = CargaDatosActionTypes.MODIFICARCAMPO;
    constructor(public campo: any) { }
}



export class CargaDatosFacturacion implements Action {
    readonly type = CargaDatosActionTypes.DATOS_FACTURACION;
    constructor(public datos: any) { }
}
export class CargaDatosClientesServicios implements Action {
    readonly type = CargaDatosActionTypes.DATOS_CLIENTES_SERVICIOS;
    constructor(public datos: any) { }
}
export class CargaDatosClientes implements Action {
    readonly type = CargaDatosActionTypes.DATOS_CLIENTES;
    constructor(public datos: any) { }
}
export class CargaDatosEmpresas implements Action {
    readonly type = CargaDatosActionTypes.DATOS_EMPRESAS;
    constructor(public datos: any) { }
}
export class CargaDatosProvincias implements Action {
    readonly type = CargaDatosActionTypes.DATOS_PROVINCIAS;
    constructor(public datos: any) { }
}
export class CargaDatosServicios implements Action {
    readonly type = CargaDatosActionTypes.DATOS_SERVICIOS;
    constructor(public datos: any) { }
}
export class CargaDatosFichas implements Action {
    readonly type = CargaDatosActionTypes.DATOS_FICHAS;
    constructor(public datos: any) { }
}
export class CargaDatosMoviles implements Action {
    readonly type = CargaDatosActionTypes.DATOS_MOVILES;
    constructor(public datos: any) { }
}






export type CargaDatosActions = CargaDatosFacturacion | CargaDatosClientesServicios |
    CargaDatosClientes | CargaDatosEmpresas | CargaDatosProvincias | CargaDatosServicios |
    CargaDatosFichas | CargaDatosMoviles | CargaPermisos | CargaNombreTabla | ModificarCampoTabla;





/*
export const CARGA_COLUMNAS_FACTURACION= 'CARGA_COLUMNAS_FACTURACION';
export const CARGA_COLUMNAS_CLIENTES_SERVICIOS = 'CARGA_COLUMNAS_CLIENTES_SERVICIOS';
export const CARGA_COLUMNAS_CLIENTES = 'CARGA_COLUMNAS_CLIENTES';
export const CARGA_COLUMNAS_EMPRESAS = 'CARGA_COLUMNAS_EMPRESAS';
export const CARGA_COLUMNAS_PROVINCIAS = 'CARGA_COLUMNAS_PROVINCIAS';
export const CARGA_COLUMNAS_SERVICIOS = 'CARGA_COLUMNAS_SERVICIOS';
export const CARGA_COLUMNAS_FICHAS = 'CARGA_COLUMNAS_FICHAS';
export const CARGA_COLUMNAS_MOVILES = 'CARGA_COLUMNAS_MOVILES';

export const CARGA_FACTURACION='CARGA_FACTURACION';
export const CARGA_CLIENTES_SERVICIOS = 'CARGA_CLIENTES_SERVICIOS';
export const CARGA_PROVINCIAS = 'CARGA_PROVINCIAS';
export const CARGA_CLIENTES = 'CARGA_CLIENTES';
export const CARGA_EMPRESAS = 'CARGA_EMPRESAS';
export const CARGA_FICHAS = 'CARGA_FICHAS';
export const CARGA_SERVICIOS = 'CARGA_SERVICIOS';
export const CARGA_MOVILES = 'CARGA_MOVILES';
*/
