import { ColumnasRelacionalesActions, ColumnasRelacionalesActionTypes } from '../../actions/administracion.actions/columnas_relacionales.action';
//import { Action } from '@ngrx/store';

//Defino las variables de mi state.
export interface ColumnasRelacionalesState {
    lastUpdate: Date;

    columnas_relacionales_clientes_servicios: any;
    columnas_relacionales_provincias: any;
    columnas_relacionales_empresas: any;
    columnas_relacionales_clientes: any;
    columnas_relacionales_fichas: any;
    columnas_relacionales_moviles: any;
    columnas_relacionales_servicios: any;
    columnas_relacionales_facturacion: any;
    //clientes_servicios: any;
}

//Inicializo las variables de mi store.
const initialState: ColumnasRelacionalesState = {
    lastUpdate: null,

    columnas_relacionales_clientes_servicios: [],
    columnas_relacionales_provincias: [],
    columnas_relacionales_empresas: [],
    columnas_relacionales_clientes: [],
    columnas_relacionales_fichas: [],
    columnas_relacionales_moviles: [],
    columnas_relacionales_servicios: [],
    columnas_relacionales_facturacion: [],
    //clientes_servicios: [],
}

export function ColumnasRelacionalesReducer(state = initialState, action: ColumnasRelacionalesActions): ColumnasRelacionalesState {
    switch (action.type) {
        case ColumnasRelacionalesActionTypes.RELACIONALES_FACTURACION:
            return Object.assign({}, state, {
                columnas_relacionales_facturacion: action.relacionales,
                lastUpdate: new Date()
            })

        case ColumnasRelacionalesActionTypes.RELACIONALES_CLIENTES_SERVICIOS:
            return Object.assign({}, state, {
                columnas_relacionales_clientes_servicios: action.relacionales,
                lastUpdate: new Date()
            })

        case ColumnasRelacionalesActionTypes.RELACIONALES_CLIENTES:
            return Object.assign({}, state, {
                columnas_relacionales_clientes: action.relacionales,
                lastUpdate: new Date()
            })
        case ColumnasRelacionalesActionTypes.RELACIONALES_EMPRESAS:
            return Object.assign({}, state, {
                columnas_relacionales_empresas: action.relacionales,
                lastUpdate: new Date()
            })
        case ColumnasRelacionalesActionTypes.RELACIONALES_DIVISION_TERRITORIAL:
            return Object.assign({}, state, {
                columnas_relacionales_provincias: action.relacionales,
                lastUpdate: new Date()
            })
        case ColumnasRelacionalesActionTypes.RELACIONALES_SERVICIOS:
            return Object.assign({}, state, {
                columnas_relacionales_servicios: action.relacionales,
                lastUpdate: new Date()
            })
        case ColumnasRelacionalesActionTypes.RELACIONALES_FICHAS:
            return Object.assign({}, state, {
                columnas_relacionales_fichas: action.relacionales,
                lastUpdate: new Date()
            })
        case ColumnasRelacionalesActionTypes.RELACIONALES_MOVILES:
            return Object.assign({}, state, {
                columnas_relacionales_moviles: action.relacionales,
                lastUpdate: new Date()
            })
        default:
            return state;
    }

}


//Implementar métodos para obtener el estado de cada variable del store
