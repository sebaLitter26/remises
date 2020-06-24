import {
    CargaDatosActions,
    CargaDatosActionTypes
} from '../../actions/administracion.actions';

import {
    ModificacionActions,
    ModificacionActionTypes
} from '../../actions/administracion.actions/modificacion.action';


import {
    ClienteServicio,
    DivisionTerritorial,
    Empresa,
    Cliente,
    Ficha,
    Movil,
    Servicio,
    Mapa,
    Facturacion,
    //Modificacion,
} from '../../../models/administracion.models/index.models';

//Defino las variables de mi state.
export interface DatosState {
    lastUpdate: Date;
    permiso: boolean;
    nombre: string;
    idCampo: number;
    error: any;

    provincias: Array<DivisionTerritorial>;
    empresas: Array<Empresa>;
    clientes: Array<Cliente>;
    fichas: Array<Ficha>;
    moviles: Array<Movil>;
    servicios: Array<Servicio>;
    facturacion: Array<Facturacion>;
    clientes_servicios: Array<ClienteServicio>;
}

//Inicializo las variables de mi store.
const initialState: DatosState = {
    lastUpdate: null,
    permiso: null,
    nombre: null,
    idCampo: null,
    error: null,

    provincias: [],
    empresas: [],
    clientes: [],
    fichas: [],
    moviles: [],
    servicios: [],
    facturacion: [],
    clientes_servicios: [],
}


