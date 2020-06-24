/*********************/
//En la llamada a los módulos:
//[0]:Nombre de la tabla
//[1]:Columnas
//[2]:Carga
//[3]:Modificación
//[4]:Datos temporales para el pop-up
//[5]:Tablas relacionales
/********************/

//export const DATO_FILTRADO = 'DATO_FILTRADO';
export const CARGA_MODELO = 'CARGA_MODELO';
export const DATOS_FACTURACION_ADICIONALES = 'DATOS_FACTURACION_ADICIONALES';
export const ACTUALIZAR_GRILLA = 'ACTUALIZAR_GRILLA';

export const COLUMNAS_FACTURACION = 'COLUMNAS_FACTURACION';
export const COLUMNAS_CLIENTES_SERVICIOS = 'COLUMNAS_CLIENTES_SERVICIOS';
export const COLUMNAS_CLIENTES = 'COLUMNAS_CLIENTES';
export const COLUMNAS_EMPRESAS = 'COLUMNAS_EMPRESAS';
export const COLUMNAS_PROVINCIAS = 'COLUMNAS_PROVINCIAS';
export const COLUMNAS_SERVICIOS = 'COLUMNAS_SERVICIOS';
export const COLUMNAS_FICHAS = 'COLUMNAS_FICHAS';
export const COLUMNAS_MOVILES = 'COLUMNAS_MOVILES';
export const COLUMNAS_CALLEJERO = 'COLUMNAS_CALLEJERO';

export const CARGA_MAPA = 'CARGA_MAPA';

export const DATOS_FACTURACION = 'DATOS_FACTURACION';
export const DATOS_CLIENTES_SERVICIOS = 'DATOS_CLIENTES_SERVICIOS';
export const DATOS_PROVINCIAS = 'DATOS_PROVINCIAS';
export const DATOS_CLIENTES = 'DATOS_CLIENTES';
export const DATOS_EMPRESAS = 'DATOS_EMPRESAS';
export const DATOS_FICHAS = 'DATOS_FICHAS';
export const DATOS_SERVICIOS = 'DATOS_SERVICIOS';
export const DATOS_MOVILES = 'DATOS_MOVILES';
export const DATOS_CALLEJERO = 'DATOS_CALLEJERO';

export const MODIFICACION_FACTURACION = 'MODIFICACION_FACTURACION';
export const MODIFICACION_CLIENTES_SERVICIOS = 'MODIFICACION_CLIENTES_SERVICIOS';
export const MODIFICACION_EMPRESAS = 'MODIFICACION_EMPRESAS';
export const MODIFICACION_DIVISIONTERRITORIAL = 'MODIFICACION_DIVISIONTERRITORIAL';
export const MODIFICACION_CLIENTES = 'MODIFICACION_CLIENTES';
export const MODIFICACION_FICHAS = 'MODIFICACION_FICHAS';
export const MODIFICACION_SERVICIOS = 'MODIFICACION_SERVICIOS';
export const MODIFICACION_MOVILES = 'MODIFICACION_MOVILES';
export const MODIFICACION_CALLEJERO = 'MODIFICACION_CALLEJERO';

export const MODIFICARCAMPO = 'MODIFICARCAMPO';
/*
export const DATOS_DIVISION_TERRITORIAL = 'DATOS_DIVISION_TERRITORIAL';
export const DATOS_EMPRESAS = 'DATOS_EMPRESAS';
export const DATOS_CLIENTES = 'DATOS_CLIENTES';
export const DATOS_FICHAS = 'DATOS_FICHAS';
export const DATOS_SERVICIOS = 'DATOS_SERVICIOS';
export const DATOS_MOVILES = 'DATOS_MOVILES';
export const DATOS_CLIENTES_SERVICIOS = 'DATOS_CLIENTES_SERVICIOS';
export const DATOS_FACTURACION = 'DATOS_FACTURACION';
*/
export const RELACIONALES_DIVISION_TERRITORIAL = 'RELACIONALES_DIVISION_TERRITORIAL';
export const RELACIONALES_EMPRESAS = 'RELACIONALES_EMPRESAS';
export const RELACIONALES_CLIENTES = 'RELACIONALES_CLIENTES';
export const RELACIONALES_FICHAS = 'RELACIONALES_FICHAS';
export const RELACIONALES_SERVICIOS = 'RELACIONALES_SERVICIOS';
export const RELACIONALES_MOVILES = 'RELACIONALES_MOVILES';
export const RELACIONALES_CLIENTES_SERVICIOS = 'RELACIONALES_CLIENTES_SERVICIOS';
export const RELACIONALES_FACTURACION = 'RELACIONALES_FACTURACION';
export const RELACIONALES_CALLEJERO = 'RELACIONALES_CALLEJERO';

