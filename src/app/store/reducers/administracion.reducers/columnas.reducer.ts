import { ColumnasActions, ColumnasActionTypes } from '../../actions/administracion.actions/columnas.action';
//import { Action } from '@ngrx/store';

//Defino las variables de mi state.
export interface ColumnasState {
    lastUpdate: Date;

    columnas_clientes_servicios: any;
    columnas_provincias: any;
    columnas_empresas: any;
    columnas_clientes: any;
    columnas_fichas: any;
    columnas_moviles: any;
    columnas_servicios: any;
    columnas_facturacion: any;
    clientes_servicios: any;
}

//Inicializo las variables de mi store.
const initialState: ColumnasState = {
    lastUpdate: null,

    columnas_clientes_servicios: [],
    columnas_provincias: [],
    columnas_empresas: [],
    columnas_clientes: [],
    columnas_fichas: [],
    columnas_moviles: [],
    columnas_servicios: [],
    columnas_facturacion: [],
    clientes_servicios: [],
}

export function ColumnasReducer(state = initialState, action: ColumnasActions): ColumnasState {
    switch (action.type) {
        case ColumnasActionTypes.COLUMNAS_FACTURACION:
            return Object.assign({}, state, {
                columnas_facturacion: action.columnas,
                lastUpdate: new Date()
            })

        case ColumnasActionTypes.COLUMNAS_CLIENTES_SERVICIOS:
            return Object.assign({}, state, {
                columnas_clientes_servicios: action.columnas,
                lastUpdate: new Date()
            })

        case ColumnasActionTypes.COLUMNAS_CLIENTES:
            return Object.assign({}, state, {
                columnas_clientes: action.columnas,
                lastUpdate: new Date()
            })
        case ColumnasActionTypes.COLUMNAS_EMPRESAS:
            return Object.assign({}, state, {
                columnas_empresas: action.columnas,
                lastUpdate: new Date()
            })
        case ColumnasActionTypes.COLUMNAS_PROVINCIAS:
            return Object.assign({}, state, {
                columnas_provincias: action.columnas,
                lastUpdate: new Date()
            })
        case ColumnasActionTypes.COLUMNAS_SERVICIOS:
            return Object.assign({}, state, {
                columnas_servicios: action.columnas,
                lastUpdate: new Date()
            })
        case ColumnasActionTypes.COLUMNAS_FICHAS:
            return Object.assign({}, state, {
                columnas_fichas: action.columnas,
                lastUpdate: new Date()
            })
        case ColumnasActionTypes.COLUMNAS_MOVILES:
            return Object.assign({}, state, {
                columnas_moviles: action.columnas,
                lastUpdate: new Date()
            })
        default:
            return state;
    }

}


//Implementar métodos para obtener el estado de cada variable del store