export function DatosReducer(state = initialState, action: CargaDatosActions | ModificacionActions): DatosState {
    switch (action.type) {
        case CargaDatosActionTypes.DEFINICION_PERMISOS:
            return Object.assign({}, state, {
                permiso: action.permisos,
                lastUpdate: new Date()
            })
        case CargaDatosActionTypes.NOMBRETABLA:
            return Object.assign({}, state, {
                nombre: action.nombre,
                lastUpdate: new Date()
            })


        case CargaDatosActionTypes.MODIFICARCAMPO:
            console.log("Estoy en el reducer de MODIFICARCAMPO", action.campo);
            return Object.assign({}, state, {
                //update: action.campo,
                nombre: action.campo.nombre_tabla,
                idCampo: action.campo.id,
                lastUpdate: new Date()
            })


        case CargaDatosActionTypes.DATOS_FACTURACION:
            return Object.assign({}, state, {
                facturacion: action.datos,
                lastUpdate: new Date()
            })

        case CargaDatosActionTypes.DATOS_CLIENTES_SERVICIOS:
            return Object.assign({}, state, {
                clientes_servicios: action.datos,
                lastUpdate: new Date()
            })

        case CargaDatosActionTypes.DATOS_PROVINCIAS:
            return Object.assign({}, state, {
                provincias: action.datos,
                lastUpdate: new Date()
            })

        case CargaDatosActionTypes.DATOS_EMPRESAS:
            return Object.assign({}, state, {
                empresas: action.datos,
                lastUpdate: new Date()
            })
        case CargaDatosActionTypes.DATOS_CLIENTES:
            return Object.assign({}, state, {
                clientes: action.datos,
                lastUpdate: new Date()
            })
        case CargaDatosActionTypes.DATOS_SERVICIOS:
            return Object.assign({}, state, {
                servicios: action.datos,
                lastUpdate: new Date()
            })
        case CargaDatosActionTypes.DATOS_FICHAS:
            return Object.assign({}, state, {
                fichas: action.datos,
                lastUpdate: new Date()
            })

        case CargaDatosActionTypes.DATOS_MOVILES:
            return Object.assign({}, state, {
                moviles: action.datos,
                lastUpdate: new Date()
            })

        case ModificacionActionTypes.CAMBIAR_GRILLA_FAIL:
            console.log("Algo salió mal", action.payload);
            return Object.assign({}, state, {
                ...state,
                error: {
                    status: action.payload.statusText,
                    message: action.payload.error,
                    url: action.payload.url
                }
            })

        case ModificacionActionTypes.MODIFICACION_FACTURACION:
            var index = state.facturacion.findIndex(t => t.id_movil === action.datos.id);
            if (index < 0) { index = state.facturacion.length; }
            return Object.assign({}, state, {
                facturacion: [
                    ...state.facturacion.slice(0, index),
                    Object.assign({}, state.facturacion[index], action.datos),
                    ...state.facturacion.slice(index + 1)
                ],
                lastUpdate: new Date()
            })

        case ModificacionActionTypes.MODIFICACION_CLIENTES_SERVICIOS:
            var index = state.clientes_servicios.findIndex(t => t.id === action.datos.id);
            if (index < 0) { index = state.clientes_servicios.length; }
            return Object.assign({}, state, {
                clientes_servicios: [
                    ...state.clientes_servicios.slice(0, index),
                    Object.assign({}, state.clientes_servicios[index], action.datos),
                    ...state.clientes_servicios.slice(index + 1)
                ],
                lastUpdate: new Date()
            })

        case ModificacionActionTypes.MODIFICACION_DIVISIONTERRITORIAL:
            var index = state.provincias.findIndex(t => t.id === action.datos.id);
            if (index < 0) { index = state.provincias.length; }
            return Object.assign({}, state, {
                provincias: [
                    ...state.provincias.slice(0, index),
                    Object.assign({}, state.provincias[index], action.datos),
                    ...state.provincias.slice(index + 1)
                ],
                lastUpdate: new Date()
            })

        case ModificacionActionTypes.MODIFICACION_EMPRESAS:
            var index = state.empresas.findIndex(t => t.id === action.datos.id);
            if (index < 0) { index = state.empresas.length; }
            return Object.assign({}, state, {
                empresas: [
                    ...state.empresas.slice(0, index),
                    Object.assign({}, state.empresas[index], action.datos),
                    ...state.empresas.slice(index + 1)
                ],
                lastUpdate: new Date()
            })

        case ModificacionActionTypes.MODIFICACION_CLIENTES:
            console.log('MODIFICACION_CLIENTES', action)
            var index = state.clientes.findIndex(t => t.id === action.datos.id);
            if (index < 0) { index = state.clientes.length; }
            return Object.assign({}, state, {
                clientes: [
                    ...state.clientes.slice(0, index),
                    Object.assign({}, state.clientes[index], action.datos),
                    ...state.clientes.slice(index + 1)
                ],
                lastUpdate: new Date()
            })

        case ModificacionActionTypes.MODIFICACION_FICHAS:
            var index = state.fichas.findIndex(t => t.id === action.datos.id);
            if (index < 0) { index = state.fichas.length; }
            return Object.assign({}, state, {
                fichas: [
                    ...state.fichas.slice(0, index),
                    Object.assign({}, state.fichas[index], action.datos),
                    ...state.fichas.slice(index + 1)
                ],
                lastUpdate: new Date()
            })

        case ModificacionActionTypes.MODIFICACION_SERVICIOS:
            var index = state.servicios.findIndex(t => t.id === action.datos.id);
            if (index < 0) { index = state.servicios.length; }
            return Object.assign({}, state, {
                servicios: [
                    ...state.servicios.slice(0, index),
                    Object.assign({}, state.servicios[index], action.datos),
                    ...state.servicios.slice(index + 1)
                ],
                lastUpdate: new Date()
            })

        case ModificacionActionTypes.MODIFICACION_MOVILES:
            var index = state.moviles.findIndex(t => t.id === action.datos.id);
            if (index < 0) { index = state.moviles.length; }
            return Object.assign({}, state, {
                moviles: [
                    ...state.moviles.slice(0, index),
                    Object.assign({}, state.moviles[index], action.datos),
                    ...state.moviles.slice(index + 1)
                ],
                lastUpdate: new Date()
            })


        default:
            return state;
    }

}





//Implementar métodos para obtener el estado de cada variable del store