export const CARGA_COLUMNAS = 'CARGA_COLUMNAS';
export const DEFINICION_PERMISOS = 'DEFINICION_PERMISOS';
export const NOMBRETABLA = 'NOMBRETABLA';

export const ADD_TODO = 'ADD_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const REMOVE_TODO = 'REMOVE_TODO';
export const REMOVE_ALL_TODOS = 'REMOVE_ALL_TODOS';

export const MODULOS = {
    division_territorial: [
        { nombre: 'provincias' },
        { type: COLUMNAS_PROVINCIAS, columnas: '' },
        { type: DATOS_PROVINCIAS, datos: '' },
        { type: MODIFICACION_DIVISIONTERRITORIAL, datos: '' },
        //{ type: DATOS_DIVISION_TERRITORIAL, datos: '' },
        { type: RELACIONALES_DIVISION_TERRITORIAL, relacionales: '' }
    ],
    empresa: [
        { nombre: 'empresas' },
        { type: COLUMNAS_EMPRESAS, columnas: '' },
        { type: DATOS_EMPRESAS, datos: '' },
        { type: MODIFICACION_EMPRESAS, datos: '' },
        //{ type: DATOS_EMPRESAS, datos: '' },
        { type: RELACIONALES_EMPRESAS, relacionales: '' }
    ],
    cliente: [
        { nombre: 'clientes' },
        { type: COLUMNAS_CLIENTES, columnas: '' },
        { type: DATOS_CLIENTES, datos: '' },
        { type: MODIFICACION_CLIENTES, datos: '' },
        //{ type: DATOS_CLIENTES, datos: '' },
        { type: RELACIONALES_CLIENTES, relacionales: '' }
    ],
    ficha: [
        { nombre: 'fichas' },
        { type: COLUMNAS_FICHAS, columnas: '' },
        { type: DATOS_FICHAS, datos: '' },
        { type: MODIFICACION_FICHAS, datos: '' },
        //{ type: DATOS_FICHAS, datos: '' },
        { type: RELACIONALES_FICHAS, relacionales: '' }
    ],
    servicio: [
        { nombre: 'servicios' },
        { type: COLUMNAS_SERVICIOS, columnas: '' },
        { type: DATOS_SERVICIOS, datos: '' },
        { type: MODIFICACION_SERVICIOS, datos: '' },
        //{ type: DATOS_SERVICIOS, datos: '' },
        { type: RELACIONALES_SERVICIOS, relacionales: '' }
    ],
    movil: [
        { nombre: 'moviles' },
        { type: COLUMNAS_MOVILES, columnas: '' },
        { type: DATOS_MOVILES, datos: '' },
        { type: MODIFICACION_MOVILES, datos: '' },
        //{ type: DATOS_MOVILES, datos: '' },
        { type: RELACIONALES_MOVILES, relacionales: '' }
    ],
    cliente_servicio: [
        { nombre: 'clientes_servicios' },
        { type: COLUMNAS_CLIENTES_SERVICIOS, columnas: '' },
        { type: DATOS_CLIENTES_SERVICIOS, datos: '' },
        { type: MODIFICACION_CLIENTES_SERVICIOS, datos: '' },
        //{ type: DATOS_CLIENTES_SERVICIOS, datos: '' },
        { type: RELACIONALES_CLIENTES_SERVICIOS, relacionales: '' }
    ],
    facturacion: [
        { nombre: 'facturacion' },
        { type: COLUMNAS_FACTURACION, columnas: '' },
        { type: DATOS_FACTURACION, datos: '' },
        { type: MODIFICACION_FACTURACION, datos: '' },
        //{ type: DATOS_FACTURACION, datos: '' },
        { type: RELACIONALES_FACTURACION, relacionales: '' }
    ],
    callejero: [
        { nombre: 'callejero' },
        { type: COLUMNAS_CALLEJERO, columnas: '' },
        { type: DATOS_CALLEJERO, datos: '' },
        { type: MODIFICACION_CALLEJERO, datos: '' },
        //{ type: DATOS_FACTURACION, datos: '' },
        { type: RELACIONALES_CALLEJERO, relacionales: '' }
    ],
}
/*
export const ELEGIR_OBSERVER = {
    divisionterritorial: { nombre: 'provincias' },
    empresa: { nombre: 'empresas' },
    cliente: { nombre: 'clientes' },
    ficha: { nombre: 'fichas' },
    servicio: { nombre: 'servicios' },
    movil: { nombre: 'moviles' },
};
*/
